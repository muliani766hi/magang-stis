import { IsNumber, IsOptional } from "class-validator";

export class CreatePenilaianBimbinganDto {
  @IsNumber()
  @IsOptional()
  disiplin?: number;

  @IsNumber()
  @IsOptional()
  inisiatif?: number;

  @IsNumber()
  @IsOptional()
  kemampuanBerfikir?: number;

  @IsNumber()
  @IsOptional()
  ketekunan?: number;

  @IsNumber()
  @IsOptional()
  komunikasi?: number;
}
