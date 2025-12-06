import * as bcrypt from 'bcrypt';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDosenPembimbingMagangDto } from '../dosen-pembimbing-magang/dto/update-dosenPembimbingMagang.dto';
import { CreateDosenPembimbingMagangDto } from '../dosen-pembimbing-magang/dto/create-dosenPembimbingMagang.dto';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class DosenPembimbingMagangService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async findAllDosenBy( params ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'DosenPembimbingMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data dosen pembimbing magang');
    }

    const page = parseInt(params.page) || 1;
    const pageSize = params.pageSize ? parseInt(params.pageSize) : undefined;

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const filters: Prisma.DosenPembimbingMagangWhereInput = {
      ...(params.searchNIP && {
        nip: { contains: params.searchNIP, mode: 'insensitive'  as Prisma.QueryMode },
      }),
      ...(params.searchNama && {
        nama: { contains: params.searchNama, mode: 'insensitive'  as Prisma.QueryMode },
      }),
      ...(params.prodi && {
        prodi: { contains: params.prodi, mode: 'insensitive'  as Prisma.QueryMode },
      }),
      user: {
        ...(params.email && {
          email: { contains: params.email, mode: 'insensitive'  as Prisma.QueryMode},
        }),
        // ...(year && {
        //   tahunAjaran: {
        //     tahun: { equals: year.tahun },
        //   },
        // }),
      },
    };

    const whereClause: Prisma.DosenPembimbingMagangWhereInput = {
      AND: [accessibleBy(ability).DosenPembimbingMagang, filters],
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.dosenPembimbingMagang.findMany({
        where: whereClause,
        skip: pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize,
        select: {
          dosenId: true,
          nip: true,
          nama: true,
          prodi: true,
          user: {
            select: {
              userId: true,
              email: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.dosenPembimbingMagang.count({ where: whereClause }),
    ]);

    const dosenResponse = data.map((dosen) => ({
        dosenId: dosen.dosenId,
        userId: dosen.user.userId,
        nip: dosen.nip,
        nama: dosen.nama,
        prodi: dosen.prodi,
        email: dosen.user.email,
        createdAt: dosen.createdAt,
        updatedAt: dosen.updatedAt,
    }));

    return {
      status: 'success',
      message: 'Data Dosen Pembimbing Berhasil Diambil',
      data: dosenResponse,
      total,
    };
  }

  async create(createDosenPembimbingMagang: CreateDosenPembimbingMagangDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'DosenPembimbingMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data dosen pembimbing magang');
    }

    const hashedPassword = await bcrypt.hash(createDosenPembimbingMagang.user.password, 10);

    const dosenBaru = await this.prisma.dosenPembimbingMagang.create({
      data: {
        nip: createDosenPembimbingMagang.nip,
        nama: createDosenPembimbingMagang.nama,
        prodi: createDosenPembimbingMagang.prodi,
        user: {
          create: {
            email: createDosenPembimbingMagang.user.email,
            password: hashedPassword,
            tahunAjaran: {
              connect: {
                tahun: (await this.prisma.tahunAjaran.findFirst({
                  where: {
                    isActive: true,
                  },
                  select: {
                    tahun: true,
                  },
                })).tahun,
              }
            },
            userRoles: {
              create: {
                roleId: 3,
              },
            },
          },
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Dosen Pembimbing Berhasil Ditambahkan',
      data: dosenBaru,
    };
  }

  async update(dosenId: number, updateDosenPembimbingMagang: UpdateDosenPembimbingMagangDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'DosenPembimbingMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data dosen pembimbing magang');
    }

    await this.prisma.dosenPembimbingMagang.findFirstOrThrow({
      where: {
        dosenId: dosenId,
        AND: [accessibleBy(ability).DosenPembimbingMagang],
      }
    }).catch(() => {
      throw new ForbiddenException('Dosen Pembimbing Magang tidak ditemukan');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const updatedDosen = await this.prisma.dosenPembimbingMagang.update({
      where: {
        dosenId: dosenId,
      },
      data: {
        nip: updateDosenPembimbingMagang.nip || undefined,
        nama: updateDosenPembimbingMagang.nama || undefined,
        prodi: updateDosenPembimbingMagang.prodi || undefined,
        user: {
          update: {
            email: updateDosenPembimbingMagang.user.email || undefined,
            password: updateDosenPembimbingMagang.user.password ? await bcrypt.hash(updateDosenPembimbingMagang.user.password, 10) : undefined,
          },
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Dosen Berhasil Diubah',
      data: updatedDosen,
    };
  }

  async createBulk(data: any) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'DosenPembimbingMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data dosen pembimbing magang');
    }

    let dosenBaru = [];

    for (let i = 0; i < data.length; i++) {
      dosenBaru.push(
        await this.prisma.dosenPembimbingMagang.create({
          data: {
            nip: data[i].nip,
            nama: data[i].nama,
            prodi: data[i].prodi,
            user: {
              create: {
                email: data[i].email,
                password: await bcrypt.hash(data[i].password, 10),
                tahunAjaran: {
                  connect: {
                    tahun: (await this.prisma.tahunAjaran.findFirst({
                      where: {
                        isActive: true,
                      },
                      select: {
                        tahun: true,
                      },
                    })).tahun,
                  }
                },
                userRoles: {
                  create: {
                    roleId: 3,
                  },
                },
              },
            },
          },
        })
      );
    }

    return {
      status: 'success',
      message: 'Data Dosen Pembimbing Berhasil Ditambahkan',
      data: dosenBaru,
    };
  }
}
