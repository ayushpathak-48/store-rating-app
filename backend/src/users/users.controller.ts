import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  // Get all ratings of a user
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
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
