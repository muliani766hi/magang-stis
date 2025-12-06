import { Module } from '@nestjs/common';
import { KabagService } from './kabag.service';
import { KabagController } from './kabag.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [KabagController],
  providers: [
    KabagService,
    PrismaService,
    CaslAbilityFactory,
    JwtService
  ]
})
export class KabagModule {}
