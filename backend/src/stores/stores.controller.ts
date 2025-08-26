import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { StoresService } from "./stores.service";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { Role } from "@prisma/client";
import { CreateStoreDto } from "./dto/create-store.dto";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { UpdateStoreDto } from "./dto/update-store.dto";

@Controller("stores")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post("create")
  @Roles(Role.SYSTEM_ADMIN)
  async createStore(@Body() dto: CreateStoreDto) {
    return this.storesService.createStore(dto);
  }

  @Put(":id")
  @Roles(Role.SYSTEM_ADMIN)
  async updateStore(@Param("id") id: string, @Body() dto: UpdateStoreDto) {
    return this.storesService.updateStore(id, dto);
  }

  @Get()
  getAllStores(@Query("includeRatings") includeRatings?: string) {
    const include = includeRatings === "true";
    return this.storesService.getAllStores(include);
  }

  @Delete(":id")
  @Roles(Role.STORE_OWNER, Role.SYSTEM_ADMIN)
  deleteStore(@Param("id") id: string, @Req() req) {
    return this.storesService.deleteStore(
      id,
      req.user.role as Role,
      req.user.id as string,
    );
  }

  // Get total number of ratings for a store
  @Get(":id/ratings-count")
  async getSingleStoreRatingCount(@Param("id") id: string) {
    return this.storesService.getSingleStoreRatingCount(id);
  }
}
