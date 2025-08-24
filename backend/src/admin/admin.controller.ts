import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SYSTEM_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats")
  async getStats() {
    return this.adminService.getStats();
  }

  @Get("users/:userId")
  getProfile(@Param("userId") userId: string) {
    return this.adminService.getProfile(userId);
  }
}
