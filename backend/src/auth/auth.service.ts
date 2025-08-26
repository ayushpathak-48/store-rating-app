import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "@prisma/client";
import { UpdteProfileDto } from "./dto/update-profile.dto";
import { updatePasswordDto } from "./dto/update-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException({
        success: false,
        message: "Email already exists. Try a different one.",
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        address: dto.address,
        role: dto.role,
      },
    });

    const tokens = await this.generateTokens(
      newUser.id,
      newUser.email,
      newUser.role,
    );
    await this.saveRefreshToken(newUser.id, tokens.refreshToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;

    return {
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
      ...tokens,
    };
  }

  async updateUserProfile(
    id: string,
    dto: UpdteProfileDto,
    user: User,
  ): Promise<{
    success: boolean;
    message: string;
    data: Omit<User, "password">;
  }> {
    if (user.id !== id && user.role !== "SYSTEM_ADMIN") {
      throw new ForbiddenException({
        success: false,
        message: "You cannot update this user",
      });
    }
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      throw new NotFoundException({
        success: false,
        message: "User Not found with this id",
      });
    }

    const isEmailAlreadyTaken = await this.prisma.user.findFirst({
      where: { email: dto.email, id: { not: id } },
    });
    if (isEmailAlreadyTaken) {
      throw new ConflictException({
        success: false,
        message: "Email already exists try different email",
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        address: dto.address,
        role: dto.role,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;

    return {
      success: true,
      message: "User updated successfully",
      data: userWithoutPassword,
    };
  }

  async updatePassword(data: updatePasswordDto, user: User) {
    const { old_password, new_password } = data;
    const { id } = user;

    const userToUpdate = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userToUpdate) {
      throw new NotFoundException({
        success: false,
        message: "User Not found with this id",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      old_password,
      userToUpdate.password,
    );

    if (!isPasswordValid)
      throw new ForbiddenException("Your old password is wrong");
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Password updated successfully",
    };
  }

  // Login Service
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) throw new ForbiddenException("Invalid credentials");

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      success: true,
      message: "Login successful",
      ...tokens,
    };
  }

  // Get Profile Service
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { store: true },
      omit: { password: true },
    });
    if (!user)
      throw new NotFoundException({
        success: false,
        message: "User not found",
      });

    return {
      success: true,
      message: "User fetched successfully",
      data: user,
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "15m",
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!storedTokens.length)
      throw new ForbiddenException("No refresh token found");

    // Find the matching token
    const tokenMatch = await Promise.all(
      storedTokens.map(async (t) => ({
        match: await bcrypt.compare(refreshToken, t.token),
        id: t.id,
        expiresAt: t.expiresAt,
      })),
    );

    const matched = tokenMatch.find((t) => t.match);

    if (!matched) throw new ForbiddenException("Invalid refresh token");

    if (matched.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: matched.id } });
      throw new ForbiddenException(
        "Refresh token expired. Please login again.",
      );
    }

    const newTokens = await this.generateTokens(userId, "", "");
    await this.saveRefreshToken(userId, newTokens.refreshToken);

    return {
      success: true,
      message: "Tokens refreshed successfully",
      ...newTokens,
    };
  }

  async logoutFromThisDevice(
    refreshToken: string,
    user: User,
    userId?: string,
  ) {
    const userIdToLogout = userId ?? user.id;

    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId: userIdToLogout },
    });

    if (!storedTokens.length)
      throw new ForbiddenException("No active session found");

    // Find the matching token
    const tokenMatch = await Promise.all(
      storedTokens.map(async (t) => ({
        match: await bcrypt.compare(refreshToken, t.token),
        id: t.id,
      })),
    );

    const matched = tokenMatch.find((t) => t.match);

    if (!matched)
      throw new ForbiddenException("Invalid refresh token for this device");

    await this.prisma.refreshToken.delete({ where: { id: matched.id } });

    return {
      success: true,
      message: "Logged out from this device successfully",
    };
  }

  async logoutFromAllDevices(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return {
      success: true,
      message: "Logged out from all devices successfully",
    };
  }
}
