import { IsNumber } from "class-validator";

export class UpdateKapasitasSatkerTahunAjaranDto {
  @IsNumber()
  kapasitas?: number;
}
