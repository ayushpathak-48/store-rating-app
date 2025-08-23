import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async createStore(data: {
    name: string;
    email: string;
    address: string;
    ownerId: string;
  }) {
    return this.prisma.store.create({ data });
  }

  async getAllStores() {
    return this.prisma.store.findMany({
      include: {
        ratings: true,
      },
    });
  }

  async getStoreRatings(storeId: string, userRole: Role, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { ratings: { include: { user: true } } },
    });

    if (!store) throw new NotFoundException("Store not found");
    if (userRole !== Role.SYSTEM_ADMIN && store.ownerId !== userId)
      throw new ForbiddenException("Access denied");

    return {
      store: store.name,
      averageRating:
        store.ratings.reduce((acc, r) => acc + r.rating, 0) /
          store.ratings.length || 0,
      ratings: store.ratings,
    };
  }
}
