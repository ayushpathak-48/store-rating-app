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

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
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

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user.id as string);
  }
}
