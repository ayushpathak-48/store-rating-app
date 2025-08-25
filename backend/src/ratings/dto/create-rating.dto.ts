import { IsInt, Min, Max, IsNotEmpty } from "class-validator";

export class RatingDto {
  @IsNotEmpty({ message: "storeId is required" })
  storeId: string;

  @Max(5)
  @Min(1)
  @IsInt()
  @IsNotEmpty({ message: "rating is required" })
  rating: number;
}
