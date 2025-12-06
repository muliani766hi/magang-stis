import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreatePresensiDto {
  @IsString()
  @IsNotEmpty()
  tanggal: string;

  waktu: string;
  
  status: string;

  jumlahJamKerja: number;

  statusJamKerja: string;

  bobotKetidakhadiran: number;
}
