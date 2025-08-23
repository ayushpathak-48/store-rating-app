import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { StoresService } from "./stores.service";
import { AuthGuard } from "@nestjs/passport";
import { Role } from "@prisma/client";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";

@Controller("stores")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post("create")
  @Roles(Role.SYSTEM_ADMIN as Role, Role.STORE_OWNER as Role)
  createStore(
    @Body()
    body: {
      name: string;
      email: string;
      address: string;
      ownerId: string;
    },
  ) {
    return this.storesService.createStore(body);
  }

  @Get()
  getAllStores() {
    return this.storesService.getAllStores();
  }

  @Get(":id/ratings")
  @Roles(Role.STORE_OWNER as Role, Role.SYSTEM_ADMIN as Role)
  getStoreRatings(@Param("id") id: string, @Req() req) {
    return this.storesService.getStoreRatings(
      id,
      req.user.role as Role,
      req.user.id as string,
    );
  }
}
