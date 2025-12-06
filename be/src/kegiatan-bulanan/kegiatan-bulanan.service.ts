import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRekapKegiatanBulananDto } from '../kegiatan-bulanan/dto/rekap-kegiatan-bulanan/create-rekapKegiatanBulanan.dto';
import { UpdateRekapKegiatanBulananDto } from '../kegiatan-bulanan/dto/rekap-kegiatan-bulanan/update-rekapKegiatanBulanan.dto';
import { UpdateRekapKegiatanBulananTipeKegiatan } from '../kegiatan-bulanan/dto/rekap-kegiatan-bulanan-tipe-kegiatan/update-rekapKegiatanBulananTipeKegiatan.dto';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class KegiatanBulananService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async create(
    mahasiswaId: number,
    createRekapKegiatanBulananDto: CreateRekapKegiatanBulananDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    // const ability = this.caslAbilityFactory.createForUser(payload);

    // if (!ability.can('create', 'RekapKegiatanBulanan')) {
    //   throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan data rekap kegiatan bulanan');
    // }

    // find all kegiatan harian in period of time from tanggalAwal to tanggalAkhir
    const kegiatanHarians = await this.prismaService.kegiatanHarian.findMany({
      where: {
        AND: [
          // accessibleBy(ability).KegiatanHarian,
          {
            tanggal: {
              gte: new Date(createRekapKegiatanBulananDto.tanggalAwal)
            }
          },
          {
            tanggal: {
              lte: new Date(createRekapKegiatanBulananDto.tanggalAkhir)
            }
          }
        ],
        mahasiswaId: parseInt(mahasiswaId.toString())
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // sum every kegiatan harian volume per tipe kegiatan
    const kegiatanHariansGrouped = kegiatanHarians.reduce((acc, kegiatanHarian) => {
      if (acc[kegiatanHarian.tipeKegiatanId] === undefined) {
        acc[kegiatanHarian.tipeKegiatanId] = 0;
      }

      acc[kegiatanHarian.tipeKegiatanId] += kegiatanHarian.volume;

      return acc;
    }, {});

    // create rekap kegiatan bulanan and connect every tipe kegiatan
    const rekapKegiatanBulanan = await this.prismaService.rekapKegiatanBulanan.create({
      data: {
        tanggalAwal: new Date(createRekapKegiatanBulananDto.tanggalAwal),
        tanggalAkhir: new Date(createRekapKegiatanBulananDto.tanggalAkhir),
        mahasiswa: {
          connect: {
            mahasiswaId: mahasiswaId
          }
        },
        RekapKegiatanBulananTipeKegiatan: {
          create: await Promise.all(Object.keys(kegiatanHariansGrouped).map(async (tipeKegiatanId) => ({
            uraian: (
              (await this.prismaService.tipeKegiatan.findUnique({
                where: {
                  tipeKegiatanId: parseInt(tipeKegiatanId)
                }
              })).nama
            ),
            tipeKegiatan: {
              connect: {
                tipeKegiatanId: parseInt(tipeKegiatanId)
              }
            },
            target: kegiatanHariansGrouped[tipeKegiatanId]
          })
          ))
        }
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Rekap Kegiatan Bulanan Berhasil Ditambahkan',
      data: rekapKegiatanBulanan
    }
  }

  async createRekap(createRekapKegiatanBulananDto: CreateRekapKegiatanBulananDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    // const ability = this.caslAbilityFactory.createForUser(payload);

    // if (!ability.can('create', 'RekapKegiatanBulanan')) {
    //   throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan data rekap kegiatan bulanan');
    // }

    //jika tanggal awal lebih besar dari tanggal akhir maka throw error
    if (new Date(createRekapKegiatanBulananDto.tanggalAwal) > new Date(createRekapKegiatanBulananDto.tanggalAkhir)) {
      return {
        status: 'error',
        message: 'Tanggal Awal Tidak Boleh Lebih Besar Dari Tanggal Akhir'
      }
    }

    //find periode rekap kegiatan bulanan, if overlap then throw error
    const periodeRekap = await this.prismaService.rekapKegiatanBulanan.findMany({
      where: {
        OR: [
          {
            tanggalAwal: {
              gte: new Date(createRekapKegiatanBulananDto.tanggalAwal),
              lte: new Date(createRekapKegiatanBulananDto.tanggalAkhir)
            },
          },
          {
            tanggalAkhir: {
              gte: new Date(createRekapKegiatanBulananDto.tanggalAwal),
              lte: new Date(createRekapKegiatanBulananDto.tanggalAkhir)
            },
          },
          {
            AND: [
              {
                tanggalAwal: {
                  gte: new Date(createRekapKegiatanBulananDto.tanggalAwal)
                },
              },
              {
                tanggalAkhir: {
                  lte: new Date(createRekapKegiatanBulananDto.tanggalAkhir)
                }  
              }
            ]
          },
          {
            AND: [
              {
                tanggalAwal: {
                  lte: new Date(createRekapKegiatanBulananDto.tanggalAwal)
                },
              },
              {
                tanggalAkhir: {
                  gte: new Date(createRekapKegiatanBulananDto.tanggalAkhir)
                }  
              }
            ]
          }
        ],
        // AND: [accessibleBy(ability).RekapKegiatanBulanan],
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (periodeRekap.length > 0) {
      return {
        status: 'error',
        message: 'Periode Rekap Kegiatan Bulanan Tidak Boleh Tumpang Tindih'
      }
    }

    const mahasiswas = await this.prismaService.mahasiswa.findMany({
      where: {
        // AND: [accessibleBy(ability).Mahasiswa],
        user: {
          tahunAjaran: {
            isActive: true
          }
        }
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // create rekap kegiatan bulanan for every mahasiswa
    const rekapKegiatanBulanan = await Promise.all(mahasiswas.map(async (mahasiswa) => {
      // find all kegiatan harian in period of time from tanggalAwal to tanggalAkhir
      const kegiatanHarians = await this.prismaService.kegiatanHarian.findMany({
        where: {
          AND: [
            // accessibleBy(ability).KegiatanHarian,
            {
              tanggal: {
                gte: new Date(createRekapKegiatanBulananDto.tanggalAwal)
              }
            },
            {
              tanggal: {
                lte: new Date(createRekapKegiatanBulananDto.tanggalAkhir)
              }
            }
          ],
          mahasiswaId: mahasiswa.mahasiswaId
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      // sum every kegiatan harian volume per tipe kegiatan
      const kegiatanHariansGrouped = kegiatanHarians.reduce((acc, kegiatanHarian) => {
        if (acc[kegiatanHarian.tipeKegiatanId] === undefined) {
          acc[kegiatanHarian.tipeKegiatanId] = 0;
        }

        acc[kegiatanHarian.tipeKegiatanId] += kegiatanHarian.volume;

        return acc;
      }, {});

      // create rekap kegiatan bulanan and connect every tipe kegiatan
      return await this.prismaService.rekapKegiatanBulanan.create({
        data: {
          tanggalAwal: new Date(createRekapKegiatanBulananDto.tanggalAwal),
          tanggalAkhir: new Date(createRekapKegiatanBulananDto.tanggalAkhir),
          mahasiswa: {
            connect: {
              mahasiswaId: mahasiswa.mahasiswaId
            }
          },
          RekapKegiatanBulananTipeKegiatan: {
            create: await Promise.all(Object.keys(kegiatanHariansGrouped).map(async (tipeKegiatanId) => ({
              uraian: (
                (await this.prismaService.tipeKegiatan.findUnique({
                  where: {
                    tipeKegiatanId: parseInt(tipeKegiatanId)
                  }
                })).nama
              ),
              tipeKegiatan: {
                connect: {
                  tipeKegiatanId: parseInt(tipeKegiatanId)
                }
              },
              target: kegiatanHariansGrouped[tipeKegiatanId]
            })
            ))
          }
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });
    }));

    return {
      status: 'success',
      message: 'Data Rekap Kegiatan Bulanan Berhasil Ditambahkan',
      data: rekapKegiatanBulanan
    }
  }

  async getPeriodeRekapKegiatanBulanan(
     query: {
      mahasiswaId?: number;
    }
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    // const ability = this.caslAbilityFactory.createForUser(payload);

    // if (!ability.can('read', 'RekapKegiatanBulanan')) {
    //   throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data rekap kegiatan bulanan');
    // }

    
    const year = await this.prismaService.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const data = await this.prismaService.rekapKegiatanBulanan.findMany({
      where: {
        mahasiswa: {
          user: {
            tahunAjaranId: year.tahunAjaranId
          },
          mahasiswaId: query.mahasiswaId.toString() === '' 
            ? undefined 
            : parseInt(query.mahasiswaId.toString())
        }
      },
      select: {
        tanggalAwal: true
      }
    });

    // Format ke tanggal 1 dan tanggal akhir setiap bulan, dan hilangkan duplikat
    const uniqueMap = new Map<string, { tanggalAwal: Date, tanggalAkhir: Date, label: string }>();

    data.forEach(item => {
      const original = new Date(item.tanggalAwal);
      const tahun = original.getFullYear();
      const bulan = original.getMonth(); // 0-based (0 = Januari)

      const tanggalAwal = new Date(tahun, bulan, 1);
      const tanggalAkhir = new Date(tahun, bulan + 1, 0);

      const label = tanggalAwal.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

      if (!uniqueMap.has(label)) {
        uniqueMap.set(label, {
          tanggalAwal,
          tanggalAkhir,
          label
        });
      }
    });

    const uniquePeriods = Array.from(uniqueMap.values()).sort((a, b) => a.tanggalAwal.getTime() - b.tanggalAwal.getTime());

    // console.info("data data periode", uniquePeriods);
    
    // console.log("rekap",data)
    return {
      status: 'success',
      message: 'Data Periode Rekap Kegiatan Bulanan Berhasil Diambil',
      data: uniquePeriods
    }
  }

  async findAllRekapKegiatanBulananBy(query) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const page = parseInt(query.page) || 1;
    const pageSize = query.pageSize ? parseInt(query.pageSize) : undefined;

    const [data, total]  = await this.prismaService.$transaction([
      this.prismaService.rekapKegiatanBulanan.findMany({
      where: {
        AND: [
          // accessibleBy(ability).RekapKegiatanBulanan,
          {
            tanggalAwal: {
              gte: query.tanggalAwal === '' ? undefined : new Date(query.tanggalAwal)
            }
          },
          {
            tanggalAkhir: {
              lte: query.tanggalAkhir === '' ? undefined : new Date(query.tanggalAkhir)
            }
          },
          {
            mahasiswaId: query.mahasiswaId.toString() === '' ? undefined : parseInt(query.mahasiswaId.toString())
          }
        ]
      },
      skip: pageSize ? (page - 1) * pageSize : undefined,
      take: pageSize,
      include: {
        RekapKegiatanBulananTipeKegiatan: {
          include: {
            tipeKegiatan: true
          }
        }
      },}),
       this.prismaService.rekapKegiatanBulanan.count({ where: {
        AND: [
          // accessibleBy(ability).RekapKegiatanBulanan,
          {
            tanggalAwal: {
              gte: query.tanggalAwal === '' ? undefined : new Date(query.tanggalAwal)
            }
          },
          {
            tanggalAkhir: {
              lte: query.tanggalAkhir === '' ? undefined : new Date(query.tanggalAkhir)
            }
          },
          {
            mahasiswaId: query.mahasiswaId.toString() === '' ? undefined : parseInt(query.mahasiswaId.toString())
          }
        ]
      },}),
  ]);

    return {
      status: 'success',
      message: 'Data Kegiatan Bulanan Berhasil Diambil',
      data: data,
      total
    }
  }

  async updateKualitasRekapKegiatan(
    updateRekapKegiatanBulananTipeKegiatan: UpdateRekapKegiatanBulananTipeKegiatan[]
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    // const ability = this.caslAbilityFactory.createForUser(payload);

    // if (!ability.can('update', 'RekapKegiatanBulananTipeKegiatan')) {
    //   throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah kualitas rekap kegiatan bulanan tipe kegiatan');
    // }

    // update data rekap kegiatan bulanan tipe kegiatan
    const data = await Promise.all(updateRekapKegiatanBulananTipeKegiatan.map(async (rekapKegiatanBulananTipeKegiatan) => {
      return await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
        where: {
          rekapTipeId: rekapKegiatanBulananTipeKegiatan.rekapTipeId
        },
        data: {
          tingkatKualitas: rekapKegiatanBulananTipeKegiatan.tingkatKualitas,
          keterangan: rekapKegiatanBulananTipeKegiatan.keterangan
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });
    }));

    return {
      status: 'success',
      message: 'Data Kualitas Rekap Kegiatan Bulanan Berhasil Diubah',
      data: data
    }
  }

  async updateStatusRekapKegiatanBulanan(
    rekapId: number,
    updateRekapKegiatanBulananDto: UpdateRekapKegiatanBulananDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    // const ability = this.caslAbilityFactory.createForUser(payload);

    // if (!ability.can('update', 'RekapKegiatanBulanan')) {
    //   throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah status rekap kegiatan bulanan');
    // }

    await this.prismaService.rekapKegiatanBulanan.findFirstOrThrow({
      where: {
        rekapId: rekapId,
        // AND: [accessibleBy(ability).RekapKegiatanBulanan]
      }
    }).catch(() => {
      throw new ForbiddenException('Rekap Kegiatan Bulanan tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const data = await this.prismaService.rekapKegiatanBulanan.update({
      where: {
        rekapId: rekapId
      },
      data: {
        isFinal: updateRekapKegiatanBulananDto.isFinal,
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Status Rekap Kegiatan Bulanan Berhasil Diubah',
      data: data
    }
  }

  async updateDetailRekapKegiatan(
    rekapTipeKegiatanId: number,
    updateRekapBulananTipeKegiatan: UpdateRekapKegiatanBulananTipeKegiatan
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    // const ability = this.caslAbilityFactory.createForUser(payload);

    // if (!ability.can('update', 'RekapKegiatanBulananTipeKegiatan')) {
    //   throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah detail data rekap kegiatan bulanan tipe kegiatan');
    // }

    // cek apakah rekap kegiatan sudah final
    const idRekapKegiatanBulanan = (
      await this.prismaService.rekapKegiatanBulananTipeKegiatan.findUnique({
        where: {
          rekapTipeId: rekapTipeKegiatanId
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      })
    ).rekapId;

    await this.prismaService.rekapKegiatanBulanan.findFirstOrThrow({
      where: {
        rekapId: idRekapKegiatanBulanan,
        // AND: [accessibleBy(ability).RekapKegiatanBulanan]
      }
    }).catch(() => {
      throw new ForbiddenException('Rekap Kegiatan Bulanan tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const rekapKegiatanBulanan = await this.prismaService.rekapKegiatanBulanan.findUnique({
      where: {
        rekapId: idRekapKegiatanBulanan
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (rekapKegiatanBulanan.isFinal) {
      return {
        status: 'error',
        message: 'Data Rekap Kegiatan Bulanan Sudah Final'
      }
    }

    // update data rekap kegiatan bulanan tipe kegiatan
    const data = await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
      where: {
        rekapTipeId: rekapTipeKegiatanId
      },
      data: {
        realisasi: updateRekapBulananTipeKegiatan.realisasi,
        persentase: updateRekapBulananTipeKegiatan.realisasi / (
          await this.prismaService.rekapKegiatanBulananTipeKegiatan.findUnique({
            where: {
              rekapTipeId: rekapTipeKegiatanId
            },
          })
        ).target * 100
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Rekap Kegiatan Bulanan Berhasil Diubah',
      data: data
    }
  }

  async remove(rekapId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'RekapKegiatanBulanan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus data rekap kegiatan bulanan');
    }

    await this.prismaService.rekapKegiatanBulanan.findFirstOrThrow({
      where: {
        rekapId: rekapId,
        AND: [accessibleBy(ability).RekapKegiatanBulanan]
      }
    }).catch(() => {
      throw new ForbiddenException('Rekap Kegiatan Bulanan tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // cek apakah rekap kegiatan sudah final
    const rekapKegiatanBulanan = await this.prismaService.rekapKegiatanBulanan.findUnique({
      where: {
        rekapId: rekapId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (rekapKegiatanBulanan.isFinal) {
      return {
        status: 'error',
        message: 'Data Rekap Kegiatan Bulanan Sudah Final'
      }
    }

    const data = await this.prismaService.rekapKegiatanBulanan.delete({
      where: {
        rekapId: rekapId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Rekap Kegiatan Bulanan Berhasil Dihapus',
      data: data
    }
  }
}
