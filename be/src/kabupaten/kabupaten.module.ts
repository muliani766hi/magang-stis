import { Module } from '@nestjs/common';
import { KabupatenService } from './kabupaten.service';
import { KabupatenController } from './kabupaten.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [KabupatenController],
  providers: [
    KabupatenService,
    PrismaService,
    JwtService,
    CaslAbilityFactory
  ]
})
export class KabupatenModule {}
