import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TipeKegiatan } from "../tipe-kegiatan/tipeKegiatan.entity";

export class CreateKegiatanHarianDto {
  @IsDateString()
  @IsNotEmpty()
  tanggal: Date;

  @IsNotEmpty()
  @IsString()
  deskripsi: string;

  @IsNotEmpty()
  @IsNumber()
  volume: number;

  @IsNumber()
  @IsNotEmpty()
  durasi: number;

  @IsOptional()
  @IsNumber()
  statusPenyelesaian?: number;

  @IsString()
  @IsNotEmpty()
  pemberiTugas: string;

  @IsString()
  @IsNotEmpty()
  tim: string;

  tipeKegiatan: TipeKegiatan;
}
