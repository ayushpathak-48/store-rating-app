import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
      orderBy: {
        createdAt: "desc",
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

  async deleteUser(id: string, user: User) {
    const userExists = await this.prisma.user.findUnique({
      where: { id },
      include: {
        store: true,
        ratings: true,
      },
    });

    if (!userExists) {
      throw new NotFoundException({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "SYSTEM_ADMIN" && user.id !== id) {
      throw new ForbiddenException({
        success: false,
        message: "You are not permitted to delete the user",
      });
    }

    const deletedUser = await this.prisma.$transaction(async (tx) => {
      await tx.rating.deleteMany({
        where: { userId: id },
      });

      await tx.store.deleteMany({
        where: { ownerId: id },
      });

      return await tx.user.delete({
        where: { id },
      });
    });

    return {
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    };
  }
}
