import { IsNotEmpty, IsString, MinLength, Matches } from "class-validator";

export class CreateTahunAjaranDto {
  @IsNotEmpty()
  @IsString({
    message: 'Tahun ajaran harus berupa string',
  })
  @MinLength(9, {
    message: 'Tahun ajaran harus memiliki panjang minimal 9 karakter',
  })
  @Matches(/^\d{4}\/\d{4}$/, {
    message: 'Format tahun ajaran tidak valid. Harus dalam format yyyy/yyyy, contoh: 2025/2026',
  })
  tahun: string;
}
