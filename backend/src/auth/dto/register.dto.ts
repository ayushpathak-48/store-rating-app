import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  NotEquals,
} from "class-validator";
import { Role } from "@prisma/client";

export class RegisterDto {
  @IsNotEmpty({ message: "Name is required" })
  @MinLength(3, { message: "Name must be at least 3 characters" })
  @MaxLength(60, { message: "Name cannot exceed 60 characters" })
  name: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  password: string;

  @IsNotEmpty({ message: "Address is required" })
  address: string;

  @IsEnum(Role, {
    message: `Role must be one of: ${Object.values(Role)
      .filter((role) => role != "SYSTEM_ADMIN")
      .join(", ")}`,
  })
  @NotEquals(Role.SYSTEM_ADMIN, { message: "Cannot register as SYSTEM_ADMIN" })
  role: Role;
}
