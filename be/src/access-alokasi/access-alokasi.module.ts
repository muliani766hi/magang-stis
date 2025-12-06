import { Module } from '@nestjs/common';
import { AccessAlokasiService } from './access-alokasi.service';
import { AccessAlocationController } from './access-alokasi.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AccessAlocationController],
  providers: [
    AccessAlokasiService,
    PrismaService,
    CaslAbilityFactory,
    JwtService
  ]
})
export class AccessAlocationModule {}
