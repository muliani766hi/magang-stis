import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Mahasiswa } from '../mahasiswa/dto/mahasiswa.entity';
import { accessibleBy } from '@casl/prisma';
import { CreateAdminSatkerDto } from './dto/admin-satker/create-adminSatker.dto';
import { UpdateAdminSatkerDto } from './dto/admin-satker/update-adminSatker.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminSatkerService {
  prisma: any;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request
  ) { }

  async createBulk(data: any[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'AdminSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat admin satker');
    }
    
    let adminSatkers = [];

    for (let i = 0; i < data.length; i++) {
      const adminSatker = await this.prismaService.adminSatker.create({
        data: {
          satker: {
            connect: {
              satkerId: (await this.prismaService.satker.findFirst({
                where: {
                  kodeSatker: data[i].kodeSatker.toString(),
                },
                select: {
                  satkerId: true,
                },
              }).then((satker) => {
                return satker.satkerId;
              }).finally(() => {
                this.prismaService.$disconnect();
              })),
            },
          },
          nama: data[i].nama,
          nip: data[i].nip,
          user: {
            create: {
              email: data[i].email,
              password: await bcrypt.hash(data[i].password, 10),
              userRoles: {
                create: {
                  roleId: 8,
                },
              },
              tahunAjaran: {
                connect: {
                  tahunAjaranId: await this.prismaService.tahunAjaran.findFirst({
                    where: {
                      isActive: true,
                    },
                    select: {
                      tahunAjaranId: true,
                    },
                  }).then((tahunAjaran) => {
                    return tahunAjaran.tahunAjaranId;
                  }).finally(() => {
                    this.prismaService.$disconnect();
                  }),
                },
              },
            },
          },
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      adminSatkers.push(adminSatker);
    }

    return {
      status: 'success',
      message: 'Admin satker berhasil dibuat',
      data: adminSatkers,
    };
  }
  
  async create(satkerId: number, createAdminSatker: CreateAdminSatkerDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'AdminSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat admin satker');
    }

    const adminSatker = await this.prismaService.adminSatker.create({
      data: {
        satker: {
          connect: {
            satkerId: satkerId,
          },
        },
        nama: createAdminSatker.nama,
        nip: createAdminSatker.nip,
        user: {
          create: {
            email: createAdminSatker.email,
            password: await bcrypt.hash(createAdminSatker.password, 10),
            userRoles: {
              create: {
                roleId: 8,
              },
            },
            tahunAjaran: {
              connect: {
                tahunAjaranId: await this.prismaService.tahunAjaran.findFirst({
                  where: {
                    isActive: true,
                  },
                  select: {
                    tahunAjaranId: true,
                  },
                }).then((tahunAjaran) => {
                  return tahunAjaran.tahunAjaranId;
                }).finally(() => {
                  this.prismaService.$disconnect();
                }),
              },
            },
          },
        },
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Admin satker berhasil dibuat',
      data: adminSatker,
    };
  }

  async findAllAdminSatkerBy(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'AdminSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat admin satker');
    }

    const page = parseInt(params.page) || 1;
    const pageSize = params.pageSize ? parseInt(params.pageSize) : undefined;

    const filters: Prisma.AdminSatkerWhereInput = {
      ...(params.searchSatker && {
        satker: {
          nama: { contains: params.searchSatker, mode: 'insensitive' as Prisma.QueryMode }
        }
      }),
    };


    const whereClause: Prisma.AdminSatkerWhereInput = {
      AND: [
        accessibleBy(ability).AdminSatker,
        filters
      ]
    };
    

    const [adminSatkers, total] =  await await this.prismaService.$transaction([
      this.prismaService.adminSatker.findMany({
        where: {
          ...whereClause,
          satker: {
            nama: {
              contains: params.namaSatker,
            },
          },
          user: {
            email: {
              contains: params.email,
            },
          },
        },
        skip: pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize,
        include: {
          satker: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      }),
      this.prismaService.adminSatker.count({
        where: whereClause
      })
    ]);

    return {
      status: 'success',
      message: 'Admin satker berhasil ditemukan',
      data: adminSatkers,
      total
    };
  }

  async update(adminSatkerId: number, updateAdminSatkerDto: UpdateAdminSatkerDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'AdminSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate admin satker');
    }

    await this.prismaService.adminSatker.findFirstOrThrow({
      where: {
        adminSatkerId: parseInt(adminSatkerId.toString()),
        AND: [accessibleBy(ability).AdminSatker]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate admin satker');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const cekAdminSatker = await this.prismaService.adminSatker.findFirst({
      where: {
        user: {
          email: updateAdminSatkerDto.email,
        },
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (cekAdminSatker && cekAdminSatker.adminSatkerId !== adminSatkerId) {
      throw new ForbiddenException('Email sudah digunakan');
    }

    const adminSatker = await this.prismaService.adminSatker.update({
      where: {
        adminSatkerId: adminSatkerId,
      },
      data: {
        nama: updateAdminSatkerDto.nama || undefined,
        nip: updateAdminSatkerDto.nip || undefined,
        user: {
          update: {
            email: updateAdminSatkerDto.email || undefined,
            password: updateAdminSatkerDto.password ? await bcrypt.hash(updateAdminSatkerDto.password, 10) : undefined
          },
        },
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Admin satker berhasil diupdate',
      data: adminSatker,
    };
  }
  
  async assignMahasiswaToPembimbingLapangan(pemlapId: number, mahasiswas: Mahasiswa[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menassign mahasiswa ke pembimbing lapangan');
    }

    await this.prismaService.pembimbingLapangan.findFirstOrThrow({
      where: {
        pemlapId: parseInt(pemlapId.toString()),
        AND: [accessibleBy(ability).PembimbingLapangan]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menassign mahasiswa ke pembimbing lapangan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    await this.prismaService.pembimbingLapangan.update({
      where: {
        pemlapId: pemlapId,
      },
      data: {
        mahasiswa: {
          connect: mahasiswas.map((mahasiswa) => {
            return {
              mahasiswaId: mahasiswa.mahasiswaId,
            };
          }),
        },
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Mahasiswa berhasil diassign ke pembimbing lapangan',
    };
  }

  async unassignMahasiswaToPembimbingLapangan(pemlapId: number, mahasiswas: Mahasiswa[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melepas mahasiswa dari pembimbing lapangan');
    }

    await this.prismaService.pembimbingLapangan.findFirstOrThrow({
      where: {
        pemlapId: parseInt(pemlapId.toString()),
        AND: [accessibleBy(ability).PembimbingLapangan]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melepas mahasiswa dari pembimbing lapangan ini');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // console.log(mahasiswas);

    mahasiswas.forEach(async  (mahasiswa) => {
      // cari mahasiswa bimbingan
      await this.prismaService.mahasiswa.findFirst({
        where: {
          mahasiswaId: mahasiswa.mahasiswaId,
          pemlapId: pemlapId,
        },
      }).then((mahasiswaBimbingan) => {
        // console.log(mahasiswaBimbingan);
        if (!mahasiswaBimbingan) {
          throw new NotFoundException('Mahasiswa yang akan dilepas tidak ditemukan');
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });
    });

    await this.prismaService.pembimbingLapangan.update({
      where: {
        pemlapId: pemlapId,
      },
      data: {
        mahasiswa: {
          disconnect: mahasiswas.map((mahasiswa) => {
            return {
              mahasiswaId: mahasiswa.mahasiswaId,
            };
          }),
        },
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Mahasiswa berhasil dilepas dari pembimbing lapangan',
    };
  }
}
