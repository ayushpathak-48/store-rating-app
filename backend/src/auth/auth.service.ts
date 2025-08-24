import {
  Injectable,
  UnauthorizedException,
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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{
    success: boolean;
    message: string;
    data: Omit<User, "password">;
  }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException({
        success: false,
        message: "Email already exists try different email",
      });
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const registeredUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        address: dto.address,
        role: dto.role,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = registeredUser;

    return {
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
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

  // Login Service
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException("Invalid credentials");

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      message: "Login successful",
      access_token: this.jwt.sign(payload),
    };
  }

  // Get Profile Service
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
}
