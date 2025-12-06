import { Module } from '@nestjs/common';
import { AdminProvinsiService } from './admin-provinsi.service';
import { AdminProvinsiController } from './admin-provinsi.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AdminProvinsiController],
  providers: [
    AdminProvinsiService,
    PrismaService,
    CaslAbilityFactory,
    JwtService
  ]
})
export class AdminProvinsiModule {}
