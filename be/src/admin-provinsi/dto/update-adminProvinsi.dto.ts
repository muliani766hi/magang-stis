import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';
import { UpdateUserDto } from "../../users/dto/users/update-user.dto";

export class UpdateAdminProvinsiDto {
  @ValidateNested({ each: true })
  @Type(() => UpdateUserDto)
  user: UpdateUserDto;

  @IsString()
  @IsOptional()
  nama?: string;

  @IsString()
  @IsOptional()
  nip?: string;
}
