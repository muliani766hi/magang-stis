import { Module } from '@nestjs/common';
import { AdminSatkerService } from './admin-satker.service';
import { AdminSatkerController } from './admin-satker.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AdminSatkerController],
  providers: [
    AdminSatkerService,
    PrismaService,
    CaslAbilityFactory,
    JwtService
  ]
})
export class AdminSatkerModule {}
