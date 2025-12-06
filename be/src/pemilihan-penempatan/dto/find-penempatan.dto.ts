import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PenempatanTipe {
  MAHASISWA = 'mahasiswa',
  SATKER = 'satker',
}

export class FindPenempatanDto {
  @IsEnum(PenempatanTipe)
  readonly tipe: PenempatanTipe;

  @IsOptional()
  @IsString()
  readonly search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly limit?: number;

  // === Filter untuk Mahasiswa ===
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly satkerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly provinsiSatkerId?: number;

  @IsOptional()
  @IsString()
  readonly status?: string;

  // === Filter untuk Satker ===
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly pilihan1Id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly provinsiPilihan1Id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly pilihan2Id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly provinsiPilihan2Id?: number;
}
