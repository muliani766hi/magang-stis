import { Module } from '@nestjs/common';
import { BimbinganSkripsiService } from './bimbingan-skripsi.service';
import { BimbinganSkripsiController } from './bimbingan-skripsi.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BimbinganSkripsiController],
  providers: [
    BimbinganSkripsiService,
    PrismaService,
    CaslAbilityFactory,
    JwtService
  ]
})
export class BimbinganSkripsiModule {}
