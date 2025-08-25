import { IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";

export class updatePasswordDto {
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message:
      "Old Password must contain at least one uppercase letter and one special character",
  })
  @MaxLength(16, { message: "Old Password cannot exceed 16 characters" })
  @MinLength(8, { message: "Old Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Old Password is required" })
  old_password: string;

  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message:
      "New Password must contain at least one uppercase letter and one special character",
  })
  @MaxLength(16, { message: "New Password cannot exceed 16 characters" })
  @MinLength(8, { message: "New Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "New Password is required" })
  new_password: string;
}
