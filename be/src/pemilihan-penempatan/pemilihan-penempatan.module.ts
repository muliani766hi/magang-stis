import { Module } from '@nestjs/common';
import { PemilihanPenempatanController } from './pemilihan-penempatan.controller';
import { PemilihanPenempatanService } from './pemilihan-penempatan.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [PemilihanPenempatanController],
  providers: [
    PemilihanPenempatanService,
    PrismaService,
    JwtService,
    CaslAbilityFactory
  ],
})
export class PemilihanPenempatanModule {}
