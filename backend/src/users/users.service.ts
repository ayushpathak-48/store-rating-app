import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });
    return {
      success: true,
      message: "Users retrieved successfully",
      data: users,
    };
  }
  // Get all ratings of a user
  async getSingleUserAllRatings(userId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { userId },
    });
    return {
      success: true,
      message: "Ratings retrieved successfully",
      data: ratings,
    };
  }

  // Get total number of ratings of a user
  async getSingleUserRatingCount(userId: string) {
    const ratings = await this.prisma.rating.count({
      where: { userId },
    });
    return {
      success: true,
      message: "Ratings retrieved successfully",
      data: {
        totalRatings: ratings,
      },
    };
  }
}
