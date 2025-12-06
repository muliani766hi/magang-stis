import { ForbiddenException, Inject, Injectable, Res, Response } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { accessibleBy } from '@casl/prisma';
import e from 'express';
import { KabagDto } from './dto/kabag.dto';
import { UpdateKabagDto } from './dto/update-kabag.dto';

@Injectable()
@ApiBearerAuth()
export class KabagService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async create(createKabagDto: KabagDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
   

    const kabag = await this.prisma.kabag.create({
      data: {
        user: {
          create: {
            email: createKabagDto.user.email,
            password: await bcrypt.hash(createKabagDto.user.password, 10),
            tahunAjaran: {
              connect: {
                tahunAjaranId: (await this.prisma.tahunAjaran.findFirst({
                  where: {
                    isActive: true
                  }
                })).tahunAjaranId
              }
            },
            userRoles: {
              create: {
                roleId: 10
              }
            }
          }
        },
        nama: createKabagDto.nama,
        nip: createKabagDto.nip,
      },
      select: {
        user: true,
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Kabag berhasil dibuat',
      data: kabag
    }
  }

  

  async findAllAdminProvinsiBy(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
   
    const kabag = await this.prisma.kabag.findMany({
      where: {
        AND: [
          {
            user: {
              email: {
                contains: params.email
              }
            }
          }
        ],
      },
      select: {
        user: true,
        nama: true,
        nip: true,
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Kabag berhasil ditemukan',
      data: kabag
    }
  }

  async update(
    kabagId: number,
    updateKabagiDto: UpdateKabagDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
   

    await this.prisma.kabag.findFirstOrThrow({
      where: {
        id: kabagId,
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate admin provinsi');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const kabag = await this.prisma.kabag.update({
      where: {
        id: kabagId
      },
      data: {
        nama: updateKabagiDto.nama || undefined,
        nip: updateKabagiDto.nip || undefined,
        user: {
          update: {
            email: updateKabagiDto.user.email || undefined,
            password: updateKabagiDto.user.password ? await bcrypt.hash(updateKabagiDto.user.password, 10) : undefined
          }
        }
      },
      select: {
        user: true,
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Kabag berhasil diupdate',
      data: kabag
    }
  }

  async remove(kabagId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
   
    await this.prisma.kabag.findFirstOrThrow({
      where: {
        id: kabagId,
      }
    }).catch(() => {
      throw new ForbiddenException('Admin Provinsi tidak ditemukan');
    }).finally(() => {
      this.prisma.$disconnect();
    })

    await this.prisma.kabag.delete({
      where: {
        id: kabagId,
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Admin Provinsi berhasil dihapus'
    }
  }
}
