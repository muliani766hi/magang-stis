import { Module } from '@nestjs/common';
import { DokumenTranslokService } from './dokumen-translok.service';
import { DokumenTranslokController } from './dokumen-translok.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DokumenTranslokController],
  providers: [
    DokumenTranslokService,
    PrismaService,
    CaslAbilityFactory,
    JwtService
  ]
})
export class DokumenTranslokModule {}
