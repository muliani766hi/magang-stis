import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateIzinBimbinganSkripsiDto {
  @IsOptional()
  @IsDateString()
  tanggal?: string;

  @IsDateString()
  @IsOptional()
  jamMulai?: string;

  @IsDateString()
  @IsOptional()
  jamSelesai?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}
