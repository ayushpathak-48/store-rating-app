import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RatingDto } from "./dto/create-rating.dto";
import { Role } from "@prisma/client";

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  // Get total number of ratings
  async getRatingsCount() {
    const ratings = await this.prisma.rating.count();
    return {
      success: true,
      message: "Ratings count retrieved successfully",
      data: {
        totalRatings: ratings,
      },
    };
  }

  // Add or update rating
  async rateStore(userId: string, dto: RatingDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: dto.storeId },
    });

    // If store not found
    if (!store) {
      throw new NotFoundException({
        success: false,
        message: "Store not found",
      });
    }

    const existingRating = await this.prisma.rating.findFirst({
      where: {
        userId,
        storeId: dto.storeId,
      },
    });

    // If existing rating found then update
    if (existingRating) {
      const data = await this.prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating: dto.rating },
      });
      return { success: true, message: "Rating updated successfully", data };
    }

    const data = await this.prisma.rating.create({
      data: {
        rating: dto.rating,
        userId,
        storeId: dto.storeId,
      },
    });
    return { success: true, message: "Rating added successfully", data };
  }

  // delete single rating of a store
  async deleteStoreRatingById(
    ratingId: string,
    userRole: Role,
    userId: string,
  ) {
    const singleRating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!singleRating) {
      throw new NotFoundException({
        success: false,
        message: "Rating not found",
      });
    }

    if (singleRating.userId !== userId && userRole !== "SYSTEM_ADMIN") {
      throw new NotFoundException({
        success: false,
        message: "Rating not found",
      });
    }
    const isDeleted = await this.prisma.rating.delete({
      where: { id: ratingId },
    });
    return {
      success: true,
      message: "Rating deleted successfully",
      data: isDeleted,
    };
  }
}
