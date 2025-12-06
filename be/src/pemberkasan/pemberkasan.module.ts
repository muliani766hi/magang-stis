import { Module } from '@nestjs/common';
import { PemberkasanService } from './pemberkasan.service';
import { PemberkasanController } from './pemberkasan.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [PemberkasanController],
  providers: [
    PemberkasanService,
    PrismaService,
    JwtService,
    CaslAbilityFactory
  ]
})
export class PemberkasanModule {}
