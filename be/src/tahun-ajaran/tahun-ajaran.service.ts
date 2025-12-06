import { ConflictException, ForbiddenException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTahunAjaranDto } from '../tahun-ajaran/dto/create-tahunAjaran.dto';
import { UpdateTahunAjaranDto } from '../tahun-ajaran/dto/update-tahunAjaran.dto';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class TahunAjaranService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request,
  ) { }

  async create(createTahunAjaranDto: CreateTahunAjaranDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
  
    if (!ability.can('create', 'TahunAjaran')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat tahun ajaran');
    }
    try {
    // Start a transaction to ensure atomicity
    const transaction = await this.prismaService.$transaction(async (prisma) => {
      // Create Tahun Ajaran
      const existingTahun = await this.prismaService.tahunAjaran.findUnique({
        where: {
          tahun: createTahunAjaranDto.tahun,
        },
      });
      
      if (existingTahun) {
        throw new ConflictException('Tahun ajaran sudah ada.');
      }
      
      const tahunAjaran = await prisma.tahunAjaran.create({
        data: {
          tahun: createTahunAjaranDto.tahun,
        },
      });
  
      // Find the active Tahun Ajaran
      const findTahunAjaran = await prisma.tahunAjaran.findFirst({
        where: {
          isActive: true,
        },
      });
  
      if (!findTahunAjaran) {
        console.log('tahun ajaran tidak ada');
      }
  
      // Create Kapasitas Satker with the new Tahun Ajaran
      const satkers = await prisma.satker.findMany();
      await prisma.kapasitasSatkerTahunAjaran.createMany({
        data: satkers.map((satker) => ({
          tahunAjaranId: tahunAjaran.tahunAjaranId,
          satkerId: satker.satkerId,
        })),
      });
  
      // Create Dosen Pembimbing Magang for the new Tahun Ajaran
      const dosenPembimbingMagangPadaTahunAktif = await prisma.dosenPembimbingMagang.findMany({
        where: {
          user: {
            tahunAjaran: {
              tahunAjaranId: findTahunAjaran.tahunAjaranId,
            },
          },
        },
      });
  
      const userDosens = await prisma.user.findMany({
        where: {
          tahunAjaran: {
            tahunAjaranId: findTahunAjaran.tahunAjaranId,
          },
          userRoles: {
            every: {
              roleId: 3,
            },
          },
        },
      });
  
      const dosenCreates = dosenPembimbingMagangPadaTahunAktif.map((dosen) => {
        const userDosen = userDosens.find((user) => user.userId === dosen.userId);
  
        return prisma.dosenPembimbingMagang.create({
          data: {
            nip: dosen.nip,
            nama: dosen.nama,
            prodi: dosen.prodi,
            user: {
              create: {
                email: userDosen.email,
                password: userDosen.password,
                tahunAjaran: {
                  connect: {
                    tahunAjaranId: tahunAjaran.tahunAjaranId,
                  },
                },
              },
            },
          },
        });
      });
  
      // Execute all Dosen Pembimbing Magang creation queries in parallel
      await Promise.all(dosenCreates);
  
      return tahunAjaran;
    });
  
    return {
      status: 'success',
      message: 'Tahun ajaran berhasil dibuat',
      data: transaction,
    };
  } catch (error) {
    console.error('DETAIL ERROR:', error);

    if (error.code === 'P2002') {
      throw new ConflictException(`Data duplikat pada field: ${error.meta.target}`);
    }

    throw new InternalServerErrorException('Terjadi kesalahan saat membuat tahun ajaran');
  }
  }
  

  async findAllBy(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'TahunAjaran')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat tahun ajaran');
    }

    const tahunAjarans = await this.prismaService.tahunAjaran.findMany({
      where: {
        AND: [accessibleBy(ability).TahunAjaran],
        // tahun: {
        //   contains: params.tahun,
        // },
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: 'Tahun ajaran berhasil ditemukan',
      data: tahunAjarans,
    };
  }

  async update(tahunAjaranId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'TahunAjaran')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate tahun ajaran');
    }

    await this.prismaService.tahunAjaran.findFirstOrThrow({
      where: {
        tahunAjaranId: parseInt(tahunAjaranId.toString()),
        AND: [accessibleBy(ability).TahunAjaran],
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate tahun ajaran ini');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const tahunAjaran = await this.prismaService.tahunAjaran.update({
      where: {
        tahunAjaranId: tahunAjaranId,
      },
      data: {
        isActive: true,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // set tahun ajaran lainnya menjadi tidak aktif
    await this.prismaService.tahunAjaran.updateMany({
      where: {
        tahunAjaranId: {
          not: tahunAjaranId,
        },
      },
      data: {
        isActive: false,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // set tahun ajaran role kec pembimbing n mhs menjadi yang baru
    await this.prismaService.user.updateMany({
      where: {
        userRoles: {
          every: {
            OR: [
              {
                roleId: 1,
              },
              {
                roleId: 2,
              },
              {
                roleId: 5,
              },
              {
                roleId: 6,
              },
              {
                roleId: 7,
              },
              {
                roleId: 8,
              },
              {
                roleId: 10,
              }
            ],
          },
        },
      },
      data: {
        tahunAjaranId: tahunAjaran.tahunAjaranId,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: 'Tahun ajaran berhasil diupdate',
      data: tahunAjaran,
    };
  }


  async remove(tahunAjaranId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'TahunAjaran')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus tahun ajaran');
    }

    await this.prismaService.tahunAjaran.findFirstOrThrow({
      where: {
        tahunAjaranId: parseInt(tahunAjaranId.toString()),
        AND: [accessibleBy(ability).TahunAjaran],
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus tahun ajaran ini');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const tahunAjaran = await this.prismaService.tahunAjaran.findFirst({
      where: {
        tahunAjaranId: tahunAjaranId,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (!tahunAjaran.isActive) {
      await this.prismaService.tahunAjaran.delete({
        where: {
          tahunAjaranId: tahunAjaranId,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      return {
        status: "success",
        message: 'Tahun ajaran berhasil dihapus',
        data: tahunAjaran,
      };
    }

    return {
      status: "error",
      message: 'Tahun ajaran tidak bisa dihapus karena aktif',
      data: tahunAjaran,
    };
  }
}
