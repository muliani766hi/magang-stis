import { Module } from '@nestjs/common';
import { TahunAjaranService } from './tahun-ajaran.service';
import { TahunAjaranController } from './tahun-ajaran.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Module({
  controllers: [TahunAjaranController],
  providers: [
    TahunAjaranService,
    PrismaService,
    JwtService,
    CaslAbilityFactory
  ]
    
})
export class TahunAjaranModule {}
