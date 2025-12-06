import { BadRequestException, ForbiddenException, Inject, Injectable, Res, Response } from '@nestjs/common';
import { CreateAdminProvinsiDto } from '../admin-provinsi/dto/create-adminProvinsi.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ApiBearerAuth } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { accessibleBy } from '@casl/prisma';
import e from 'express';
import { UpdateAdminProvinsiDto } from './dto/update-adminProvinsi.dto';
import { Prisma } from '@prisma/client';

@Injectable()
@ApiBearerAuth()
export class AdminProvinsiService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async fetchChartPengalokasian() {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    if (payloadJwt.role !== 'admin provinsi') {
      return {
        status: 'success',
        data: {
          mahasiswa: [],
          satker: []
        }
      }
    }

    if (!year) {
      return {
        status: 'success',
        data: {
          mahasiswa: [],
          satker: []
        }
      }
    }

    const findAdminProvinsi = await this.prisma.adminProvinsi.findFirst({
      where: {
        userId: payloadJwt.id
      }
    })

    const countMahasiswa = await this.prisma.mahasiswa.findMany({
      where: {
        kabupaten: {
          provinsiId: findAdminProvinsi.provinsiId
        }
      }
    })


    return {
      status: 'success',
      data: {
        menunggu: countMahasiswa.filter((value) => value.statusPenempatan === 'menunggu').length,
        dialokasikan: countMahasiswa.filter((value) => value.statusPenempatan !== 'menunggu').length
      }
    }
  }

  async create(createAdminProvinsiDto: CreateAdminProvinsiDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    if (!ability.can('create', 'AdminProvinsi')) {
      return {
        status: 'error',
        message: 'Anda tidak memiliki izin untuk membuat admin provinsi'
      }
    }

    const adminProvinsi = await this.prisma.adminProvinsi.create({
      data: {
        user: {
          create: {
            email: createAdminProvinsiDto.user.email,
            password: await bcrypt.hash(createAdminProvinsiDto.user.password, 10),
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
                roleId: 7
              }
            }
          }
        },
        nama: createAdminProvinsiDto.nama,
        nip: createAdminProvinsiDto.nip,
        provinsi: {
          connect: {
            kodeProvinsi: createAdminProvinsiDto.kodeProvinsi
          }
        }
      },
      select: {
        user: true,
        provinsi: true
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Admin Provinsi berhasil dibuat',
      data: adminProvinsi
    }
  }

  async createBulk(data: any) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
  
    if (!ability.can('create', 'AdminProvinsi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat admin provinsi');
    }
  
    let adminProvinsi = [];
    let createdAdminProvinsi = [];
  
    for (let i = 0; i < data.length; i++) {
      if (
        !data[i].nama ||
        !data[i].nip ||
        !data[i].email ||
        !data[i].password ||
        !data[i].kodeProvinsi
      ) {
        throw new BadRequestException(`Baris ke-${i + 2} tidak lengkap`);
        // Kenapa +2? Karena Excel dimulai dari baris ke-1, dan header di baris 1
      }

      adminProvinsi.push({
        nama: data[i].nama.toString(),
        nip: data[i].nip.toString(),
        accesAlocation: data[i].accesAlocation !== undefined ? data[i].accesAlocation : true, // Menambahkan kolom accesAlocation
        user: {
          create: {
            email: data[i].email.toString(),
            password: await bcrypt.hash(data[i].password.toString(), 10),
            tahunAjaran: {
              connect: {
                tahunAjaranId: (await this.prisma.tahunAjaran.findFirst({
                  where: {
                    isActive: true,
                  },
                })).tahunAjaranId,
              },
            },
            userRoles: {
              create: {
                roleId: 7, // role untuk AdminProvinsi
              },
            },
          },
        },
        provinsi: {
          connect: {
            kodeProvinsi: data[i].kodeProvinsi.toString(),
          },
        },
      });
  
      createdAdminProvinsi.push(
        await this.prisma.adminProvinsi.create({
          data: adminProvinsi[i],
          select: {
            user: true,
            provinsi: true,
          },
        }).finally(() => {
          this.prisma.$disconnect();
        })
      );
    }
  
    return {
      status: 'success',
      message: 'Admin Provinsi berhasil dibuat',
      data: createdAdminProvinsi,
    };
  }
  
  async findAllAdminProvinsiBy(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'AdminProvinsi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat admin provinsi');
    }

    const page = parseInt(params.page) || 1;
    const pageSize = params.pageSize ? parseInt(params.pageSize) : undefined;

    const filters: Prisma.AdminProvinsiWhereInput = {
      ...(params.searchNama && {
        nama: { contains: params.searchNama, mode: 'insensitive' as Prisma.QueryMode }
      }),
      ...(params.searchNIP && {
        nip: { contains: params.searchNIP, mode: 'insensitive' as Prisma.QueryMode }
      }),
      ...(params.email && {
        user: {
          email: { contains: params.email, mode: 'insensitive' as Prisma.QueryMode }
        }
      }),
      ...(params.namaProvinsi || params.kodeProvinsi ? {
        provinsi: {
          ...(params.namaProvinsi && { nama: { contains: params.namaProvinsi, mode: 'insensitive' as Prisma.QueryMode } }),
          ...(params.kodeProvinsi && { kodeProvinsi: { contains: params.kodeProvinsi, mode: 'insensitive' as Prisma.QueryMode } }),
        }
      } : {})
    };


    const whereClause: Prisma.AdminProvinsiWhereInput = {
      AND: [
        accessibleBy(ability).AdminProvinsi,
        filters
      ]
    };


    const [adminProvinsis, total] = await this.prisma.$transaction([
      this.prisma.adminProvinsi.findMany({
        where: whereClause,
        skip: pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize,
        orderBy:{provinsiId : 'asc'},
        select: {
          adminProvinsiId: true,
          user: true,
          nama: true,
          nip: true,
          provinsi: true
        }
      }),
      this.prisma.adminProvinsi.count({
        where: whereClause
      })
    ]);

    const data = {
      adminProvinsis: adminProvinsis.map((value, index) =>({
        ...value,
        index: index + 1 + ((page - 1) * (pageSize || 0)),
      }))
    }

    return {
      status: 'success',
      message: 'Admin Provinsi berhasil ditemukan',
      data,
      total
    };
  }


  async update(
    adminProvinsiId: number,
    updateAdminProvinsiDto: UpdateAdminProvinsiDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'AdminProvinsi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate admin provinsi');
    }

    await this.prisma.adminProvinsi.findFirstOrThrow({
      where: {
        adminProvinsiId: adminProvinsiId,
        AND: [accessibleBy(ability).AdminProvinsi]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate admin provinsi');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const adminProvinsi = await this.prisma.adminProvinsi.update({
      where: {
        adminProvinsiId
      },
      data: {
        nama: updateAdminProvinsiDto.nama || undefined,
        nip: updateAdminProvinsiDto.nip || undefined,
        user: {
          update: {
            email: updateAdminProvinsiDto.user.email || undefined,
            password: updateAdminProvinsiDto.user.password ? await bcrypt.hash(updateAdminProvinsiDto.user.password, 10) : undefined
          }
        }
      },
      select: {
        user: true,
        provinsi: true
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Admin Provinsi berhasil diupdate',
      data: adminProvinsi
    }
  }

  async remove(adminProvinsiId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'AdminProvinsi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus admin provinsi');
    }

    await this.prisma.adminProvinsi.findFirstOrThrow({
      where: {
        adminProvinsiId: adminProvinsiId,
        AND: [accessibleBy(ability).AdminProvinsi]
      }
    }).catch(() => {
      throw new ForbiddenException('Admin Provinsi tidak ditemukan');
    }).finally(() => {
      this.prisma.$disconnect();
    })

    await this.prisma.adminProvinsi.delete({
      where: {
        adminProvinsiId
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
