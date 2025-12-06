import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    PrismaService,
    JwtService,
    CaslAbilityFactory
  ]
})
export class RolesModule {}
