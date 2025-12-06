import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";






export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString({
    message: 'Password must be a string'
  })
  @MinLength(8, {
    message: 'Password must be at least 8 characters'
  })
  password?: string;
}
