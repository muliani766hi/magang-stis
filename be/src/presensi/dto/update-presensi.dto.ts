import { IsDateString, IsNotEmpty } from "class-validator";

export class UpdatePresensiDto {
  @IsDateString()
  @IsNotEmpty()
  waktuPulang?: string;
}
