import { IsDateString, IsNotEmpty } from "class-validator";
import { UpdateRekapKegiatanBulananTipeKegiatan } from "../rekap-kegiatan-bulanan-tipe-kegiatan/update-rekapKegiatanBulananTipeKegiatan.dto";

export class CreateRekapKegiatanBulananDto {
  @IsDateString()
  @IsNotEmpty()
  tanggalAwal: string;

  @IsNotEmpty()
  @IsDateString()
  tanggalAkhir: string;

  rekapKegiatanBulananTipeKegiatan: CreateRekapKegiatanBulananDto[];
}
