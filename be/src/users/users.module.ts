import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    JwtService,
    CaslAbilityFactory,
  ],
  exports: [UsersService],
})
export class UsersModule {}
