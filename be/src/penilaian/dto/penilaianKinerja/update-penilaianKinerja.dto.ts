import { IsNumber, IsOptional } from "class-validator";

export class UpdatePenilaianKinerjaDto {
  @IsOptional()
  @IsNumber()
  disiplin?: number;

  @IsOptional()
  @IsNumber()
  hasil?: number;

  @IsOptional()
  @IsNumber()
  initiatif?: number;

  @IsOptional()
  @IsNumber()
  kemampuanBeradaptasi?: number;

  @IsOptional()
  @IsNumber()
  kemampuanBerfikir?: number;

  @IsOptional()
  @IsNumber()
  kerjasama?: number;

  @IsOptional()
  @IsNumber()
  ketekunan?: number;

  @IsOptional()
  @IsNumber()
  komunikasi?: number;

  @IsOptional()
  @IsNumber()
  penampilan?: number;

  @IsOptional()
  @IsNumber()
  teknikal?: number;
}
