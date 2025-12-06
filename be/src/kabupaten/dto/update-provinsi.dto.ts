import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProvinsiDto {
  @IsString({
    message: 'Nama Provinsi harus berupa string'
  })
  @IsNotEmpty({
    message: 'Nama Provinsi tidak boleh kosong'
  })
  nama?: string;

  @IsString({
    message: 'Kode Provinsi harus berupa string'
  })
  @IsNotEmpty({
    message: 'Kode Provinsi tidak boleh kosong'
  })
  kodeProvinsi?: string;
}
