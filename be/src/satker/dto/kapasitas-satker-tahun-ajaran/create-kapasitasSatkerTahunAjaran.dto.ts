import { IsNumber, IsOptional } from "class-validator";
import { TahunAjaran } from "../../../tahun-ajaran/dto/tahunAjaran.entity";

export class CreateKapasitasSatkerTahunAjaranDto {
  satkerId: number;

  @IsNumber()
  @IsOptional()
  kapasitas?: number;

  tahunAjaran: TahunAjaran;
}
