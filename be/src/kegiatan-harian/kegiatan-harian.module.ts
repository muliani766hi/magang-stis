import { Module } from '@nestjs/common';
import { KegiatanHarianService } from './kegiatan-harian.service';
import { KegiatanHarianController } from './kegiatan-harian.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [KegiatanHarianController],
  providers: [
    KegiatanHarianService,
    JwtService,
    PrismaService,
    CaslAbilityFactory
  ]
})
export class KegiatanHarianModule {}
