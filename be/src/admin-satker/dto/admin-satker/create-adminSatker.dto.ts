import { IsEmail, IsString } from "class-validator";

export class CreateAdminSatkerDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  nama: string;

  @IsString()
  nip: string;
}
