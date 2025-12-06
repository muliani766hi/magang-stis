import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePembimbingLapanganDto } from '../pembimbing-lapangan/dto/create-pembimbingLapangan.dto';
import { UpdatePembimbingLapanganDto } from './dto/update-pembimbingLapangan.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class PembimbingLapanganService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async findAllPemlapBy(params: {
    searchNama?: string;
    searchNIP?: string;
    searchSatker?: string;
    page?: string;
    pageSize?: string;
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data pembimbing lapangan');
    }

    const page = parseInt(params.page || '1');
    const pageSize = params.pageSize ? parseInt(params.pageSize) : undefined;

    // console.log('Params masuk:', params);

    const filters: Prisma.PembimbingLapanganWhereInput = {
      ...(params.searchNIP && {
        nip: { contains: params.searchNIP, mode: 'insensitive' },
      }),
      ...(params.searchNama && {
        nama: { contains: params.searchNama, mode: 'insensitive' },
      }),
      ...(params.searchSatker && {
      satker: {
        kodeSatker:  { contains: params.searchSatker, mode: 'insensitive' },
      },
    }),

    };

    const whereClause: Prisma.PembimbingLapanganWhereInput = {
      AND: [accessibleBy(ability).PembimbingLapangan, filters],
    };

    const [pemlaps, total] = await this.prisma.$transaction([
      this.prisma.pembimbingLapangan.findMany({
        where: whereClause,
        skip: pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize,
        select: {
          pemlapId: true,
          nip: true,
          nama: true,
          user: {
            select: {
              userId: true,
              email: true,
            },
          },
          satker: {
            select: {
              nama: true,
              satkerId: true,
            },
          },
        },
        orderBy: {
          satker: {
            satkerId: 'asc',
          },
        },
      }),
      this.prisma.pembimbingLapangan.count({
        where: whereClause,
      }),
    ])
    // .finally(() => {
    //   this.prisma.$disconnect();
    // });

    const response = pemlaps.map((pemlap) => ({
      pemlapId: pemlap.pemlapId,
      userId: pemlap.user.userId,
      satkerId: pemlap.satker.satkerId,
      nip: pemlap.nip,
      nama: pemlap.nama,
      email: pemlap.user.email,
      namaSatker: pemlap.satker.nama,
    }));

    return {
      status: 'success',
      message: 'Data Pembimbing Lapangan berhasil diambil',
      data: response,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }


  async findAllWithMhs() {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data pembimbing lapangan');
    }

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })


    const data = await this.prisma.pembimbingLapangan.findMany({
      where: {
        AND: [accessibleBy(ability).PembimbingLapangan],
        user: {
          tahunAjaranId: year.tahunAjaranId
        },
      },
      include : {
        mahasiswa: true,
        satker: true, 
        user: true
      },
      orderBy: {
        satker: {
          satkerId: 'asc',
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    let satkerResponse = [];

    data.forEach((pemlap) => {
      satkerResponse.push({
        pemlapId: pemlap.pemlapId,
        userId: pemlap.user.userId,
        satkerId: pemlap.satker.satkerId,
        nip: pemlap.nip,
        nama: pemlap.nama,
        email: pemlap.user.email,
        namaSatker: pemlap.satker.nama,
        listMahasiswa: pemlap.mahasiswa
      });
    });

    return {
      status: 'success',
      message: 'Data Pembimbing Lapangan Berhasil Diambil',
      data: data,
    };
  }

  async findAllMahasiswaBimbingan(
    params: {
      pemlapId: number,
    }
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data pembimbing lapangan');
    }

    const data = await this.prisma.pembimbingLapangan.findMany({
      where: {
        pemlapId: (params.pemlapId.toString() == '') ? undefined : parseInt(params.pemlapId.toString()),
        AND: [accessibleBy(ability).PembimbingLapangan],
      },
      select: {
        pemlapId: true,
        nip: true,
        nama: true,
        user: {
          select: {
            userId: true,
            email: true,
          },
        },
        satker: {
          select: {
            nama: true,
            satkerId: true,
          },
        },
        mahasiswa: {
          select: {
            nim: true,
            nama: true,
            user: {
              select: {
                email: true,
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
      message: 'Data Mahasiswa Bimbingan Berhasil Diambil',
      data: data,
    };
  }

  async create(createPembimbingLapangan: CreatePembimbingLapanganDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan data pembimbing lapangan');
    }

    const checkPemlap = await this.prisma.pembimbingLapangan.findFirst({
      where: {
        user: {
          email: createPembimbingLapangan.user.email,
          tahunAjaran: {
            isActive: true,
          },
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (checkPemlap) {
      throw new ForbiddenException('Email sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(createPembimbingLapangan.user.password, 10);

    const pembimbingLapanganBaru = await this.prisma.pembimbingLapangan.create({
      data: {
        nip: createPembimbingLapangan.nip,
        nama: createPembimbingLapangan.nama,
        user: {
          create: {
            email: createPembimbingLapangan.user.email,
            password: hashedPassword,
            tahunAjaran: {
              connect: {
                tahunAjaranId: (await this.prisma.tahunAjaran.findFirst({
                  where: {
                    isActive: true,
                  },
                  select: {
                    tahunAjaranId: true,
                  },
                })).tahunAjaranId
              },
            },
            userRoles: {
              create: {
                roleId: 4,
              },
            },
          },
        },
        satker: {
          connect: {
            kodeSatker: createPembimbingLapangan.satker.kodeSatker,
          },
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    console.log(pembimbingLapanganBaru);

    return {
      status: 'success',
      message: 'Data Pembimbing Lapangan Berhasil Ditambahkan',
      data: pembimbingLapanganBaru,
    };
  }

  async createBulk(data: any[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan data pembimbing lapangan');
    }

    const tahunAjaranId = (await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true,
      },
      select: {
        tahunAjaranId: true,
      },
    })).tahunAjaranId;

    let pembimbingLapanganBaru = [];

    for (let i = 0; i < data.length; i++) {
      const hashedPassword = await bcrypt.hash(data[i].password, 10);

      pembimbingLapanganBaru.push(
        await this.prisma.pembimbingLapangan.create({
          data: {
            nip: data[i].nip,
            nama: data[i].nama,
            user: {
              create: {
                email: data[i].email,
                password: hashedPassword,
                tahunAjaran: {
                  connect: {
                    tahunAjaranId: tahunAjaranId,
                  },
                },
                userRoles: {
                  create: {
                    roleId: 4,
                  },
                },
              },
            },
            satker: {
              connect: {
                kodeSatker: data[i].kodeSatker.toString(),
              },
            },
          },
          select: {
            pemlapId: true,
            nip: true,
            nama: true,
            user: {
              select: {
                userId: true,
                email: true,
              },
            },
            satker: {
              select: {
                nama: true,
                satkerId: true,
              },
            },
          },
        }).finally(() => {
          this.prisma.$disconnect();
        })
      );
    }

    return {
      status: 'success',
      message: 'Data Pembimbing Lapangan Berhasil Ditambahkan',
      data: pembimbingLapanganBaru,
    };
  }

  async assignMahasiswaBulk(data: any[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan data pembimbing lapangan');
    }

    let pembimbingLapanganToMahasiswa = [];

    for (let i = 0; i < data.length; i++) {
      try {
        pembimbingLapanganToMahasiswa.push(
          await this.prisma.pembimbingLapangan.update({
            where: {
              pemlapId: (await this.prisma.pembimbingLapangan.findFirst({
                where: {
                  nip: data[i].nip,
                  user: {
                    tahunAjaran: {
                      isActive: true,
                    },
                  },
                },
                select: {
                  pemlapId: true,
                },
              }).finally(() => {
                this.prisma.$disconnect();
              })).pemlapId
            },
            data: {
              mahasiswa: {
                connect: {
                  mahasiswaId: (await this.prisma.mahasiswa.findFirst({
                    where: {
                      nim: data[i].nim.toString(),
                      user: {
                        tahunAjaran: {
                          isActive: true,
                        },
                      },
                    },
                    select: {
                      mahasiswaId: true,
                    },
                  }).finally(() => {
                    this.prisma.$disconnect();
                  })).mahasiswaId,
                },
              },
            },
            select: {
              pemlapId: true,
              nip: true,
              nama: true,
              user: {
                select: {
                  userId: true,
                  email: true,
                },
              },
              satker: {
                select: {
                  nama: true,
                  satkerId: true,
                },
              },
              mahasiswa: {
                select: {
                  nim: true,
                  nama: true,
                },
              },
            },
          }).finally(() => {
            this.prisma.$disconnect();
          })
        );
      } catch (error) {
        // console.log(data[i].nim.toString());
        throw new Error('Data mahasiswa atau pembimbing lapangan tidak ditemukan');
      }
    }

    return {
      status: 'success',
      message: 'Data Pembimbing Lapangan Berhasil Ditambahkan',
      data: pembimbingLapanganToMahasiswa,
    };
  }

  async update(
    pemlapId: number,
    updatePembimbingLapangan: UpdatePembimbingLapanganDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data pembimbing lapangan');
    }

    await this.prisma.pembimbingLapangan.findFirstOrThrow({
      where: {
        pemlapId: pemlapId,
        AND: [accessibleBy(ability).PembimbingLapangan],
      },
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data pembimbing lapangan ini');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const data = await this.prisma.pembimbingLapangan.update({
      where: {
        pemlapId: pemlapId,
      },
      data: {
        nip: updatePembimbingLapangan.nip || undefined,
        nama: updatePembimbingLapangan.nama || undefined,
        user: {
          update: {
            email: updatePembimbingLapangan.email || undefined,
            password: updatePembimbingLapangan.password
              ? await bcrypt.hash(updatePembimbingLapangan.password, 10)
              : undefined,
          },
        }
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Pembimbing Lapangan Berhasil Diubah',
      data: data,
    };
  }

  async remove(pemlapId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('remove', 'PembimbingLapangan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus data pembimbing lapangan');
    }

    await this.prisma.pembimbingLapangan.findFirstOrThrow({
      where: {
        pemlapId: pemlapId,
        AND: [accessibleBy(ability).PembimbingLapangan],
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus data pembimbing lapangan ini');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.pembimbingLapangan.delete({
      where: {
        pemlapId: pemlapId,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Pembimbing Lapangan Berhasil Dihapus'
    };
  }
}
