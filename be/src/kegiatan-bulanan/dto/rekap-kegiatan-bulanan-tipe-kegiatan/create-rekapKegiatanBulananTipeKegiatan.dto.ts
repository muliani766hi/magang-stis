import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRekapKegiatanBulananTipeKegiatan{
  rekapKegiatanBulananId?: number;
  tipeKegiatanId?: number;

  @IsNumber()
  target: number;

  @IsNumber()
  realisasi: number;

  persentase: number;

  @IsNumber()
  @IsOptional()
  tingkatKualitas?: number;

  @IsString()
  @IsOptional()
  keterangan?: string;
}