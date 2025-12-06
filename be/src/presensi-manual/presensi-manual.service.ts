import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';
import { join } from 'path';
import { Request } from 'express';
import * as fs from 'fs';

@Injectable()
export class PresensiManualService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async create(
    createPresensiManualDto,
    file: string
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PresensiManual')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat presensi manual');
    }

    const mahasiswa = await this.prisma.mahasiswa.findFirst({
      where: {
        userId: payload['id']
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    // setiap new Date pasti formatnya jadi UTC, ubah ke timezone Jakarta untuk mendapatkan presensi, tapi simpannya tetap UTC
    // let tanggalHariIni = new Date(new Date().getTime() + (-new Date().getTimezoneOffset()) * 60 * 1000);
    let tanggalPilihan = new Date(createPresensiManualDto.tanggal)

    const presensiManualCek = await this.prisma.presensiManual.findFirst({
      where: {
        tanggal: {
          gte: new Date(new Date(tanggalPilihan).toISOString().slice(0, 10) + ' 00:00:00'),
          lte: new Date(new Date(tanggalPilihan).toISOString().slice(0, 10) + ' 23:59:59')
        },
        mahasiswaId: mahasiswa.mahasiswaId
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    let presensiManual = null

    if (!presensiManualCek) {
      presensiManual = await this.prisma.presensiManual.create({
        data: {
          tanggal: tanggalPilihan,
          keterangan: createPresensiManualDto.keterangan,
          bukti: file,
          mahasiswa: {
            connect: {
              mahasiswaId: parseInt(mahasiswa.mahasiswaId.toString()),
            },
          },
        },
      }).finally(() => {
        this.prisma.$disconnect();
      });
    } else {
      // hapus file lama
      fs.unlinkSync(join(process.cwd(), 'public/file-bukti-presensi-manual/' + presensiManualCek.bukti));

      presensiManual = await this.prisma.presensiManual.update({
        where: {
          presensiManualId: presensiManualCek.presensiManualId
        },
        data: {
          tanggal: tanggalPilihan,
          keterangan: createPresensiManualDto.keterangan,
          bukti: file,
          mahasiswa: {
            connect: {
              mahasiswaId: parseInt(mahasiswa.mahasiswaId.toString()),
            },
          },
        },
      }).finally(() => {
        this.prisma.$disconnect();
      });
    }

    return {
      status: 'success',
      message: 'Izin presensi berhasil ditambahkan',
      data: presensiManual,
    }
  }

  async findAllBy(params: { presensiManualId?: string }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PresensiManual')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat presensi manual');
    }

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const presensiManual = await this.prisma.presensiManual.findMany({
      where: {
        AND: [
          accessibleBy(ability).PresensiManual, 
          {
            mahasiswa: {
              user: {
                tahunAjaranId: year.tahunAjaranId
              }
            }
          }
        ],
        presensiManualId: parseInt(params.presensiManualId) || undefined,
      },
      select: {
        presensiManualId: true,
        tanggal: true,
        keterangan: true,
        bukti: true,
        disetujui: true,
        status: true,
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
          },
        },
      },
      orderBy: {
        tanggal: 'desc',
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data presensi manual berhasil ditemukan',
      data: presensiManual,
    }
  }

  async remove(id: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'PresensiManual')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus presensi manual');
    }

    const presensiManual = await this.prisma.presensiManual.findFirst({
      where: {
        presensiManualId: id,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (!presensiManual) {
      return {
        status: 'error',
        message: 'Data presensi manual tidak ditemukan',
      }
    }

    // hapus file
    fs.unlinkSync(join(process.cwd(), 'public/file-bukti-presensi-manual/' + presensiManual.bukti));

    await this.prisma.presensiManual.delete({
      where: {
        presensiManualId: id,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data presensi manual berhasil dihapus',
    }
  }

  async setujuiPresensiManual(presensiManualId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PresensiManual')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menyetujui presensi manual');
    }

    const presensiManual = await this.prisma.presensiManual.findFirst({
      where: {
        presensiManualId: presensiManualId,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (!presensiManual) {
      return {
        status: 'error',
        message: 'Data presensi manual tidak ditemukan',
      }
    }

    await this.prisma.presensiManual.update({
      where: {
        presensiManualId: presensiManualId,
      },
      data: {
        disetujui: true,
        status: 'Disetujui',
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const tanggal = presensiManual.tanggal;

    const waktuDatang = new Date(tanggal);
    waktuDatang.setHours(14, 30, 0, 0);

    const waktuPulang = new Date(tanggal);
    waktuPulang.setHours(23, 30, 0, 0);

    // console.log(waktuDatang, waktuPulang, tanggal);

    const presensi = await this.prisma.presensi.findFirst({
      where: {
        tanggal: {
          gte: new Date(new Date(tanggal).toISOString().slice(0, 10) + ' 00:00:00'),
          lte: new Date(new Date(tanggal).toISOString().slice(0, 10) + ' 23:59:59')
        },
        mahasiswaId: presensiManual.mahasiswaId
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (presensi) {
      await this.prisma.presensi.update({
        where: {
          presensiId: (await presensi).presensiId
        },
        data: {
          waktuDatang: waktuDatang,
          waktuPulang: waktuPulang,
          bobotKetidakHadiran: 0,
          durasiJamKerja: 8,
          jumlahJamKerja: 8,
          statusJamKerja: "Jam Kerja Terpenuhi",
          status: "Tepat Waktu",
        }
      }).finally(() => {
        this.prisma.$disconnect();
      });
    } else {
      await this.prisma.presensi.create({
        data: {
          tanggal: tanggal,
          waktuDatang: waktuDatang,
          waktuPulang: waktuPulang,
          bobotKetidakHadiran: 0,
          durasiJamKerja: 8,
          jumlahJamKerja: 8,
          statusJamKerja: "Jam Kerja Terpenuhi",
          status: "Tepat Waktu",
          mahasiswa: {
            connect: {
              mahasiswaId: presensiManual.mahasiswaId
            },
          },
        },
      }).finally(() => {
        this.prisma.$disconnect();
      });
    }

    return {
      status: 'success',
      message: 'Presensi manual berhasil disetujui',
    }
  }

  async tolakPresensiManual(presensiManualId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PresensiManual')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menolak presensi manual');
    }

    const presensiManual = await this.prisma.presensiManual.findFirst({
      where: {
        presensiManualId: presensiManualId,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (!presensiManual) {
      return {
        status: 'error',
        message: 'Data presensi manual tidak ditemukan',
      }
    }

    await this.prisma.presensiManual.update({
      where: {
        presensiManualId: presensiManualId,
      },
      data: {
        disetujui: false,
        status: 'Ditolak',
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const tanggal = presensiManual.tanggal;

    const waktuDatang = new Date(tanggal);
    waktuDatang.setHours(23, 30, 0, 0);

    const waktuPulang = new Date(tanggal);
    waktuPulang.setHours(23, 30, 0, 0);

    const presensi = this.prisma.presensi.findFirst({
      where: {
        tanggal: {
          gte: new Date(new Date(tanggal).toISOString().slice(0, 10) + ' 00:00:00'),
          lte: new Date(new Date(tanggal).toISOString().slice(0, 10) + ' 23:59:59')
        },
        mahasiswaId: presensiManual.mahasiswaId
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (!presensi) {
      await this.prisma.presensi.create({
        data: {
          tanggal: tanggal,
          waktuDatang: waktuDatang,
          waktuPulang: waktuPulang,
          bobotKetidakHadiran: 1,
          durasiJamKerja: 0,
          jumlahJamKerja: 0,
          statusJamKerja: "Jam Kerja Kurang",
          status: "Tidak Hadir",
          mahasiswa: {
            connect: {
              mahasiswaId: presensiManual.mahasiswaId
            },
          },
        },
      }).finally(() => {
        this.prisma.$disconnect();
      });
    } else {
      await this.prisma.presensi.update({
        where: {
          presensiId: (await presensi).presensiId
        },
        data: {
          waktuDatang: waktuDatang,
          waktuPulang: waktuPulang,
          bobotKetidakHadiran: 1,
          durasiJamKerja: 0,
          jumlahJamKerja: 0,
          statusJamKerja: "Jam Kerja Kurang",
          status: "Tidak Hadir",
        }
      }).finally(() => {
        this.prisma.$disconnect();
      });
    }

    return {
      status: 'success',
      message: 'Presensi manual berhasil ditolak',
    }
  }

  // async update(id: number, updatePresensiManualDto, file: string) {
  //   const injectedToken = this.request.headers['authorization'].split(' ')[1];
  //   const payload = this.jwtService.decode(injectedToken);
  //   const ability = this.caslAbilityFactory.createForUser(payload);

  //   if (!ability.can('update', 'PresensiManual')) {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah presensi manual');
  //   }

  //   const presensiManual = await this.prisma.presensiManual.findFirst({
  //     where: {
  //       presensiManualId: id,
  //     },
  //   });

  //   if (!presensiManual) {
  //     return {
  //       status: 'error',
  //       message: 'Data presensi manual tidak ditemukan',
  //     }
  //   }

  //   const mahasiswa = await this.prisma.mahasiswa.findFirst({
  //     where: {
  //       userId: payload['id']
  //     }
  //   }).finally(() => {
  //     this.prisma.$disconnect();
  //   });

  //   const data = await this.prisma.presensiManual.update({
  //     where: {
  //       presensiManualId: id,
  //     },
  //     data: {
  //       tanggal: new Date().toLocaleString(),
  //       keterangan: updatePresensiManualDto.keterangan,
  //       bukti: file,
  //       mahasiswa: {
  //         connect: {
  //           mahasiswaId: parseInt(mahasiswa.mahasiswaId.toString()),
  //         },
  //       },
  //     },
  //   }).finally(() => {
  //     this.prisma.$disconnect();
  //   })

  //   return {
  //     status: 'success',
  //     message: 'Data presensi manual berhasil diubah',
  //     data: data,
  //   }
  // }
}
