import { IsDateString, IsString } from "class-validator";

export class CreateIzinBimbinganSkripsiDto {
  @IsDateString()
  tanggal: string;

  @IsDateString()
  jamMulai: string;

  @IsDateString()
  jamSelesai: string;

  @IsString({
    message: 'Keterangan harus berupa string'
  })
  keterangan: string;
}
