import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Satker } from "../../satker/dto/satker/satker.entity";
import { User } from "../../users/dto/users/user.entity";
import { Type } from "class-transformer";






export class CreatePembimbingLapanganDto {
  @IsString()
  nip: string;

  @IsString()
  nama: string;

  @ValidateNested()
  @Type(() => User)
  user: User;

  satker: Satker;
}
