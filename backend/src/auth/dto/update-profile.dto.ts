import { Role } from "@prisma/client";
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from "class-validator";

export class UpdteProfileDto {
  @MaxLength(60, { message: "Name cannot exceed 60 characters" })
  @MinLength(20, { message: "Name must be at least 20 characters long" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @MaxLength(400, { message: "Address cannot exceed 400 characters" })
  @IsNotEmpty({ message: "Address is required" })
  address: string;

  @IsOptional()
  role: Role;
}
