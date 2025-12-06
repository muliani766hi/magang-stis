import { Module } from '@nestjs/common';
import { KegiatanBulananService } from './kegiatan-bulanan.service';
import { KegiatanBulananController } from './kegiatan-bulanan.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [KegiatanBulananController],
  providers: [
    KegiatanBulananService,
    JwtService,
    PrismaService,
    CaslAbilityFactory
  ]
})
export class KegiatanBulananModule {}
