import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./guards/auth.guard";
import { UpdteProfileDto } from "./dto/update-profile.dto";
import { User } from "@prisma/client";
import { updatePasswordDto } from "./dto/update-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Put("profile/:userId")
  @UseGuards(JwtAuthGuard)
  async updateUserProfile(
    @Body() dto: UpdteProfileDto,
    @Param("userId") userId: string,
    @Req() req,
  ) {
    return this.authService.updateUserProfile(userId, dto, req.user as User);
  }

  @Put("password")
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Req() req, @Body() data: updatePasswordDto) {
    return this.authService.updatePassword(data, req.user);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.id as string);
  }

  @Post("logout")
  logoutDevice(
    @Body() body: { userId?: string; refreshToken: string },
    @Req() req,
  ) {
    return this.authService.logoutFromThisDevice(
      body.refreshToken,
      req.user as User,
      body.userId,
    );
  }

  @Post("logout-all")
  logoutAll(@Body() body: { userId: string }) {
    return this.authService.logoutFromAllDevices(body.userId);
  }

  @Post("refresh")
  refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }
}
