import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';
import { ADDRCONFIG } from 'dns';
import { Prisma } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Injectable()
export class DokumenTranslokService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request,
  ) { }


  // async chartFetching() {
  //   const year = await this.prismaService.tahunAjaran.findFirst({
  //     where: {
  //       isActive: true
  //     }
  //   });

  //   const dokumenTranslok = await this.prismaService.dokumenTranslok.findMany({
  //     where: {
  //       mahasiswa: {
  //         user: {
  //           tahunAjaranId: year.tahunAjaranId
  //         }
  //       }
  //     },
  //     include: {
  //       mahasiswa: {
  //         select: {
  //           mahasiswaId: true,
  //           nim: true,
  //           nama: true,
  //           namaRekening: true,
  //           nomorRekening: true,
  //           bank: true,
  //           satker: {
  //             select: {
  //               nama: true
  //             }
  //           }
  //         }
  //       },
  //     },
  //     orderBy: {
  //       createdAt: 'desc'
  //     }
  //   });

  //   // Daftar nama bulan dalam Bahasa Indonesia
  //   const bulanIndo = [
  //     "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  //     "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  //   ];

  //   const monthMap: Record<string, {
  //     label: string;
  //     disetujui: number;
  //     dikembalikan: number;
  //     menunggu: number;
  //     total: number;
  //   }> = {}

  //   for (const item of dokumenTranslok) {
  //     const date = new Date(item.createdAt);
  //     const monthIndex = date.getMonth(); // 0 - 11
  //     const label = bulanIndo[monthIndex];

  //     if (!monthMap[label]) {
  //       monthMap[label] = {
  //         label,
  //         disetujui: 0,
  //         dikembalikan: 0,
  //         menunggu: 0,
  //         total: 0
  //       };
  //     }

  //     const status = item.status?.toLowerCase();
  //     if (status === 'disetujui') {
  //       monthMap[label].disetujui += 1;
  //     } else if (status === 'dikembalikan') {
  //       monthMap[label].dikembalikan += 1;
  //     } else if (status === 'menunggu') {
  //       monthMap[label].menunggu += 1;
  //     }

  //     monthMap[label].total += 1;
  //   }

  //   const result = Object.values(monthMap).sort((a, b) => {
  //     return bulanIndo.indexOf(a.label) - bulanIndo.indexOf(b.label);
  //   });

  //   return result;
  // }


  async create(
    payload: any,
    fileDokumen: string
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);


    const bulan = payload.bulan; // dari frontend
    const [month, year] = bulan.split('-');
    const date = new Date(`${year}-${month}-01T00:00:00Z`);

    const dokumenTranslok = await this.prismaService.dokumenTranslok.create({
      data: {
        fileDokumenTranslok: fileDokumen,
        bulan: date,
        mahasiswaId: Number(payload.mahasiswaId)
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Dokumen Translok berhasil dibuat',
      data: dokumenTranslok
    }
  }

  async findAllDokumen( query ) {
    const year = await this.prismaService.tahunAjaran.findFirst({
      where: { isActive: true }
    });

    if (!year) {
      throw new Error('Tahun ajaran aktif tidak ditemukan');
    }
    const page = parseInt(query.page) || 1;
    const pageSize = query.pageSize ? parseInt(query.pageSize) : undefined;

   const filters: Prisma.DokumenTranslokWhereInput = {
      ...(query.searchNama && {
        mahasiswa: {
          nama: { contains: query.searchNama, mode: 'insensitive' as Prisma.QueryMode },
        },
      }),
      ...(query.searchKelas && {
        mahasiswa: {
          kelas: { contains: query.searchKelas, mode: 'insensitive' as Prisma.QueryMode },
        },
      }),
      ...(query.searchSatker && {
        mahasiswa : {
          satker: {
          nama: { contains: query.searchSatker, mode: 'insensitive' as Prisma.QueryMode },
        },
      }
      }),
      ...(query.searchStatus && {
        status: { equals: query.searchStatus },
      }),
    };

    const whereClause: Prisma.DokumenTranslokWhereInput = {
      AND: [filters],
    };

    const [dokumenTranslok, total] = await this.prismaService.$transaction([
      this.prismaService.dokumenTranslok.findMany({
      where: {
        ...whereClause,
        mahasiswa: {
          ...(query.mahasiswaId ? {
            mahasiswaId: parseInt(query.mahasiswaId.toString())
          } : {}),
          user: {
            tahunAjaranId: year.tahunAjaranId
          }
        }
      },
      skip: pageSize ? (page - 1) * pageSize : undefined,
      take: pageSize,
      include: {
        mahasiswa: {
          select: {
            mahasiswaId: true,
            nim: true,
            nama: true,
            kelas: true,
            bank: true,
            nomorRekening: true,
            namaRekening: true,
            statusRek: true,
            catatanRek: true,
            satker: { select: { nama: true } },
            presensi: { select: {tanggal : true}, orderBy: { tanggal: 'desc' } }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
      }),
      this.prismaService.dokumenTranslok.count( {
      where: {
          ...whereClause,
          mahasiswa: {
            ...(query.mahasiswaId ? {
              mahasiswaId: parseInt(query.mahasiswaId.toString())
            } : {}),
            user: {
              tahunAjaranId: year.tahunAjaranId
            }
          }
        },}),
    ]);


    const formatingDocument = dokumenTranslok.map((value: any, index) => {
      const bulanDokumen = new Date(value.bulan);
      const tahun = bulanDokumen.getFullYear();
      const bulan = bulanDokumen.getMonth(); // 0-based: Jan = 0

      // Filter presensi sesuai bulan & tahun dokumen
      const filteredPresensi = (value.mahasiswa.presensi || []).filter(presensi => {
        const tgl = new Date(presensi.tanggal);
        return tgl.getFullYear() === tahun && tgl.getMonth() === bulan;
      });

      const totalPresensiGabungan = filteredPresensi.length
      // console.info("total presensi", totalPresensiGabungan)

      return {
        index: index,
        id: value.id,
        mahasiswaId: value.mahasiswa.mahasiswaId,
        satker: value.mahasiswa.satker?.nama,
        nim: value.mahasiswa.nim,
        nama: value.mahasiswa.nama,
        kelas: value.mahasiswa.kelas,
        updateKe: value.updateKe,
        bank: value.mahasiswa.bank,
        nomorRekening: value.mahasiswa.nomorRekening,
        namaRekening: value.mahasiswa.namaRekening,
        bulan: value.bulan ? new Date(value.bulan).toISOString().split('T')[0] : null,
        update: value.update ? new Date(value.update).toISOString().split('T')[0] : null,
        dokumen: value.fileDokumenTranslok,
        status: value.status,
        catatan: value.catatan,
        statusRek: value.statusRek,
        catatanRek: value.catatanRek,
        totalPresensi: totalPresensiGabungan // ✅ dinamis berdasarkan bulan dokumen
      };
    });

  const filtered = query.searchBulan 
    ? formatingDocument.filter(item => new Date(item.bulan).getMonth() + 1 === Number(query.searchBulan)) 
    : formatingDocument;

    return {
      status: 'success',
      data: filtered,
      total
    };
  }


  async findAllDokumen2( 
    query: {
      mahasiswaId?: number;}
    ){
    const year = await this.prismaService.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const dokumenTranslok = await this.prismaService.dokumenTranslok.findMany({
      where: {
        mahasiswa: {
          mahasiswaId: query.mahasiswaId.toString() === '' ? undefined : parseInt(query.mahasiswaId.toString()),
          user: {
            tahunAjaranId: year.tahunAjaranId
          }
        }
      },
      include: {
        mahasiswa: {
          select: {
            mahasiswaId: true,
            nim: true,
            nama: true,
            namaRekening: true,
            nomorRekening: true,
            bank: true,
            satker: {
              select: {
                nama: true
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formatingDocument = dokumenTranslok.map((value: any, index) => ({
      index: index,
      id: value.id,
      mahasiswaId: value.mahasiswa.mahasiswaId,
      satker: value.mahasiswa.satker?.nama,
      nim: value.mahasiswa.nim,
      nama: value.mahasiswa.nama,
      bank: value.mahasiswa.bank,
      nomorRekening: value.mahasiswa.nomorRekening,
      namaRekening: value.mahasiswa.namaRekening,
      bulan: new Date(value.bulan).toISOString().split('T')[0],
      update: new Date(value.update).toISOString().split('T')[0],
      dokumen: value.fileDokumenTranslok,
      status: value.status,
      catatan: value.catatan,
      statusRek: value.statusRek,
      catatanRek: value.catatanRek
    }))

    return {
      status: 'success',
      data: formatingDocument
    }
  }

  async findDokumenBy(mahasiswaId: any) {
    const year = await this.prismaService.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const dokumenTranslok = await this.prismaService.dokumenTranslok.findMany({
      where: {
        mahasiswaId: mahasiswaId,
        mahasiswa: {
          user: {
            tahunAjaranId: year.tahunAjaranId
          }
        }
      },
      include: {
        mahasiswa: {
          select: {
            mahasiswaId: true,
            nim: true,
            nama: true,
            kelas: true,
            namaRekening: true,
            nomorRekening: true,
            bank: true,
            penempatan: {
              select: {
                satker: {
                  select: {
                    nama: true
                  }
                }
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formatingDocument = dokumenTranslok.map((value: any, index) => ({
      index: index,
      id: value.id,
      bulan: new Date(value.bulan).toISOString().split('T')[0],
      update: new Date(value.update).toISOString().split('T')[0],
      bank: value.mahasiswa.bank,
      kelas: value.mahasiswa.kelas,
      namaRekening: value.mahasiswa.namaRekening,
      nomorRekening: value.mahasiswa.nomorRekening,
      dokumen: value.fileDokumenTranslok,
      status: value.status,
      catatan: value.catatan
    }))

    return {
      status: 'success',
      data: formatingDocument
    }
  }

  async update(documentId: number, fileDocument: string) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const now = new Date();
    const offsetWIB = 7 * 60 * 60 * 1000; // 7 jam dalam milidetik
    const nowWIB = new Date(now.getTime() + offsetWIB);

    await this.prismaService.dokumenTranslok.findFirstOrThrow({
      where: {
        id: documentId
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate dokumen ini');
    })
    // .finally(() => {
    //   this.prismaService.$disconnect();
    // });

    const dokumenLama = await this.prismaService.dokumenTranslok.findUnique({
      where: { id: Number(documentId) },
      select: { updateKe: true }
    });

    const dokumenTranslok = await this.prismaService.dokumenTranslok.update({
      where: {
        id: Number(documentId)
      },
      data: {
        update: nowWIB,
        updateKe: dokumenLama.updateKe + 1, 
        status: "menunggu",
        fileDokumenTranslok: fileDocument,
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Dokumen Translok berhasil diupdate',
      data: dokumenTranslok
    }
  }

  async confirmData(mahasiswaId: number, payload: { id: number; status: string; catatan?: string }) {
    const dokumen = await this.prismaService.dokumenTranslok.findFirst({
      where: {
        mahasiswaId: mahasiswaId,
        id: payload.id,
      },
    });

    if (!dokumen) {
      throw new Error('Dokumen tidak ditemukan');
    }

    console.info("dokumen id", dokumen.id)

    const updated = await this.prismaService.dokumenTranslok.update({
      where: { id: dokumen.id },
      data: {
        status: payload.status,
        ...(payload.catatan && { catatan: payload.catatan }),
      },
    });

    return {
      status: 'success',
      message: `Dokumen berhasil ${payload.status === 'disetujui' ? 'disetujui' : 'ditolak'}`,
      data: updated,
    };
  }

  // async confirmData2(mahasiswaId: number, payload: { status: string; catatan?: string }) {
  //   const dokumen = await this.prismaService.dokumenTranslok.findFirst({
  //     where: { mahasiswaId },
  //   });

  //   if (!dokumen) {
  //     throw new Error('Dokumen tidak ditemukan');
  //   }

  //   const updated = await this.prismaService.dokumenTranslok.update({
  //     where: { id: dokumen.id },
  //     data: {
  //       statusRek: payload.status,
  //       ...(payload.catatan && { catatanRek: payload.catatan }),
  //     },
  //   });

  //   return {
  //     status: 'success',
  //     message: `Dokumen berhasil ${payload.status === 'disetujui' ? 'disetujui' : 'ditolak'}`,
  //     data: updated,
  //   };
  // }

  async confirmDataRek(mahasiswaId: number, payload: { status: string; catatan?: string }) {
    const tahunAjaranAktif = await this.prismaService.tahunAjaran.findFirst({
      where: {
        isActive: true,
      }
    });

    const updated = await this.prismaService.mahasiswa.update({
      where: { mahasiswaId: mahasiswaId}, 
      data: {
        statusRek: payload.status,
        ...(payload.catatan && { catatanRek: payload.catatan }),
      },
    });

    return {
      status: 'success',
      message: `Dokumen berhasil ${payload.status === 'disetujui' ? 'disetujui' : 'ditolak'}`,
      data: updated,
    };
  }

  async findDokumenStatusBy(mahasiswaId: any, status: string) {
    const dokumenTranslok = await this.prismaService.dokumenTranslok.findMany({
      where: {
        AND: [
          {
            mahasiswaId: mahasiswaId,
          },
          {
            status: status
          }
        ]
      }
    })

    if (!dokumenTranslok) {
      return {
        status: 'success',
        data: []
      }
    }

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const formatingDocument = dokumenTranslok.map((value: any, index: number) => {
      const date = new Date(value.bulan);
      const month = monthNames[date.getMonth()];

      return {
        index: index,
        id: value.id,
        bulan: `${month}`, // Format "Januari 2025"
        dokumen: value.fileDokumenTranslok,
        status: value.status,
        catatan: value.catatan
      };
    });

    // console.log(formatingDocument)
    return {
      status: 'success',
      data: formatingDocument
    }
  }

  async findRekeningStatusBy(mahasiswaId: any, statusRek: string) {
    // console.log("backend",mahasiswaId,statusRek)
    const rekening = await this.prismaService.mahasiswa.findMany({
      where: {
        AND: [
          {
            mahasiswaId: mahasiswaId,
          },
          {
            statusRek: statusRek
          }
        ]
      }
    })

    if (!rekening) {
      return {
        status: 'success',
        data: []
      }
    }

    const formatingDocument = rekening.map((value: any, index) => ({
      statusRek: value.statusRek,
      catatanRek: value.catatanRek
    }))

    console.log("format",formatingDocument)
    return {
      status: 'success',
      data: formatingDocument
    }
  }
}
