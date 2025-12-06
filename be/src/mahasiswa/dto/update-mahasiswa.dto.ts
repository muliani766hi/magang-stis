import { IsOptional, IsString, Matches, IsEmail } from "class-validator";
import { DosenPembimbingMagang } from "../../dosen-pembimbing-magang/dto/dosenPembimbingMagang.entity";
import { PembimbingLapangan } from "../../pembimbing-lapangan/dto/pembimbingLapangan.entity";
import { Satker } from "../../satker/dto/satker/satker.entity";

export class UpdateMahasiswaDto {
  @IsOptional()
  @IsString()
  nim?: string;

  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsString()
  prodi: string;

  @IsOptional()
  @IsString()
  kelas: string;

  @IsOptional()
  @IsString()
  alamat?: string;

  @IsOptional()
  @IsString()
  @IsEmail({}, { message: "Email harus valid" })
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^62\d+$/, { message: "Nomor HP harus diawali dengan 62" })
  noHp?: string;

  @IsOptional()
  @IsString()
  @Matches(/^62\d+$/, { message: "Nomor HP wali harus diawali dengan 62" })
  noHpWali?: string;

  @IsOptional()
  @IsString()
  kabupaten?: string;

  @IsOptional()
  @IsString()
  kabupatenWali?: string;

  @IsOptional()
  @IsString()
  provinsiWali?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d+$/, { message: "Nomor rekening harus angka" })
  nomorRekening?: string;

  @IsOptional()
  @IsString()
  namaRekening?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  dosenPembimbingMagang?: DosenPembimbingMagang;

  @IsOptional()
  pembimbingLapangan?: PembimbingLapangan;

  @IsOptional()
  satker?: Satker;
}
