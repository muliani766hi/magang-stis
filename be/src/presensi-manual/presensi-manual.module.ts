import { Module } from '@nestjs/common';
import { PresensiManualService } from './presensi-manual.service';
import { PresensiManualController } from './presensi-manual.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';

@Module({
  controllers: [PresensiManualController],
  providers: [
    PresensiManualService,
    JwtService,
    PrismaService,
    CaslAbilityFactory
  ]
})
export class PresensiManualModule {}
