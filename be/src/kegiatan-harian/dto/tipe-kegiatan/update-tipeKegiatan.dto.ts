import { IsOptional, IsString } from "class-validator";

export class UpdateTipeKegiatanDto {
  @IsString()
  @IsOptional()
  nama?: string;

  @IsString()
  @IsOptional()
  satuan?: string;
}
