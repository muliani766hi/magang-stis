import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdatePembimbingLapanganDto {
  @IsOptional()
  @IsString()
  nip?: string;

  @IsString()
  @IsOptional()
  nama?: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}
