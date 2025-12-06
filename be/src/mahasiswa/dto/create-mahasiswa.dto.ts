import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateMahasiswaDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(9)
  nim: string;
  
  @IsNotEmpty()
  @IsString()
  nama: string;
  
  @IsNotEmpty()
  @IsString()
  prodi: string;
  
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  kelas?: string;
  
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  alamat?: string;

  @IsOptional()
  nomorRekening?: string;

  @IsNotEmpty()
  user: {
    create: {
      email: string;
      password: string;
      tahunAjaran: {
        connect: {
          tahunAjaranId: number;
        };
      };
      userRoles: {
        create: {
          roleId: number;
        };
      };
    }
  };
}
