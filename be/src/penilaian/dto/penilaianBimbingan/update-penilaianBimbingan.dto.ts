import { IsNumber, IsOptional } from "class-validator";

export class UpdatePenilaianBimbinganDto {
  @IsOptional()
  @IsNumber()
  disiplin?: number;

  @IsOptional()
  @IsNumber()
  inisiatif?: number;

  @IsOptional()
  @IsNumber()
  kemampuanBerfikir?: number;

  @IsOptional()
  @IsNumber()
  ketekunan?: number;

  @IsOptional()
  @IsNumber()
  komunikasi?: number;  
}
