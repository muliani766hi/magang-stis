import { Module } from '@nestjs/common';
import { PenilaianService } from './penilaian.service';
import { PenilaianController } from './penilaian.controller';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PenilaianController],
  providers: [
    PenilaianService,
    JwtService,
    CaslAbilityFactory,
    PrismaService
  ]
})
export class PenilaianModule {}
