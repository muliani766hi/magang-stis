import { CreateUserDto } from "../../users/dto/users/create-user.dto";
import { IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class KabagDto {
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsString()
  nama: string;

  @IsString()
  nip: string;
}