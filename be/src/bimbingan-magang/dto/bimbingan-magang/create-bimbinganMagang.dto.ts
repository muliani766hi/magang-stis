import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PesertaBimbinganMahasiswa } from "../peserta-bimbingan-mahasiswa/pesertaBimbinganMahasiswa.entity";

export class CreateBimbinganMagangDto {
  @IsDateString()
  @IsNotEmpty()
  tanggal: Date;

  status: string;

  @IsOptional()
  @IsString()
  tempat?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  pesertaBimbinganMahasiswa: PesertaBimbinganMahasiswa;
}
