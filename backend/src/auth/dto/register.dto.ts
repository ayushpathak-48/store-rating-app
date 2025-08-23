import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from "class-validator";

export class RegisterDto {
  @MaxLength(60, { message: "Name cannot exceed 60 characters" })
  @MinLength(20, { message: "Name must be at least 20 characters long" })
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @IsEmail({}, { message: "Invalid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message:
      "Password must contain at least one uppercase letter and one special character",
  })
  @MaxLength(16, { message: "Password cannot exceed 16 characters" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @MaxLength(400, { message: "Address cannot exceed 400 characters" })
  @IsNotEmpty({ message: "Address is required" })
  address: string;
}
