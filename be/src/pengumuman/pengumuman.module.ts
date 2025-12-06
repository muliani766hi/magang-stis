import { Module } from '@nestjs/common';
import { PengumumanService } from './pengumuman.service';
import { PengumumanController } from './pengumuman.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [PengumumanController],
  providers: [
    PengumumanService,
    PrismaService,
    JwtService,
    CaslAbilityFactory
  ]
})
export class PengumumanModule {}
