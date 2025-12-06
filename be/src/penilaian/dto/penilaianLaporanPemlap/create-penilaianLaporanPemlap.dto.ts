import { IsNumber, IsOptional } from "class-validator";

export class CreatePenilaianLaporanPemlapDto {
  @IsOptional()
  @IsNumber()
  var1?: number;

  @IsOptional()
  @IsNumber()
  var2?: number;

  @IsOptional()
  @IsNumber()
  var3?: number;

  @IsOptional()
  @IsNumber()
  var4?: number;

  @IsOptional()
  @IsNumber()
  var5?: number;

  @IsOptional()
  @IsNumber()
  var6?: number;

  @IsOptional()
  @IsNumber()
  var7?: number;

  @IsOptional()
  @IsNumber()
  var8?: number;

  @IsOptional()
  @IsNumber()
  var9?: number;

  @IsOptional()
  @IsNumber()
  var10?: number;
}
