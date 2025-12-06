import { Type } from "class-transformer";
import { UpdateUserDto } from "../../users/dto/users/update-user.dto";
import { IsOptional, IsString, ValidateNested } from "class-validator";

export class UpdateDosenPembimbingMagangDto {
  @IsString()
  @IsOptional()
  nip?: string;

  @IsString()
  @IsOptional()
  nama?: string;

  @IsString()
  @IsOptional()
  prodi?: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;
}
