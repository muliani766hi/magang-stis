import { Module } from '@nestjs/common';
import { PresentasiLaporanMagangService } from './presentasi-laporan-magang.service';
import { PresentasiLaporanMagangController } from './presentasi-laporan-magang.controller';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PresentasiLaporanMagangController],
  providers: [
    PresentasiLaporanMagangService,
    JwtService,
    CaslAbilityFactory,
    PrismaService,
  ]
})
export class PresentasiLaporanMagangModule {}
