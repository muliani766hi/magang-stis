import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateKegiatanHarianDto } from '../kegiatan-harian/dto/kegiatan-harian/create-kegiatanHarian.dto';
import { UpdateKegiatanHarianDto } from './dto/kegiatan-harian/update-kegiatanHarian.dto';
import { CreateTipeKegiatanDto } from '../kegiatan-harian/dto/tipe-kegiatan/create-tipeKegiatan.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTipeKegiatanDto } from '../kegiatan-harian/dto/tipe-kegiatan/update-tipeKegiatan.dto';
import { REQUEST } from '@nestjs/core';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { JwtService } from '@nestjs/jwt';
import { accessibleBy } from '@casl/prisma';
import { parse } from 'path';

/*
  WARNING: Perlu memahami schema Prisma dan Casl sebelum mencoba mengubah kode ini
*/

@Injectable()
export class KegiatanHarianService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  //  TIPE KEGIATAN
  async createTipeKegiatan(tipeKegiatan: CreateTipeKegiatanDto, mahasiswaId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'TipeKegiatan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan data tipe kegiatan');
    }

    const data = await this.prismaService.tipeKegiatan.create({
      data: {
        nama: tipeKegiatan.nama,
        satuan: tipeKegiatan.satuan,
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
      status: "success",
      message: "Tipe Kegiatan Harian Berhasil Ditambahkan",
      data: data
    }
  }

  async findAllTipeKegiatan(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'TipeKegiatan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data tipe kegiatan');
    }

    const tipeKegiatan = await this.prismaService.tipeKegiatan.findMany({
      where: {
        AND: [
          accessibleBy(ability).TipeKegiatan,
          {
            nama: {
              contains: params.nama
            },
            satuan: {
              contains: params.satuan
            }
          }
        ]
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Tipe Kegiatan Berhasil Diambil',
      data: tipeKegiatan
    }
  }

  async updateTipeKegiatan(tipeKegiatanId: number, tipeKegiatan: UpdateTipeKegiatanDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'TipeKegiatan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data tipe kegiatan');
    }

    await this.prismaService.tipeKegiatan.findFirstOrThrow({
      where: {
        tipeKegiatanId: tipeKegiatanId,
        AND: [accessibleBy(ability).TipeKegiatan]
      }
    }).catch(() => {
      throw new ForbiddenException('Tipe Kegiatan tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const data = await this.prismaService.tipeKegiatan.update({
      where: {
        tipeKegiatanId: tipeKegiatanId
      },
      data: {
        nama: tipeKegiatan.nama === undefined ? undefined : tipeKegiatan.nama,
        satuan: tipeKegiatan.satuan === undefined ? undefined : tipeKegiatan.satuan
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Tipe Kegiatan Berhasil Diupdate',
      data: data
    }
  }

  async removeTipeKegiatan(tipeKegiatanId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'TipeKegiatan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus data tipe kegiatan');
    }

    await this.prismaService.tipeKegiatan.findFirstOrThrow({
      where: {
        tipeKegiatanId: tipeKegiatanId,
        AND: [accessibleBy(ability).TipeKegiatan]
      }
    }).catch(() => {
      throw new ForbiddenException('Tipe Kegiatan tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const tipeKegiatan = await this.prismaService.tipeKegiatan.delete({
      where: {
        tipeKegiatanId: tipeKegiatanId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Tipe Kegiatan Berhasil Dihapus',
      data: tipeKegiatan
    }
  }

  // CATATAN KEGIATAN HARIAN
  async createKegiatanHarian(createKegiatanHarian: CreateKegiatanHarianDto, mahasiswaId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'KegiatanHarian')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan data kegiatan harian');
    }

    // add tanggal with timezone
    const tanggal = new Date(createKegiatanHarian.tanggal);
    const offsettanggal = tanggal.getTimezoneOffset();
    const tanggalbener = new Date(tanggal.setTime(tanggal.getTime() + (-offsettanggal) * 60 * 1000));

    if (createKegiatanHarian.volume.toString() == "") {
      createKegiatanHarian.volume = 0;
    }

    if (createKegiatanHarian.durasi.toString() == "") {
      createKegiatanHarian.durasi = 0;
    }

    if (createKegiatanHarian.statusPenyelesaian.toString() == "") {
      createKegiatanHarian.statusPenyelesaian = 0;
    }

    const data = await this.prismaService.kegiatanHarian.create({
      data: {
        tanggal: tanggalbener,
        deskripsi: createKegiatanHarian.deskripsi || '',
        volume: createKegiatanHarian.volume || 0,
        durasi: createKegiatanHarian.durasi || 0,
        pemberiTugas: createKegiatanHarian.pemberiTugas || '',
        tim : createKegiatanHarian.tim || '',
        statusPenyelesaian: Math.round(createKegiatanHarian.statusPenyelesaian) || 0,
        tipeKegiatan: {
          connect: {
            // cek jika mahasiswa sudah memiliki tipe kegiatan, jika belum maka error
            tipeKegiatanId: (
              await this.prismaService.tipeKegiatan.findFirstOrThrow({
                where: {
                  tipeKegiatanId: createKegiatanHarian.tipeKegiatan.tipeKegiatanId,
                }
              })
            ).tipeKegiatanId
          }
        },
        mahasiswa: {
          connect: {
            mahasiswaId: parseInt(mahasiswaId.toString())
          }
        }
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // console.log(data);

    // get all rekap kegiatan bulanan
    const allRekapKegiatanBulanan = await this.prismaService.rekapKegiatanBulanan.findMany({
      where: {
        mahasiswaId: mahasiswaId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // console.log(allRekapKegiatanBulanan);
    const bulan = tanggalbener.getMonth() + 1
    const tahun = tanggalbener.getFullYear()

    const rekapKegiatanBulanan = await this.prismaService.rekapKegiatanBulanan.findFirst({
      where: {
        tanggalAwal: {
          gte: new Date(tahun, bulan - 1, 1),
          lte: new Date(tahun, bulan, 1)
        },
        mahasiswaId: mahasiswaId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // console.log(rekapKegiatanBulanan);

    if (rekapKegiatanBulanan) {
      //update rekap kegiatan bulanan tipe kegiatan volume dan durasi
      const rekapTipeKegiatan = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
        where: {
          rekapId: rekapKegiatanBulanan.rekapId,
          tipeKegiatanId: createKegiatanHarian.tipeKegiatan.tipeKegiatanId
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      if (rekapTipeKegiatan) {
        const rekapTipeKegiatanUpdated = await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
          where: {
            rekapTipeId: rekapTipeKegiatan.rekapTipeId
          },
          data: {
            target: rekapTipeKegiatan.target + createKegiatanHarian.volume,
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      } else {
        const namaTipeKegiatan = await this.prismaService.tipeKegiatan.findFirst({
          where: {
            tipeKegiatanId: data.tipeKegiatanId
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });

        await this.prismaService.rekapKegiatanBulananTipeKegiatan.create({
          data: {
            target: createKegiatanHarian.volume,
            uraian: namaTipeKegiatan.nama,
            tipeKegiatan: {
              connect: {
                tipeKegiatanId: createKegiatanHarian.tipeKegiatan.tipeKegiatanId
              }
            },
            rekapKegiatan: {
              connect: {
                rekapId: rekapKegiatanBulanan.rekapId
              }
            }
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      }
    }else{
      const createKegiatanBulanan = await this.prismaService.rekapKegiatanBulanan.create({
        data: {
          tanggalAkhir:  tanggalbener,
          tanggalAwal:  tanggal,
          mahasiswaId: mahasiswaId
        }
      })
      const namaTipeKegiatan = await this.prismaService.tipeKegiatan.findFirst({
        where: {
          tipeKegiatanId: data.tipeKegiatanId
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      await this.prismaService.rekapKegiatanBulananTipeKegiatan.create({
        data: {
          target: createKegiatanHarian.volume,
          uraian: namaTipeKegiatan.nama,
          tipeKegiatan: {
            connect: {
              tipeKegiatanId: createKegiatanHarian.tipeKegiatan.tipeKegiatanId
            }
          },
          rekapKegiatan: {
            connect: {
              rekapId: createKegiatanBulanan.rekapId
            }
          }
        }
      })
      
    }

    return {
      status: "success",
      message: "Kegiatan Harian Berhasil Ditambahkan",
      data: data
    }
  }

  async findAllKegiatanHarianBy(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'KegiatanHarian')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data kegiatan harian');
    }

    let daftarKegiatanHarian = [];

    // Cek apakah mahasiswaId adalah array atau string dan konversi menjadi array
    const mahasiswaIds = typeof params.mahasiswaId === 'string' ? params.mahasiswaId.split(',').map(id => Number(id)) : [Number(params.mahasiswaId)];
    const page = parseInt(params.page) || 1;
    const pageSize = params.pageSize ? parseInt(params.pageSize) : undefined;

    // console.log("data masuk backend: ",params);

    const [kegiatanHarian, totalRecord]  = await this.prismaService.$transaction([
      this.prismaService.kegiatanHarian.findMany({
      where: {
        AND: [accessibleBy(ability).KegiatanHarian],
        mahasiswa: {
          nim: params.nim,
          mahasiswaId: {
            in : mahasiswaIds
          }
        },
        tanggal: params.tanggal.toString() === '' ? undefined : new Date(params.tanggal),
        tipeKegiatan: {
          nama: {
            contains: params.namaTipeKegiatan
          }
        },
        statusPenyelesaian: parseInt(params.statusPenyelesaian) || undefined,
        pemberiTugas: {
          contains: params.pemberiTugas
        },
        tim: {
          contains: params.tim
        }
      },
      skip: pageSize ? (page - 1) * pageSize : undefined,
      take: pageSize,
      include: {
        tipeKegiatan: true
      },
      orderBy: {
        tanggal: 'desc'
      },
      }),
    this.prismaService.kegiatanHarian.count({  where: {
        AND: [accessibleBy(ability).KegiatanHarian],
        mahasiswa: {
          nim: params.nim,
          mahasiswaId: {
            in : mahasiswaIds
          }
        },
        tanggal: params.tanggal.toString() === '' ? undefined : new Date(params.tanggal),
        tipeKegiatan: {
          nama: {
            contains: params.namaTipeKegiatan
          }
        },
        statusPenyelesaian: parseInt(params.statusPenyelesaian) || undefined,
        pemberiTugas: {
          contains: params.pemberiTugas
        },
        tim: {
          contains: params.tim
        }
      }, }),
  ]);


    // console.log(kegiatanHarian);

    daftarKegiatanHarian = kegiatanHarian.map((kegiatan) => {
      return {
        kegiatanId: kegiatan.kegiatanId,
        mahasiswaId: kegiatan.mahasiswaId,
        tanggal: kegiatan.tanggal,
        deskripsi: kegiatan.deskripsi,
        volume: kegiatan.volume,
        durasi: kegiatan.durasi,
        pemberiTugas: kegiatan.pemberiTugas,
        tim: kegiatan.tim,
        statusPenyelesaian: kegiatan.statusPenyelesaian,
        isFinal: kegiatan.isFinal,
        tipeKegiatanId: kegiatan.tipeKegiatan.tipeKegiatanId,
        nama: kegiatan.tipeKegiatan.nama,
        satuan: kegiatan.tipeKegiatan.satuan,
        createdAt: kegiatan.createdAt,
        updatedAt: kegiatan.updatedAt
      }
    });

    return {
      status: 'success',
      message: 'Kegiatan Harian Berhasil Diambil',
      data: daftarKegiatanHarian,
      totalRecord
    }
  }

  async updateKegiatanHarian(
    kegiatanHarianId: number,
    updateKegiatanHarianDto: UpdateKegiatanHarianDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'KegiatanHarian')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data kegiatan harian');
    }

    await this.prismaService.kegiatanHarian.findFirstOrThrow({
      where: {
        kegiatanId: kegiatanHarianId,
        AND: [accessibleBy(ability).KegiatanHarian]
      }
    }).catch(() => {
      throw new ForbiddenException('Kegiatan Harian tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    let tanggal = new Date(updateKegiatanHarianDto.tanggal);
    const offsettanggal = tanggal.getTimezoneOffset();
    const tanggalbener = new Date(tanggal.setTime(tanggal.getTime() + (-offsettanggal) * 60 * 1000));
    const tanggalBaruKegiatanHarian = tanggalbener;

    const mahasiswa = await this.prismaService.user.findFirst({
      where: {
        mahasiswa: {
          userId: parseInt(payload['id'].toString())
        }
      },
      select: {
        mahasiswa: true
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    let kegiatanHarian;

    // get kegiatan harian yang akan diupdate
    const kegiatanHarianYangAkanDiupdate = await this.prismaService.kegiatanHarian.findFirst({
      where: {
        kegiatanId: kegiatanHarianId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // ambil data kegiatan harian yang akan diupdate
    const tanggalLamaKegiatanHarian = kegiatanHarianYangAkanDiupdate.tanggal;

    // get rekap kegiatan bulanan lama dan baru
    const rekapKegiatanLama = await this.prismaService.rekapKegiatanBulanan.findFirst({
      where: {
        tanggalAkhir: {
          gte: tanggalLamaKegiatanHarian
        },
        tanggalAwal: {
          lte: tanggalLamaKegiatanHarian
        },
        mahasiswaId: parseInt(mahasiswa.mahasiswa.mahasiswaId.toString())
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const rekapKegiatanBaru = await this.prismaService.rekapKegiatanBulanan.findFirst({
      where: {
        tanggalAkhir: {
          gte: tanggalBaruKegiatanHarian
        },
        tanggalAwal: {
          lte: tanggalBaruKegiatanHarian
        },
        mahasiswaId: parseInt(mahasiswa.mahasiswa.mahasiswaId.toString())
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (rekapKegiatanLama !== null && rekapKegiatanBaru !== null) {
      if (rekapKegiatanLama.rekapId === rekapKegiatanBaru.rekapId) {
        // get rekap tipe kegiatan lama
        const rekapTipeKegiatanLama = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
          where: {
            rekapId: rekapKegiatanLama.rekapId,
            tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });

        // dapatkan volume rekap tipe kegiatan yang baru
        const volumeRekapTipeKegiatanBaru = rekapTipeKegiatanLama.target - kegiatanHarianYangAkanDiupdate.volume + updateKegiatanHarianDto.volume;

        // dapatkan realisasi rekap tipe kegiatan yang baru, jika realisasi tidak 0
        if (rekapTipeKegiatanLama.realisasi !== 0) {
          const realisasiRekapTipeKegiatanBaru = volumeRekapTipeKegiatanBaru / rekapTipeKegiatanLama.realisasi * 100;

          // console.log(kegiatanHarianYangAkanDiupdate.kegiatanId, 'kegiatanHarianYangAkanDiupdate kegiatanId,', rekapTipeKegiatanLama.rekapTipeId, "rekap tipe id nya");

          // update target rekap tipe kegiatan lama
          await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
            where: {
              rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
            },
            data: {
              target: Math.round(volumeRekapTipeKegiatanBaru),
              realisasi: Math.round(realisasiRekapTipeKegiatanBaru)
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });
        } else {
          // update target rekap tipe kegiatan lama tanpa realisasi
          await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
            where: {
              rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
            },
            data: {
              target: Math.round(volumeRekapTipeKegiatanBaru)
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });
        }

        // update kegiatan harian
        kegiatanHarian = await this.prismaService.kegiatanHarian.update({
          where: {
            kegiatanId: kegiatanHarianId
          },
          data: {
            tanggal: tanggalBaruKegiatanHarian,
            deskripsi: updateKegiatanHarianDto.deskripsi,
            volume: updateKegiatanHarianDto.volume,
            durasi: updateKegiatanHarianDto.durasi,
            pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
            tim: updateKegiatanHarianDto.tim,
            statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
            tipeKegiatan: {
              connect: {
                tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
              }
            }
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      } else if (rekapKegiatanLama !== rekapKegiatanBaru) {
        // get rekap tipe kegiatan lama
        const rekapTipeKegiatanLama = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
          where: {
            rekapId: rekapKegiatanLama.rekapId,
            tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });

        // kurangkan target rekap tipe kegiatan lama dengan volume kegiatan harian yang akan diupdate
        const volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap = rekapTipeKegiatanLama.target - kegiatanHarianYangAkanDiupdate.volume;

        // jika hasilnya 0, hapus rekap tipe kegiatan lama
        if (volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap === 0) {
          await this.prismaService.rekapKegiatanBulananTipeKegiatan.delete({
            where: {
              rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });
        } else {
          // jika tidak, update target rekap tipe kegiatan lama
          await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
            where: {
              rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
            },
            data: {
              target: volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });
        }

        // cek apakah di rekap yang baru sudah ada rekap tipe kegiatan yang sama
        const rekapTipeKegiatanBaru = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
          where: {
            rekapId: rekapKegiatanBaru.rekapId,
            tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });

        // jika tidak, buat rekap tipe kegiatan baru
        if (!rekapTipeKegiatanBaru) {
          const namaTipeKegiatan = await this.prismaService.tipeKegiatan.findFirst({
            where: {
              tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });

          await this.prismaService.rekapKegiatanBulananTipeKegiatan.create({
            data: {
              target: updateKegiatanHarianDto.volume,
              uraian: namaTipeKegiatan.nama,
              tipeKegiatan: {
                connect: {
                  tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
                }
              },
              rekapKegiatan: {
                connect: {
                  rekapId: rekapKegiatanBaru.rekapId
                }
              }
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });

          // update kegiatan harian
          kegiatanHarian = await this.prismaService.kegiatanHarian.update({
            where: {
              kegiatanId: kegiatanHarianId
            },
            data: {
              tanggal: tanggalBaruKegiatanHarian,
              deskripsi: updateKegiatanHarianDto.deskripsi,
              volume: updateKegiatanHarianDto.volume,
              durasi: updateKegiatanHarianDto.durasi,
              pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
              tim: updateKegiatanHarianDto.tim,
              statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
              tipeKegiatan: {
                connect: {
                  tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
                }
              }
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });
        } else {
          // jika ada, update target rekap tipe kegiatan baru
          const volumeRekapTipeKegiatanBaru = rekapTipeKegiatanBaru.target + updateKegiatanHarianDto.volume;

          // dapatkan realisasi rekap tipe kegiatan baru, jika realisasi tidak 0
          if (rekapTipeKegiatanBaru.realisasi !== 0) {
            const realisasiRekapTipeKegiatanBaru = volumeRekapTipeKegiatanBaru / rekapTipeKegiatanBaru.realisasi * 100;

            await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
              where: {
                rekapTipeId: rekapTipeKegiatanBaru.rekapTipeId
              },
              data: {
                target: volumeRekapTipeKegiatanBaru,
                realisasi: realisasiRekapTipeKegiatanBaru
              }
            }).finally(() => {
              this.prismaService.$disconnect();
            });
          } else {
            // update target rekap tipe kegiatan baru tanpa realisasi
            await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
              where: {
                rekapTipeId: rekapTipeKegiatanBaru.rekapTipeId
              },
              data: {
                target: volumeRekapTipeKegiatanBaru
              }
            }).finally(() => {
              this.prismaService.$disconnect();
            });
          }

          // update kegiatan harian
          kegiatanHarian = await this.prismaService.kegiatanHarian.update({
            where: {
              kegiatanId: kegiatanHarianId
            },
            data: {
              tanggal: tanggalBaruKegiatanHarian,
              deskripsi: updateKegiatanHarianDto.deskripsi,
              volume: updateKegiatanHarianDto.volume,
              durasi: updateKegiatanHarianDto.durasi,
              pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
              tim: updateKegiatanHarianDto.tim,
              statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
              tipeKegiatan: {
                connect: {
                  tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
                }
              }
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });

          return {
            status: 'success',
            message: 'Kegiatan Harian Berhasil Diupdate',
            data: kegiatanHarian
          }
        }
      }
    } else if (rekapKegiatanLama !== null || rekapKegiatanBaru !== null) {
      if (rekapKegiatanLama === null) {
        // get rekap tipe kegiatan baru
        const rekapTipeKegiatanBaru = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
          where: {
            rekapId: rekapKegiatanBaru.rekapId,
            tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });

        // cek apakah di rekap yang baru sudah ada rekap tipe kegiatan yang sama
        if (!rekapTipeKegiatanBaru) {
          const namaTipeKegiatan = await this.prismaService.tipeKegiatan.findFirst({
            where: {
              tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });

          await this.prismaService.rekapKegiatanBulananTipeKegiatan.create({
            data: {
              target: updateKegiatanHarianDto.volume,
              uraian: namaTipeKegiatan.nama,
              tipeKegiatan: {
                connect: {
                  tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
                }
              },
              rekapKegiatan: {
                connect: {
                  rekapId: rekapKegiatanBaru.rekapId
                }
              }
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });

          // update kegiatan harian
          kegiatanHarian = await this.prismaService.kegiatanHarian.update({
            where: {
              kegiatanId: kegiatanHarianId
            },
            data: {
              tanggal: tanggalBaruKegiatanHarian,
              deskripsi: updateKegiatanHarianDto.deskripsi,
              volume: updateKegiatanHarianDto.volume,
              durasi: updateKegiatanHarianDto.durasi,
              pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
              tim: updateKegiatanHarianDto.tim,
              statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
              tipeKegiatan: {
                connect: {
                  tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
                }
              }
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });
        } else {
          // jika ada, update target rekap tipe kegiatan baru
          const volumeRekapTipeKegiatanBaru = rekapTipeKegiatanBaru.target + updateKegiatanHarianDto.volume;

          // dapatkan realisasi rekap tipe kegiatan baru, jika realisasi tidak 0
          if (rekapTipeKegiatanBaru.realisasi !== 0) {
            const realisasiRekapTipeKegiatanBaru = volumeRekapTipeKegiatanBaru / rekapTipeKegiatanBaru.realisasi * 100;

            await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
              where: {
                rekapTipeId: rekapTipeKegiatanBaru.rekapTipeId
              },
              data: {
                target: volumeRekapTipeKegiatanBaru,
                realisasi: realisasiRekapTipeKegiatanBaru
              }
            }).finally(() => {
              this.prismaService.$disconnect();
            });
          } else {
            // update target rekap tipe kegiatan baru tanpa realisasi
            await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
              where: {
                rekapTipeId: rekapTipeKegiatanBaru.rekapTipeId
              },
              data: {
                target: volumeRekapTipeKegiatanBaru
              }
            }).finally(() => {
              this.prismaService.$disconnect();
            });
          }

          // update kegiatan harian
          kegiatanHarian = await this.prismaService.kegiatanHarian.update({
            where: {
              kegiatanId: kegiatanHarianId
            },
            data: {
              tanggal: tanggalBaruKegiatanHarian,
              deskripsi: updateKegiatanHarianDto.deskripsi,
              volume: updateKegiatanHarianDto.volume,
              durasi: updateKegiatanHarianDto.durasi,
              pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
              tim: updateKegiatanHarianDto.tim,
              statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
              tipeKegiatan: {
                connect: {
                  tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
                }
              }
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });

          return {
            status: 'success',
            message: 'Kegiatan Harian Berhasil Diupdate',
            data: kegiatanHarian
          }
        }
      } else if (rekapKegiatanBaru === null) {
        // get rekap tipe kegiatan lama
        const rekapTipeKegiatanLama = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
          where: {
            rekapId: rekapKegiatanLama.rekapId,
            tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });

        // kurangkan target rekap tipe kegiatan lama dengan volume kegiatan harian yang akan diupdate
        const volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap = rekapTipeKegiatanLama.target - kegiatanHarianYangAkanDiupdate.volume;

        // jika hasilnya 0, hapus rekap tipe kegiatan lama
        if (volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap === 0) {
          await this.prismaService.rekapKegiatanBulananTipeKegiatan.delete({
            where: {
              rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });
        } else {
          // jika tidak, update target rekap tipe kegiatan lama
          await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
            where: {
              rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
            },
            data: {
              target: volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap
            }
          }).finally(() => {
            this.prismaService.$disconnect();
          });
        }

        // update kegiatan harian
        kegiatanHarian = await this.prismaService.kegiatanHarian.update({
          where: {
            kegiatanId: kegiatanHarianId
          },
          data: {
            tanggal: tanggalBaruKegiatanHarian,
            deskripsi: updateKegiatanHarianDto.deskripsi,
            volume: updateKegiatanHarianDto.volume,
            durasi: updateKegiatanHarianDto.durasi,
            pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
            tim: updateKegiatanHarianDto.tim,
            statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
            tipeKegiatan: {
              connect: {
                tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
              }
            }
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });

        return {
          status: 'success',
          message: 'Kegiatan Harian Berhasil Diupdate',
          data: kegiatanHarian
        }
      }
    } else if (rekapKegiatanLama === null && rekapKegiatanBaru === null) {
      // update kegiatan harian
      kegiatanHarian = await this.prismaService.kegiatanHarian.update({
        where: {
          kegiatanId: kegiatanHarianId
        },
        data: {
          tanggal: tanggalBaruKegiatanHarian,
          deskripsi: updateKegiatanHarianDto.deskripsi,
          volume: updateKegiatanHarianDto.volume,
          durasi: updateKegiatanHarianDto.durasi,
          pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
          tim: updateKegiatanHarianDto.tim,
          statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
          tipeKegiatan: {
            connect: {
              tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
            }
          }
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      return {
        status: 'success',
        message: 'Kegiatan Harian Berhasil Diupdate',
        data: kegiatanHarian
      }
    }

        
    // //MAKE NEW LOGIC FOR THIS ABOVE
    // if (rekapKegiatanBaru === null && rekapKegiatanLama !== null) {
    //   // get rekap tipe kegiatan lama
    //   const rekapTipeKegiatanLama = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
    //     where: {
    //       rekapId: rekapKegiatanLama.rekapId,
    //       tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //     }
    //   }).finally(() => {
    //     this.prismaService.$disconnect();
    //   });

    //   // kurangkan target rekap tipe kegiatan lama dengan volume kegiatan harian yang akan diupdate
    //   const volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap = rekapTipeKegiatanLama.target - kegiatanHarianYangAkanDiupdate.volume;

    //   // jika hasilnya 0, hapus rekap tipe kegiatan lama
    //   if (volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap === 0) {
    //     await this.prismaService.rekapKegiatanBulananTipeKegiatan.delete({
    //       where: {
    //         rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   } else {
    //     // jika tidak, update target rekap tipe kegiatan lama
    //     await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
    //       where: {
    //         rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
    //       },
    //       data: {
    //         target: volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   }

    //   // update kegiatan harian
    //   kegiatanHarian = await this.prismaService.kegiatanHarian.update({
    //     where: {
    //       kegiatanId: kegiatanHarianId
    //     },
    //     data: {
    //       tanggal: tanggalBaruKegiatanHarian,
    //       deskripsi: updateKegiatanHarianDto.deskripsi,
    //       volume: updateKegiatanHarianDto.volume,
    //       durasi: updateKegiatanHarianDto.durasi,
    //       pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
    //       statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
    //       tipeKegiatan: {
    //         connect: {
    //           tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
    //         }
    //       }
    //     }
    //   }).finally(() => {
    //     this.prismaService.$disconnect();
    //   });

    //   return {
    //     status: 'success',
    //     message: 'Kegiatan Harian Berhasil Diupdate',
    //     data: kegiatanHarian
    //   }
    // }

    // // jika kegiatan harian berada pada periode rekap kegiatan bulanan yang berbeda
    // if (rekapKegiatanLama.rekapId !== rekapKegiatanBaru.rekapId && rekapKegiatanLama !== null) {
    //   // get rekap tipe kegiatan lama
    //   const rekapTipeKegiatanLama = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
    //     where: {
    //       rekapId: rekapKegiatanLama.rekapId,
    //       tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //     }
    //   }).finally(() => {
    //     this.prismaService.$disconnect();
    //   });

    //   // kurangkan target rekap tipe kegiatan lama dengan volume kegiatan harian yang akan diupdate
    //   const volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap = rekapTipeKegiatanLama.target - kegiatanHarianYangAkanDiupdate.volume;

    //   // jika hasilnya 0, hapus rekap tipe kegiatan lama
    //   if (volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap === 0) {
    //     await this.prismaService.rekapKegiatanBulananTipeKegiatan.delete({
    //       where: {
    //         rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   } else {
    //     // jika tidak, update target rekap tipe kegiatan lama
    //     await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
    //       where: {
    //         rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
    //       },
    //       data: {
    //         target: volumeRekapTipeKegiatanLamaDikurangiVolumeKegiatanHarianPindahRekap
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   }

    //   // cek apakah di rekap yang baru sudah ada rekap tipe kegiatan yang sama
    //   const rekapTipeKegiatanBaru = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
    //     where: {
    //       rekapId: rekapKegiatanBaru.rekapId,
    //       tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //     }
    //   }).finally(() => {
    //     this.prismaService.$disconnect();
    //   });

    //   // jika tidak, buat rekap tipe kegiatan baru
    //   if (!rekapTipeKegiatanBaru) {
    //     const namaTipeKegiatan = await this.prismaService.tipeKegiatan.findFirst({
    //       where: {
    //         tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });

    //     await this.prismaService.rekapKegiatanBulananTipeKegiatan.create({
    //       data: {
    //         target: updateKegiatanHarianDto.volume,
    //         uraian: namaTipeKegiatan.nama,
    //         tipeKegiatan: {
    //           connect: {
    //             tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //           }
    //         },
    //         rekapKegiatan: {
    //           connect: {
    //             rekapId: rekapKegiatanBaru.rekapId
    //           }
    //         }
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });

    //     // update kegiatan harian
    //     kegiatanHarian = await this.prismaService.kegiatanHarian.update({
    //       where: {
    //         kegiatanId: kegiatanHarianId
    //       },
    //       data: {
    //         tanggal: tanggalBaruKegiatanHarian,
    //         deskripsi: updateKegiatanHarianDto.deskripsi,
    //         volume: updateKegiatanHarianDto.volume,
    //         durasi: updateKegiatanHarianDto.durasi,
    //         pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
    //         statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
    //         tipeKegiatan: {
    //           connect: {
    //             tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
    //           }
    //         }
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   } else {
    //     // jika ada, update target rekap tipe kegiatan baru
    //     const volumeRekapTipeKegiatanBaru = rekapTipeKegiatanBaru.target + updateKegiatanHarianDto.volume;

    //     // dapatkan realisasi rekap tipe kegiatan baru, jika realisasi tidak 0
    //     if (rekapTipeKegiatanBaru.realisasi !== 0) {
    //       const realisasiRekapTipeKegiatanBaru = volumeRekapTipeKegiatanBaru / rekapTipeKegiatanBaru.realisasi * 100;

    //       await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
    //         where: {
    //           rekapTipeId: rekapTipeKegiatanBaru.rekapTipeId
    //         },
    //         data: {
    //           target: volumeRekapTipeKegiatanBaru,
    //           realisasi: realisasiRekapTipeKegiatanBaru
    //         }
    //       }).finally(() => {
    //         this.prismaService.$disconnect();
    //       });
    //     } else {
    //       // update target rekap tipe kegiatan baru tanpa realisasi
    //       await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
    //         where: {
    //           rekapTipeId: rekapTipeKegiatanBaru.rekapTipeId
    //         },
    //         data: {
    //           target: volumeRekapTipeKegiatanBaru
    //         }
    //       }).finally(() => {
    //         this.prismaService.$disconnect();
    //       });
    //     }

    //     // update kegiatan harian
    //     kegiatanHarian = await this.prismaService.kegiatanHarian.update({
    //       where: {
    //         kegiatanId: kegiatanHarianId
    //       },
    //       data: {
    //         tanggal: tanggalBaruKegiatanHarian,
    //         deskripsi: updateKegiatanHarianDto.deskripsi,
    //         volume: updateKegiatanHarianDto.volume,
    //         durasi: updateKegiatanHarianDto.durasi,
    //         pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
    //         statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
    //         tipeKegiatan: {
    //           connect: {
    //             tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
    //           }
    //         }
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   }
    // } else if(rekapKegiatanLama !== null) {
    //   // jika berada di rekap yang sama, update target rekap tipe kegiatan lama
    //   const rekapTipeKegiatanLama = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
    //     where: {
    //       rekapId: rekapKegiatanLama.rekapId,
    //       tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //     }
    //   }).finally(() => {
    //     this.prismaService.$disconnect();
    //   });

    //   // dapatkan volume rekap tipe kegiatan yang baru
    //   const volumeRekapTipeKegiatanBaru = rekapTipeKegiatanLama.target - kegiatanHarianYangAkanDiupdate.volume + updateKegiatanHarianDto.volume;

    //   // dapatkan realisasi rekap tipe kegiatan yang baru, jika realisasi tidak 0
    //   if (rekapTipeKegiatanLama.realisasi !== 0) {
    //     const realisasiRekapTipeKegiatanBaru = volumeRekapTipeKegiatanBaru / rekapTipeKegiatanLama.realisasi * 100;

    //     // update target rekap tipe kegiatan lama
    //     await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
    //       where: {
    //         rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
    //       },
    //       data: {
    //         target: volumeRekapTipeKegiatanBaru,
    //         realisasi: realisasiRekapTipeKegiatanBaru
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   } else {
    //     // update target rekap tipe kegiatan lama tanpa realisasi
    //     await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
    //       where: {
    //         rekapTipeId: rekapTipeKegiatanLama.rekapTipeId
    //       },
    //       data: {
    //         target: volumeRekapTipeKegiatanBaru
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   }

    //   // update kegiatan harian
    //   kegiatanHarian = await this.prismaService.kegiatanHarian.update({
    //     where: {
    //       kegiatanId: kegiatanHarianId
    //     },
    //     data: {
    //       tanggal: tanggalBaruKegiatanHarian,
    //       deskripsi: updateKegiatanHarianDto.deskripsi,
    //       volume: updateKegiatanHarianDto.volume,
    //       durasi: updateKegiatanHarianDto.durasi,
    //       pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
    //       statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
    //       tipeKegiatan: {
    //         connect: {
    //           tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
    //         }
    //       }
    //     }
    //   }).finally(() => {
    //     this.prismaService.$disconnect();
    //   });
    // } else {
    //   // jika tidak ada rekap kegiatan bulanan lama maka masukkan ke rekap kegiatan bulanan yang baru
    //   const rekapTipeKegiatanBaru = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
    //     where: {
    //       rekapId: rekapKegiatanBaru.rekapId,
    //       tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //     }
    //   }).finally(() => {
    //     this.prismaService.$disconnect();
    //   });

    //   // jika tidak, buat rekap tipe kegiatan baru
    //   if (!rekapTipeKegiatanBaru) {
    //     const namaTipeKegiatan = await this.prismaService.tipeKegiatan.findFirst({
    //       where: {
    //         tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });

    //     await this.prismaService.rekapKegiatanBulananTipeKegiatan.create({
    //       data: {
    //         target: updateKegiatanHarianDto.volume,
    //         uraian: namaTipeKegiatan.nama,
    //         tipeKegiatan: {
    //           connect: {
    //             tipeKegiatanId: kegiatanHarianYangAkanDiupdate.tipeKegiatanId
    //           }
    //         },
    //         rekapKegiatan: {
    //           connect: {
    //             rekapId: rekapKegiatanBaru.rekapId
    //           }
    //         }
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });

    //     // update kegiatan harian
    //     kegiatanHarian = await this.prismaService.kegiatanHarian.update({
    //       where: {
    //         kegiatanId: kegiatanHarianId
    //       },
    //       data: {
    //         tanggal: tanggalBaruKegiatanHarian,
    //         deskripsi: updateKegiatanHarianDto.deskripsi,
    //         volume: updateKegiatanHarianDto.volume,
    //         durasi: updateKegiatanHarianDto.durasi,
    //         pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
    //         statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
    //         tipeKegiatan: {
    //           connect: {
    //             tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
    //           }
    //         }
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   } else {
    //     // jika ada, update target rekap tipe kegiatan baru
    //     const volumeRekapTipeKegiatanBaru = rekapTipeKegiatanBaru.target + updateKegiatanHarianDto.volume;

    //     // dapatkan realisasi rekap tipe kegiatan baru, jika realisasi tidak 0
    //     if (rekapTipeKegiatanBaru.realisasi !== 0) {
    //       const realisasiRekapTipeKegiatanBaru = volumeRekapTipeKegiatanBaru / rekapTipeKegiatanBaru.realisasi * 100;

    //       await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
    //         where: {
    //           rekapTipeId: rekapTipeKegiatanBaru.rekapTipeId
    //         },
    //         data: {
    //           target: volumeRekapTipeKegiatanBaru,
    //           realisasi: realisasiRekapTipeKegiatanBaru
    //         }
    //       }).finally(() => {
    //         this.prismaService.$disconnect();
    //       });
    //     } else {
    //       // update target rekap tipe kegiatan baru tanpa realisasi
    //       await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
    //         where: {
    //           rekapTipeId: rekapTipeKegiatanBaru.rekapTipeId
    //         },
    //         data: {
    //           target: volumeRekapTipeKegiatanBaru
    //         }
    //       }).finally(() => {
    //         this.prismaService.$disconnect();
    //       });
    //     }

    //     // update kegiatan harian
    //     kegiatanHarian = await this.prismaService.kegiatanHarian.update({
    //       where: {
    //         kegiatanId: kegiatanHarianId
    //       },
    //       data: {
    //         tanggal: tanggalBaruKegiatanHarian,
    //         deskripsi: updateKegiatanHarianDto.deskripsi,
    //         volume: updateKegiatanHarianDto.volume,
    //         durasi: updateKegiatanHarianDto.durasi,
    //         pemberiTugas: updateKegiatanHarianDto.pemberiTugas,
    //         statusPenyelesaian: updateKegiatanHarianDto.statusPenyelesaian,
    //         tipeKegiatan: {
    //           connect: {
    //             tipeKegiatanId: updateKegiatanHarianDto.tipeKegiatan.tipeKegiatanId
    //           }
    //         }
    //       }
    //     }).finally(() => {
    //       this.prismaService.$disconnect();
    //     });
    //   }
    // }

    return {
      status: 'success',
      message: 'Kegiatan Harian Berhasil Diupdate',
      data: kegiatanHarian
    }
  }

  async konfirmasiKegiatanHarian(
    kegiatanHarian: [{
      kegiatanHarianId: number
    }]
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'KegiatanHarian')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data kegiatan harian');
    }

    const data = await Promise.all(
      kegiatanHarian.map(async (kegiatan) => {
        return await this.prismaService.kegiatanHarian.update({
          where: {
            kegiatanId: parseInt(kegiatan.kegiatanHarianId.toString())
          },
          data: {
            isFinal: true
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      })
    );

    return {
      status: 'success',
      message: 'Kegiatan Harian Berhasil Dikonfirmasi',
      data: data
    }
  }

  async remove(kegiatanHarianId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'KegiatanHarian')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus data kegiatan harian');
    }

    await this.prismaService.kegiatanHarian.findFirstOrThrow({
      where: {
        kegiatanId: kegiatanHarianId,
        AND: [accessibleBy(ability).KegiatanHarian]
      }
    }).catch(() => {
      throw new ForbiddenException('Kegiatan Harian tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // get kegiatan harian yang akan dihapus
    const kegiatanHarian = await this.prismaService.kegiatanHarian.findFirst({
      where: {
        kegiatanId: kegiatanHarianId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // console.log(kegiatanHarian);

    // get rekap kegiatan bulanan dari kegiatan harian
    const rekapKegiatanDariKegiatanHarian = await this.prismaService.rekapKegiatanBulanan.findFirst({
      where: {
        tanggalAkhir: {
          gte: kegiatanHarian.tanggal
        },
        tanggalAwal: {
          lte: kegiatanHarian.tanggal
        },
        mahasiswaId: kegiatanHarian.mahasiswaId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    // console.log(rekapKegiatanDariKegiatanHarian);

    // jika ada, kurangkan target rekap tipe kegiatan
    if (rekapKegiatanDariKegiatanHarian) {
      const kegiatanHarianDenganTipeKegiatan = await this.prismaService.kegiatanHarian.findMany({
        where: {
          tipeKegiatanId: kegiatanHarian.tipeKegiatanId,
          NOT: {
            kegiatanId: kegiatanHarianId
          }
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      // console.log(rekapKegiatanDariKegiatanHarian.rekapId, "console log ketika hapus cek apakah ada rekap kegiatan");
      // console.log(kegiatanHarian.tipeKegiatanId, "console log ketika hapus cek tipe kegiatan");

      const rekapTipeKegiatan = await this.prismaService.rekapKegiatanBulananTipeKegiatan.findFirst({
        where: {
          rekapId: rekapKegiatanDariKegiatanHarian.rekapId,
          tipeKegiatanId: kegiatanHarian.tipeKegiatanId
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      // console.log(rekapTipeKegiatan, "console log ketika hapus cek apakah ada rekap tipe kegiatan");

      // console.log(kegiatanHarianId, "console log ketika hapus cek kegiatan harian id,", rekapTipeKegiatan.rekapTipeId, "Rekap tipe id nya");

      const rekapTipeKegiatanUpdated = await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
        where: {
          rekapTipeId: rekapTipeKegiatan.rekapTipeId
        },
        data: {
          target: rekapTipeKegiatan.target - kegiatanHarian.volume
        }
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      // update realisasi rekap tipe kegiatan
      if (rekapTipeKegiatan.realisasi !== 0) {
        const realisasiRekapTipeKegiatanUpdated = rekapTipeKegiatanUpdated.target / rekapTipeKegiatan.realisasi * 100;

        await this.prismaService.rekapKegiatanBulananTipeKegiatan.update({
          where: {
            rekapTipeId: rekapTipeKegiatan.rekapTipeId
          },
          data: {
            realisasi: Math.round(realisasiRekapTipeKegiatanUpdated)
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      }

      // jika target rekap tipe kegiatan menjadi 0, hapus rekap tipe kegiatan
      if (rekapTipeKegiatanUpdated.target === 0) {
        await this.prismaService.rekapKegiatanBulananTipeKegiatan.delete({
          where: {
            rekapTipeId: rekapTipeKegiatan.rekapTipeId
          }
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      }

    }

    const deletedKegiatanHarian = await this.prismaService.kegiatanHarian.delete({
      where: {
        kegiatanId: kegiatanHarianId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Kegiatan Harian Berhasil Dihapus',
      data: deletedKegiatanHarian
    }
  }
}
