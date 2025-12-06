import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLaporanMagangDto {
  @IsDateString()
  @IsOptional()
  tanggal?: string;

  @IsOptional()
  @IsString()
  komentar?: string;

  @IsOptional()
  @IsNumber()
  jumlahPenonton?: number;

  @IsOptional()
  @IsString()
  lokasiPresentasi?: string;

  @IsOptional()
  @IsString()
  metodePresentasi?: string;
}
