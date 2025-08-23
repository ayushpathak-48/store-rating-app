import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsUUID,
} from "class-validator";

export class CreateStoreDto {
  @MaxLength(100, { message: "Store name cannot exceed 100 characters" })
  @MinLength(3, { message: "Store name must be at least 3 characters long" })
  @IsString({ message: "Store name must be a string" })
  @IsNotEmpty({ message: "Store name is required" })
  name: string;

  @IsEmail({}, { message: "Invalid store email address" })
  @IsNotEmpty({ message: "Store email is required" })
  email: string;

  @MaxLength(400, { message: "Store address cannot exceed 400 characters" })
  @IsString({ message: "Store address must be a string" })
  @IsNotEmpty({ message: "Store address is required" })
  address: string;

  @IsUUID("4", { message: "Owner ID must be a valid UUID" })
  @IsNotEmpty({ message: "Owner ID is required" })
  ownerId: string;
}
