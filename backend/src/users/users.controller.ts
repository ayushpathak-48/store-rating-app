import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { User } from "@prisma/client";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  // Get all ratings of a user
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete(":userId")
  async deleteUser(@Param("userId") userId: string, @Req() req) {
    return this.userService.deleteUser(userId, req.user as User);
  }

  @Get(":userId/ratings")
  async getSingleUserRating(@Param("userId") userId: string) {
    return this.userService.getSingleUserAllRatings(userId);
  }

  // Get total number of ratings
  @Get(":userId/total-ratings")
  async getSingleUserRatingCount(@Param("userId") userId: string) {
    return this.userService.getSingleUserRatingCount(userId);
  }
}
