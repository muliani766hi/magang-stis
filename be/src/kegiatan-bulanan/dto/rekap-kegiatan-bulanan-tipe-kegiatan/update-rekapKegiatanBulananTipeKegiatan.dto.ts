import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRekapKegiatanBulananTipeKegiatan {
  @IsNumber()
  @IsOptional()
  rekapTipeId?: number;

  @IsNumber()
  @IsOptional()
  target?: number;

  @IsNumber()
  @IsOptional()
  realisasi?: number;

  persentase?: number;

  @IsNumber()
  @IsOptional()
  tingkatKualitas?: number;

  @IsString()
  @IsOptional()
  keterangan?: string;
}