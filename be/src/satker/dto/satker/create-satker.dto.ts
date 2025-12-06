import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateKapasitasSatkerTahunAjaranDto } from "../kapasitas-satker-tahun-ajaran/create-kapasitasSatkerTahunAjaran.dto";

class kabupatenKota {
  @IsString()
  namaKabupatenKota: string;

  @IsString()
  kodeKabupatenKota: string;
}

class provinsi {
  @IsString()
  kodeProvinsi: string;
}

export class CreateSatkerDto {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsString()
  kodeSatker: string;

  @ValidateNested({ each: true })
  @Type(() => kabupatenKota)
  kabupatenKota: kabupatenKota;

  @ValidateNested({ each: true })
  @Type(() => provinsi)
  provinsi: provinsi;

  @IsNotEmpty()
  @IsBoolean()
  internalBPS: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreateKapasitasSatkerTahunAjaranDto)
  kapasitasSatker: CreateKapasitasSatkerTahunAjaranDto;
}