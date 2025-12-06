import { PartialType } from '@nestjs/swagger';
import { CreatePresensiManualDto } from './create-presensi-manual.dto';

export class UpdatePresensiManualDto extends PartialType(CreatePresensiManualDto) {}
