import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Role, User } from "@prisma/client";
import { CreateStoreDto } from "./dto/create-store.dto";
import { UpdateStoreDto } from "./dto/update-store.dto";

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async createStore(dto: CreateStoreDto) {
    const ownerExists = await this.prisma.user.findUnique({
      where: { id: dto.ownerId },
    });

    if (!ownerExists) {
      throw new BadRequestException(
        "Owner does not exist. Please provide a valid ownerId.",
      );
    }

    const createdStore = await this.prisma.store.create({
      data: {
        name: dto.name,
        address: dto.address,
        email: dto.email,
        ownerId: dto.ownerId,
      },
    });

    return {
      success: true,
      data: createdStore,
      message: "Store created successfully",
    };
  }

  async updateStore(id: string, dto: UpdateStoreDto) {
    const storeExists = await this.prisma.store.findUnique({
      where: { id },
    });

    const isEmailUsed = await this.prisma.store.findFirst({
      where: { email: dto.email, id: { not: id } },
    });

    if (isEmailUsed) {
      throw new BadRequestException(
        "Email is already in used by different store. Please use a different email.",
      );
    }

    if (!storeExists) {
      throw new NotFoundException({
        success: false,
        message: "Store not found. Please provide a valid storeId.",
      });
    }

    const updatedStore = await this.prisma.store.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      data: updatedStore,
      message: "Store created successfully",
    };
  }

  async getAllStores() {
    const stores = await this.prisma.store.findMany({
      include: {
        _count: {
          select: { ratings: true },
        },
      },
    });
    return {
      success: true,
      message: "Stores retrieved successfully",
      data: stores,
    };
  }

  async getSingleStore(storeId: string, userRole: Role, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) throw new NotFoundException("Store not found");
    if (userRole === Role.STORE_OWNER && store.ownerId !== userId)
      throw new ForbiddenException("You do not have access to this store");

    return {
      success: true,
      message: "Store retrieved successfully",
      data: store,
    };
  }

  async getStoreRatings(storeId: string, userRole: Role, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { ratings: { include: { user: { omit: { password: true } } } } },
    });

    if (!store) throw new NotFoundException("Store not found");
    if (userRole !== Role.SYSTEM_ADMIN && store.ownerId !== userId)
      throw new ForbiddenException("Access denied");

    return {
      success: true,
      message: "Store ratings retrieved successfully",
      data: store,
    };
  }

  // Get all ratings of a store
  async getSingleStoreAllRatings(storeId: string, user: User) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store)
      throw new NotFoundException({
        success: false,
        message: "Store not found",
      });

    if (user.role !== "SYSTEM_ADMIN") {
      if (store.ownerId !== user.id) {
        throw new UnauthorizedException({
          success: false,
          message: "You are not authorized to view this store ratings",
        });
      }
    }

    const ratings = await this.prisma.rating.findMany({
      where: { storeId },
    });

    return {
      success: true,
      message: "Ratings retrieved successfully",
      data: {
        store,
        ratings,
      },
    };
  }

  // Get total number of ratings of a store
  async getSingleStoreRatingCount(storeId: string) {
    const ratings = await this.prisma.rating.count({
      where: { storeId },
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
