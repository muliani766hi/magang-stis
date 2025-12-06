import { Type } from "class-transformer";
import { CreateUserDto } from "../../users/dto/users/create-user.dto";
import { IsString, ValidateNested } from "class-validator";

export class CreateDosenPembimbingMagangDto {
  dosenId: number;

  @IsString()
  nip: string;

  @IsString()
  nama: string;

  @IsString()
  prodi: string;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
