import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class LaporanMagangService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request,
  ) { }

  async create(
    mahasiswaId: number,
    createLaporanMagangDto,
    fileLaporan: string
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'LaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat laporan magang');
    }

    const laporanMagang = await this.prismaService.laporanMagang.create({
      data: {
        fileLaporan: fileLaporan,
        tanggal: new Date(createLaporanMagangDto.tanggal),
        mahasiswa: {
          connect: {
            mahasiswaId: mahasiswaId
          }
        }
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Laporan magang berhasil dibuat',
      data: laporanMagang
    }
  }

  async findLaporanBy(param: { mahasiswaId: number }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'LaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat laporan magang');
    }

    const year = await this.prismaService.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const laporanMagangs = await this.prismaService.laporanMagang.findMany({
      where: {
        AND: [accessibleBy(ability).LaporanMagang],
        mahasiswa: {
          user: {
            tahunAjaranId: year.tahunAjaranId
          }
        },
        mahasiswaId: parseInt(param.mahasiswaId.toString()) || undefined
      },
      include: {
        mahasiswa: true
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Berhasil menemukan laporan magang',
      data: laporanMagangs
    }
  }

  async update(laporanId: number, updateLaporanMagangDto, fileLaporan: string) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'LaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate laporan magang');
    }

    await this.prismaService.laporanMagang.findFirstOrThrow({
      where: {
        laporanId: laporanId,
        AND: [accessibleBy(ability).LaporanMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate laporan magang ini');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const laporanMagang = await this.prismaService.laporanMagang.update({
      where: {
        laporanId: laporanId
      },
      data: {
        fileLaporan: fileLaporan,
        tanggal: updateLaporanMagangDto.tanggal == null ? null : new Date(updateLaporanMagangDto.tanggal),
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Laporan magang berhasil diupdate',
      data: laporanMagang
    }
  }

  // async approveDosen(laporanId: number) {
  //   const injectedToken = this.request.headers['authorization'].split(' ')[1];
  //   const payload = this.jwtService.decode(injectedToken);
  //   const ability = this.caslAbilityFactory.createForUser(payload);

  //   if (!ability.can('update', 'LaporanMagang')) {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk menyetujui laporan magang');
  //   }

  //   await this.prismaService.laporanMagang.findFirstOrThrow({
  //     where: {
  //       laporanId: laporanId,
  //       AND:[accessibleBy(ability).LaporanMagang]
  //     }
  //   }).catch(() => {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk menyetujui laporan magang ini');
  //   });

  //   const laporanMagang = await this.prismaService.laporanMagang.update({
  //     where: {
  //       laporanId: laporanId
  //     },
  //     data: {
  //       isFinalByDosen: true
  //     }
  //   });

  //   return {
  //     status: 'success',
  //     message: 'Laporan magang berhasil disetujui',
  //     data: laporanMagang
  //   }
  // }

  // async approve(laporanId: number) {
  //   const injectedToken = this.request.headers['authorization'].split(' ')[1];
  //   const payload = this.jwtService.decode(injectedToken);
  //   const ability = this.caslAbilityFactory.createForUser(payload);

  //   if (!ability.can('update', 'LaporanMagang')) {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk menyetujui laporan magang');
  //   }

  //   await this.prismaService.laporanMagang.findFirstOrThrow({
  //     where: {
  //       laporanId: laporanId,
  //       AND:[accessibleBy(ability).LaporanMagang]
  //     }
  //   }).catch(() => {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk menyetujui laporan magang ini');
  //   });

  //   let laporanMagang;

  //   if (payload.roleId === 3) {
  //     laporanMagang = await this.prismaService.laporanMagang.update({
  //       where: {
  //         laporanId: laporanId
  //       },
  //       data: {
  //         isFinalByDosen: true
  //       }
  //     });
  //   }
  //   if (payload.roleId === 4) {
  //     laporanMagang = await this.prismaService.laporanMagang.update({
  //       where: {
  //         laporanId: laporanId
  //       },
  //       data: {
  //         isFinalByPemlap: true
  //       }
  //     });
  //   } else {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk menyetujui laporan magang');
  //   }

  //   return {
  //     status: 'success',
  //     message: 'Laporan magang berhasil disetujui',
  //     data: laporanMagang
  //   }
  // }

  // async ulas(laporanId: number, body: { ulasan: string }) {
  //   const injectedToken = this.request.headers['authorization'].split(' ')[1];
  //   const payload = this.jwtService.decode(injectedToken);
  //   const ability = this.caslAbilityFactory.createForUser(payload);

  //   if (!ability.can('update', 'LaporanMagang')) {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk memberikan ulasan laporan magang');
  //   }

  //   await this.prismaService.laporanMagang.findFirstOrThrow({
  //     where: {
  //       laporanId: laporanId,
  //       AND:[accessibleBy(ability).LaporanMagang]
  //     }
  //   }).catch(() => {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk memberikan ulasan laporan magang ini');
  //   });

  //   const laporanMagang = await this.prismaService.laporanMagang.update({
  //     where: {
  //       laporanId: laporanId
  //     },
  //     data: {
  //       ulasan: body.ulasan
  //     }
  //   });

  //   return {
  //     status: 'success',
  //     message: 'Ulasan berhasil diberikan',
  //     data: laporanMagang
  //   }
  // }

  async getPeriodePengumpulanLaporanMagang(params: {
    tahunAjaranId: number
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PeriodePengumpulanLaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat periode pengumpulan laporan magang');
    }

    const periodePengumpulanLaporanMagang = await this.prismaService.periodePengumpulanLaporanMagang.findFirst({
      where: {
        AND: [accessibleBy(ability).PeriodePengumpulanLaporanMagang],
        tahunAjaranId: params.tahunAjaranId || undefined
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Berhasil menemukan periode pengumpulan laporan magang',
      data: periodePengumpulanLaporanMagang
    }
  }

  async createPeriodePengumpulanLaporanMagang(periode: {
    tanggalMulai: Date,
    tanggalAkhir: Date,
    tahunAjaranId: number
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PeriodePengumpulanLaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat periode pengumpulan laporan magang');
    }

    const periodePengumpulanLaporanMagang = await this.prismaService.periodePengumpulanLaporanMagang.create({
      data: {
        tanggalMulai: periode.tanggalMulai,
        tanggalAkhir: periode.tanggalAkhir,
        tahunAjaran: {
          connect: {
            tahunAjaranId: periode.tahunAjaranId
          }
        }
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode pengumpulan laporan magang berhasil dibuat',
      data: periodePengumpulanLaporanMagang
    }
  }

  async updatePeriodePengumpulanLaporanMagang(periodeId: number, periode: {
    tanggalMulai: Date,
    tanggalAkhir: Date
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PeriodePengumpulanLaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate periode pengumpulan laporan magang');
    }

    await this.prismaService.periodePengumpulanLaporanMagang.findFirstOrThrow({
      where: {
        periodePengumpulanLaporanMagangId: periodeId,
        AND: [accessibleBy(ability).PeriodePengumpulanLaporanMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate periode pengumpulan laporan magang ini');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const periodePengumpulanLaporanMagang = await this.prismaService.periodePengumpulanLaporanMagang.update({
      where: {
        periodePengumpulanLaporanMagangId: periodeId
      },
      data: {
        tanggalMulai: periode.tanggalMulai,
        tanggalAkhir: periode.tanggalAkhir
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode pengumpulan laporan magang berhasil diupdate',
      data: periodePengumpulanLaporanMagang
    }
  }

  async deletePeriodePengumpulanLaporanMagang(periodeId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'PeriodePengumpulanLaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus periode pengumpulan laporan magang');
    }

    await this.prismaService.periodePengumpulanLaporanMagang.findFirstOrThrow({
      where: {
        periodePengumpulanLaporanMagangId: periodeId,
        AND: [accessibleBy(ability).PeriodePengumpulanLaporanMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus periode pengumpulan laporan magang ini');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const periodePengumpulanLaporanMagang = await this.prismaService.periodePengumpulanLaporanMagang.delete({
      where: {
        periodePengumpulanLaporanMagangId: periodeId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode pengumpulan laporan magang berhasil dihapus',
      data: periodePengumpulanLaporanMagang
    }
  }
}
