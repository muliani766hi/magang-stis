import { IsNumber } from "class-validator";

export class CreateKapasitasSatkerTahunAjaranBulkDto {
  satker: {
    connect: {
      satkerId: number;
    }
  }
  
  tahunAjaran: {
    connect: {
      tahunAjaranId: number;
    }
  }
  @IsNumber()
  kapasitas?: number;
}
