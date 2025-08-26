import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { RatingsService } from "./ratings.service";
import { RatingDto } from "./dto/create-rating.dto";
import { JwtAuthGuard } from "src/auth/guards/auth.guard";

@Controller("ratings")
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get(":storeId")
  async getStoreRatings(storeId: string) {
    return this.ratingsService.getStoreRatings(storeId);
  }

  @Get("total")
  async getRatingsCount() {
    return this.ratingsService.getRatingsCount();
  }

  @Post()
  async rateStore(@Request() req, @Body() dto: RatingDto) {
    return this.ratingsService.rateStore(req.user.id as string, dto);
  }
}
