import { IsBoolean, IsNumber } from "class-validator";

export class UpdateTahunAjaranDto {
  @IsNumber()
  tahunAjaranId: number;
}
