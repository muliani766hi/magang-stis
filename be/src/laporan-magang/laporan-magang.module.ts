import { Module } from '@nestjs/common';
import { LaporanMagangService } from './laporan-magang.service';
import { LaporanMagangController } from './laporan-magang.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LaporanMagangController],
  providers: [
    LaporanMagangService,
    PrismaService,
    CaslAbilityFactory,
    JwtService
  ]
})
export class LaporanMagangModule {}
