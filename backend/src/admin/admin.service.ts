import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalStores = await this.prisma.store.count();
    const totalRatings = await this.prisma.rating.count();
    console.log("Fetching stats");
    return {
      success: true,
      message: "Stats fetched successfully",
      data: { totalUsers, totalStores, totalRatings },
    };
  }

  async getProfile(id: string) {
    const userData = await this.prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!userData)
      throw new NotFoundException({
        success: false,
        message: "User not found with the given id",
      });

    const user = await this.prisma.user.findUnique({
      where: { id },
      include:
        userData.role === "USER"
          ? { ratings: true }
          : {
              store: {
                include: { ratings: true },
              },
            },
    });
    return {
      success: true,
      message: "User fetched successfully",
      data: user,
    };
  }
}
