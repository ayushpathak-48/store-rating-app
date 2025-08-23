import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Req,
  Delete,
} from "@nestjs/common";
import { RatingsService } from "./ratings.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";
import { Role } from "@prisma/client";

@Controller("ratings")
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  // Get total number of ratings
  @Get("total")
  async getRatingsCount() {
    return this.ratingsService.getRatingsCount();
  }

  // Add or update rating
  @Post()
  async rateStore(@Request() req, @Body() dto: CreateRatingDto) {
    return this.ratingsService.rateStore(req.user.id as string, dto);
  }

  // get single rating by id
  @Get(":ratingId")
  async getSingleRatingById(@Param("ratingId") ratingId: string, @Req() req) {
    return this.ratingsService.getSingleRatingById(
      ratingId,
      req.user.role as Role,
      req.user.id as string,
    );
  }

  @Delete(":ratingId")
  async deleteStoreRatingById(@Param("ratingId") ratingId: string, @Req() req) {
    return this.ratingsService.deleteStoreRatingById(
      ratingId,
      req.user.role as Role,
      req.user.id as string,
    );
  }
}
