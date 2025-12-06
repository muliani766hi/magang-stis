import { IsNotEmpty, IsString } from "class-validator";

export class CreateProvinsiDto {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsString()
  kodeProvinsi: string;
}
