import { accessibleBy } from '@casl/prisma';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Satker } from '../satker/dto/satker/satker.entity';
import { PrismaService } from '../prisma/prisma.service';
import { parse } from 'path';
import { Mahasiswa } from 'src/mahasiswa/dto/mahasiswa.entity';

import { Prisma, PrismaClient } from '@prisma/client';
@Injectable()
export class PemilihanPenempatanService {
  private prismaClient = new PrismaClient()
  private kota = ['KAB. ADM KEP. SERIBU', 'KOTA ADM. JAKARTA PUSAT', 'KOTA ADM. JAKARTA BARAT', 'KOTA ADM. JAKARTA SELATAN', 'KOTA ADM. JAKARTA TIMUR', 'KOTA DEPOK', 'KOTA BEKASI', 'KOTA BOGOR']

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async findPilihanPenempatanByMahasiswaId(params) {

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    if (!year) {
      return {
        status: 'success',
        data: {
          pilihanSatker: [],
          satker: []
        }
      }
    }
    
    const pilihanSatker = await this.prisma.pilihanSatker.findMany({
      where: {
        mahasiswa: {
          mahasiswaId: Number(params.mahasiswaId),
          user: {
            tahunAjaranId: year.tahunAjaranId
          },
        }
      },
      include: {
        satker: true
      }
    })

    const satker = await this.prisma.satker.findMany({
      where: {
        satkerId: {
          in: pilihanSatker.map((value) => value.satkerId)
        }
      },
      select: {
        nama: true,
        kodeSatker: true,
        provinsi: {
          select: {
            nama: true
          }
        },
        kapasitasSatkerTahunAjaran: {
          where: {
            tahunAjaranId: year.tahunAjaranId
          },
          select: {
            kapasitas: true,
            tahunAjaranId: true
          },
        },
        penempatan: {
          where: {
            mahasiswa: {
              user: {
                tahunAjaranId: year.tahunAjaranId
              }
            }
          }
        },
        pilihanSatker: {
          include: {
            satker: true
          }
        }
      },
    });

    return {
      status: 'success',
      data: {
        satker: satker.map((value, index) => (
          {
            ...value,
            dialokasikan: value.penempatan.length,
            kapasitasSatkerTahunAjaran: value.kapasitasSatkerTahunAjaran[0].kapasitas,
            pilihan1: value.pilihanSatker.filter((value) => value.prioritas === 1).length,
            pilihan2: value.pilihanSatker.filter((value) => value.prioritas === 2).length,
            nama1: value.pilihanSatker.find((value) => value.prioritas === 1)?.satker.nama,
            nama2: value.pilihanSatker.find((value) => value.prioritas === 2)?.satker.nama,
            isSubmit: value.pilihanSatker.length >= 0 ? true : false,
            status: value.penempatan.length > value.kapasitasSatkerTahunAjaran[0].kapasitas ? 'Melebihi' : (value.penempatan.length < value.kapasitasSatkerTahunAjaran[0].kapasitas ? 'Tersedia' : (value.penempatan.length <= 0 ? 'Tersedia' : 'Terpenuhi')),
            index: index
          })
        ),
        pilihanSatker,
        isSubmit: pilihanSatker.length > 0 ? true : false
      }
    }
  }

  async hitungJarakPenempatanByMahasiswa(mahasiswaId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);

    // const findKabOrKota = await this.prisma.kabupatenKota.findMany({
    //   where: {
    //     nama: {
    //       in: this.kota
    //     }
    //   }
    // })


    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

   

    if (payloadJwt.role !== 'admin provinsi') {
      if (!year) {
        return {
          data: []
        }
      }

      const mahasiswa = await this.prisma.mahasiswa.findFirst({
        where: {
          mahasiswaId: mahasiswaId,
          user: {
            tahunAjaranId: year.tahunAjaranId
          }
        }
      })

      const pilihanSatker = await this.prisma.pilihanSatker.findMany({
        where: {
          mahasiswaId: mahasiswaId
        },
        select: {
          satkerId: true
        },
        orderBy: {
          prioritas: 'desc'
        }
      })

      const satkers = await this.prisma.satker.findMany({
        where: {
          kapasitasSatkerTahunAjaran: {
            some: {
              tahunAjaranId: year.tahunAjaranId
            }
          }
        },
        include: {
          provinsi: {
            select: {
              nama: true
            }
          }
        },
        // take: 5
      })

      const satkerWithDistance = satkers.map((satker, index) => ({
        ...satker,
        distance: this.haversine(
          mahasiswa.lat!,
          mahasiswa.lng!,
          satker.latitude!,
          satker.longitude!
        ),
      }));


      const pilihanSatkerIds = new Set(pilihanSatker.map((value) => value.satkerId))

      // Ambil hanya satker yang tidak dipilih dan urutkan berdasarkan jarak
      const otheSatker = satkerWithDistance
      .filter(s => !pilihanSatkerIds.has(s.satkerId))  //satker tidak ada di pilihanSatkerIds
      .sort((a, b) => a.distance - b.distance)        // Urutkan berdasarkan jarak terdekat
      .slice(0, 4);                                   // Ambil hanya 5 satker terdekat

      // Ambil semua satker yang dipilih
      const selectedSatker = satkerWithDistance.filter(s => pilihanSatkerIds.has(s.satkerId));

      // Gabungkan satker yang dipilih dengan 5 satker yang tidak dipilih yang terdekat
      const listPilihanSatker = [...selectedSatker, ...otheSatker];

      const additionalSatkers = await this.prisma.satker.findMany({
        where: {
          kodeSatker: {
            in: ["3603", "3671", "3674", "3171", "3172", "3173","3174", "3175", "3276", "3216", "3275", "3201", "3271", "3101"]  // satker tambahan
          }
        },
        include: {
          provinsi: {
            select: {
              nama: true
            }
          }
        }
      });

      // Gabungkan additionalSatkers ke listPilihanSatker yang sudah ada
      const finalListPilihanSatker = [
        ...listPilihanSatker,
        ...additionalSatkers
      ];

      // Hapus duplikasi berdasarkan satkerId dan urutkan berdasarkan index
      const uniqueFinalListPilihanSatker = finalListPilihanSatker
        .filter((value, index, self) =>
          index === self.findIndex((item) => item.satkerId === value.satkerId) // Menghindari duplikasi
        )
        .map((value, index) => ({ ...value, index: index }));

      return satkerWithDistance.length > 0 ? {
        data: {
          listJarakTerdekat: [...selectedSatker, ...otheSatker]
            .sort((a, b) => a.distance - b.distance),
          listPilihanSatker: uniqueFinalListPilihanSatker
        }
      } : {
        data: []
      };

    }

    

    if (!year) {
      return {
        data: []
      }
    }

    const mahasiswa = await this.prisma.mahasiswa.findFirst({
      where: {
        mahasiswaId: mahasiswaId,
        user: {
          tahunAjaranId: year.tahunAjaranId
        }
      }
    })

    const findAdminProvinsi = await this.prisma.adminProvinsi.findFirst({
      where: {
        userId: payloadJwt.id
      }
    })

    const satkersOnKabKota = await this.prisma.satker.findMany({
      where: {
        kapasitasSatkerTahunAjaran: {
          some: {
            tahunAjaranId: year.tahunAjaranId
          }
        },
        povinsiId: findAdminProvinsi.provinsiId
      },
      include: {
        provinsi: {
          select: {
            nama: true
          }
        }
      }
    })

    const pilihanSatker = await this.prisma.penempatan.findMany({
      where: {
        satker: {
          povinsiId: findAdminProvinsi.provinsiId
        },
        mahasiswaId: mahasiswaId
      },
      select: {
        satkerId: true
      }
    })

    const satkers = await this.prisma.satker.findMany({
      where: {
        kapasitasSatkerTahunAjaran: {
          some: {
            tahunAjaranId: year.tahunAjaranId
          }
        },
        povinsiId: findAdminProvinsi.provinsiId
      },
      include: {
        provinsi: {
          select: {
            nama: true
          }
        }
      },
      // take: 5
    })

    const satkerWithDistance = satkers.map((satker, index) => ({
      ...satker,
      distance: this.haversine(
        mahasiswa.lat!,
        mahasiswa.lng!,
        satker.latitude!,
        satker.longitude!
      ),
      index: index
    }));


    const pilihanSatkerIds = new Set(pilihanSatker.map((value) => value.satkerId))
    const selectedSatker = satkerWithDistance
    .filter(s => pilihanSatkerIds.has(s.satkerId))
    .sort((a, b) => a.distance - b.distance)
    // console.log("selected satker", selectedSatker)

    // Ambil hanya satker yang tidak dipilih dan urutkan berdasarkan jarak
    const otheSatker = satkerWithDistance
    .filter(s => !pilihanSatkerIds.has(s.satkerId))  //satker tidak ada di pilihanSatkerIds
    .sort((a, b) => a.distance - b.distance)        // Urutkan berdasarkan jarak terdekat
    .slice(0, 6);                                   // Ambil hanya 5 satker terdekat
    // console.log("othesatker", otheSatker)

    const listPilihanSatker = [...selectedSatker, ...otheSatker]

    return satkerWithDistance.length > 0 ? {
      data: {
        listJarakTerdekat: [...selectedSatker, ...otheSatker]
          .sort((a, b) => a.distance - b.distance),
        listPilihanSatker: [
          ...listPilihanSatker,
          ...satkersOnKabKota
        ]
          .filter((value, index, self) =>
            index === self.findIndex((item) => item.satkerId === value.satkerId)
          )
          .map((value, index) => ({ ...value, index: index }))
      }
    } : {
      data: []
    };

  }

  async findPilihanPenempatan(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const pageSatker = parseInt(params.pageSatker) || 1;
    const pageSizeSatker = params.pageSizeSatker ? parseInt(params.pageSizeSatker) : undefined;
    const pageMahasiswa = parseInt(params.pageMahasiswa) || 1;
    const pageSizeMahasiswa = params.pageSizeMahasiswa ? parseInt(params.pageSizeMahasiswa) : undefined;

    const searchSatker = params.searchSatker?.trim() ?? '';
    const searchProvinsiSatker = params.searchProvinsiSatker?.trim() ?? '';
    const searchStatusSatker = params.searchStatusSatker?.trim() ?? '';

    const searchNamaMahasiswa = params.searchNamaMahasiswa?.trim() ?? '';
    const searchProdi = params.searchProdi?.trim() ?? '';
    const searchPenempatan = params.searchPenempatan?.trim() ?? '';
    const searchPilihan1 = params.searchPilihan1?.trim() ?? '';
    const searchProvPilihan1 = params.searchProvPilihan1?.trim() ?? '';
    const searchPilihan2 = params.searchPilihan2?.trim() ?? '';
    const searchProvPilihan2 = params.searchProvPilihan2?.trim() ?? '';
    const searchStatusMahasiswa = params.searchStatusMahasiswa?.trim() ?? '';
    // const searchSatkerMahasiswa = params.searchSatkerMahasiswa?.trim() ?? '';
    // const searchTahunAjaran = params.tahunAjaran?.trim();

    const filtersSatker: Prisma.SatkerWhereInput = {
      ...(searchSatker && {
        nama: {
          contains: searchSatker,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(searchStatusSatker && {
        nama: {
          contains: searchStatusSatker,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(searchProvinsiSatker && {
        provinsi: {
          nama: {
            contains: searchProvinsiSatker,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
      }),
      // ...(year && {
      //   kapasitasSatkerTahunAjaran: {
      //     some: {
      //       tahunAjaranId: year.tahunAjaranId,
      //     },
      //   },
      // }),
    };

    const 
    whereClauseSatker: Prisma.SatkerWhereInput = {
      AND: [filtersSatker],
    };    

    const filtersMahasiswa: Prisma.MahasiswaWhereInput = {
      ...(searchNamaMahasiswa && {
        nama: {
          contains: searchNamaMahasiswa,
          mode: 'insensitive' as Prisma.QueryMode
        }
      }),
      ...(searchProdi && {
        prodi: {
          contains: searchProdi,
          mode: 'insensitive' as Prisma.QueryMode
        }
      }),
      ...(searchPenempatan && {
        penempatan: {
          some: {
            satker: {
              nama: {
                contains: searchPenempatan,
                mode: 'insensitive' as Prisma.QueryMode,
              }
            }
          }
        }
      }),
      ...(searchStatusMahasiswa && {
        statusPenempatan: {
          contains: searchStatusMahasiswa,
          mode: 'insensitive' as const,
        },
      }),
      ...(searchPilihan1 && {
        pilihanSatker: {
          some: {
            prioritas: 1,
            satker: {
              nama: {
                contains: searchPilihan1,
                mode: 'insensitive' as const,
              },
            },
          },
        },
      }),
      ...(searchProvPilihan1 && {
        pilihanSatker: {
          some: {
            prioritas: 1,
            satker: {
              provinsi: {
                nama: {
                  contains: searchProvPilihan1,
                  mode: 'insensitive' as const,
                },
              },
            },
          },
        },
      }),
      ...(searchPilihan2 && {
        pilihanSatker: {
          some: {
            prioritas: 2,
            satker: {
              nama: {
                contains: searchPilihan2,
                mode: 'insensitive' as const,
              },
            },
          },
        },
      }),
      ...(searchProvPilihan2 && {
        pilihanSatker: {
          some: {
            prioritas: 2,
            satker: {
              provinsi: {
                nama: {
                  contains: searchProvPilihan2,
                  mode: 'insensitive' as const,
                },
              },
            },
          },
        },
      }),
      ...(year && {
        user: {
          tahunAjaranId: year.tahunAjaranId,
        },
      }),
    };

    const whereClauseMahasiswa: Prisma.MahasiswaWhereInput = {
      AND: [filtersMahasiswa],
    };   
  
    function getStatusPenempatan(penempatan: number, kapasitas?: number): string {
      const finalKapasitas = kapasitas ?? 0;

      if (finalKapasitas === 0) {
        return penempatan > 0 ? 'Melebihi' : 'Terpenuhi';
      }

      if (penempatan > finalKapasitas) {
        return 'Melebihi';
      }

      if (penempatan === finalKapasitas) {
        return 'Terpenuhi';
      }

      return 'Tersedia';
    }

    // non admin provinsi
    if (payloadJwt.role !== 'admin provinsi') {
      if (!year) {
        return {
          status: 'success',
          data: {
            mahasiswa: [],
            satker: []
          }
        }
      }

      const pilihanSatker = await this.prisma.pilihanSatker.findMany({
        where: {
          mahasiswa: {
            user: {
              tahunAjaranId: year.tahunAjaranId
            }
          }
        }
      })

     const [satker, totalSatker] = await Promise.all([
        this.prisma.satker.findMany({
          where: whereClauseSatker,
          orderBy:{ kodeSatker : 'asc'},
          select: {
            nama: true,
            kodeSatker: true,
            provinsi: {
              select: {
                nama: true
              }
            },
            kapasitasSatkerTahunAjaran: {
              where: {
                tahunAjaranId: year.tahunAjaranId
              },
              select: {
                kapasitas: true,
                tahunAjaranId: true
              },
            },
            penempatan: {
              where: {
                mahasiswa: {
                  user: {
                    tahunAjaranId: year.tahunAjaranId
                  }
                }
              }
            },
            pilihanSatker: {
              where: {
                satkerId: {
                  in: pilihanSatker.map(value => value.satkerId)
                }
              }
            }
          },
          skip: pageSizeSatker ? (pageSatker - 1) * pageSizeSatker : undefined,
          take: pageSizeSatker,
        }),
          this.prisma.satker.count({
          where: whereClauseSatker,
        }),
      ]);

      const [mahasiswa, totalMahasiswa] = await Promise.all([
        this.prisma.mahasiswa.findMany({
          where: {
            ...whereClauseMahasiswa,
            pilihanSatker: {
              some: {
                mahasiswaId: {
                  in: pilihanSatker.map(({ mahasiswaId }) => mahasiswaId),
                }
              },
            },
          },
          orderBy:{ nim : 'asc'},
          include: {
            pilihanSatker: {
              include: {
                satker: {
                  select: {
                    satkerId: true,
                    nama: true,
                    provinsi: {
                      select: { provinsiId: true, nama: true },
                    },
                  },
                },
              },
            },
            penempatan: {
              include: {
                satker: {
                  select: {
                    satkerId: true,
                    nama: true
                  },
                }
              }
            }
          },
          skip: pageSizeMahasiswa ? (pageMahasiswa - 1) * pageSizeMahasiswa : undefined,
          take: pageSizeMahasiswa,
        }),
        this.prisma.mahasiswa.count({
          where: {
            ...whereClauseMahasiswa,
            pilihanSatker: {
              some: {
                mahasiswaId: {
                  in: pilihanSatker.map(({ mahasiswaId }) => mahasiswaId),
                },
              },
            },
          },
        })
      ]);

      const data = {
        mahasiswa: mahasiswa.map((value, index) => ({
          ...value,
          penempatan: value.penempatan?.[0] ?? null,  // Tambahkan fallback jika tidak ada penempatan
          pilihan1: value.pilihanSatker.filter((v) => v.prioritas === 1)[0] ?? null,  // Fallback null jika tidak ada pilihan1
          pilihan2: value.pilihanSatker.filter((v) => v.prioritas === 2)[0] ?? null,  // Fallback null jika tidak ada pilihan2
          index: index + 1 + ((pageMahasiswa - 1) * (pageSizeMahasiswa || 0)),
        })),
        totalMahasiswa,
        currentPageMahasiswa: pageMahasiswa,
        pageSizeMahasiswa,

        satker: satker.map((value, index) => ({
          ...value,
          dialokasikan: value.penempatan.length,
          kapasitasSatkerTahunAjaran: value.kapasitasSatkerTahunAjaran[0]?.kapasitas ?? 0,  // Fallback 0 jika tidak ada kapasitas
          pilihan1: value.pilihanSatker.filter((v) => v.prioritas === 1).length,
          pilihan2: value.pilihanSatker.filter((v) => v.prioritas === 2).length,
          status: getStatusPenempatan(
            value.penempatan.length,
            value.kapasitasSatkerTahunAjaran[0]?.kapasitas
          ),
          index: index + 1 + ((pageSatker - 1) * (pageSizeSatker || 0)),
        })),
        totalSatker,
        currentPageSatker: pageSatker,
        pageSizeSatker,
      };


      // console.log("backend admin data mahasiswa awal", data.mahasiswa[0], "backend admin data mahasiswa akhir");
      // console.log("backend admin data satker awal", data.satker[0], "backend admin data satker akhir");
      // console.log("Calling API with pageMahasiswa:", pageMahasiswa);


      return {
        status: 'success',
        data
      };
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

    const pilihanPenempatan = await this.prisma.penempatan.findMany({
      where: {
        satker: {
          povinsiId: findAdminProvinsi.provinsiId
        },
        mahasiswa: {
          user: {
            tahunAjaranId: year.tahunAjaranId
          }
        }
      }
    })

    const satker = await this.prisma.satker.findMany({
      where: {
        ...whereClauseSatker, povinsiId: findAdminProvinsi.provinsiId
      },
      orderBy:{ kodeSatker : 'asc'},
      select: {
        nama: true,
        kodeSatker: true,
        provinsi: {
          select: {
            nama: true
          }
        },
        kapasitasSatkerTahunAjaran: {
          select: {
            kapasitas: true,
            tahunAjaranId: true
          },
          where: {
            tahunAjaranId: year.tahunAjaranId
          }
        },
        penempatan: {
          where: {
            mahasiswa: {
              user: {
                tahunAjaranId: year.tahunAjaranId
              }
            }
          }
        },
        pilihanSatker: true
      },
      skip: pageSizeSatker ? (pageSatker - 1) * pageSizeSatker : undefined,
      take: pageSizeSatker
    });

    const mahasiswa = await this.prisma.mahasiswa.findMany({
      where: {
        ...whereClauseMahasiswa,
        penempatan: {
          some: {
            mahasiswaId: {
              in: pilihanPenempatan.map(({ mahasiswaId }) => mahasiswaId),
            },
          },
        },
      },
      orderBy:{ nim : 'asc'},
      include: {
        penempatan: {
          include: {
            satker: {
              select: {
                satkerId: true,
                nama: true,
                provinsi: {
                  select: { provinsiId: true, nama: true },
                },
              },
            }
          }
        }
      },
      skip: pageSizeMahasiswa ? (pageMahasiswa - 1) * pageSizeMahasiswa : undefined,
      take: pageSizeMahasiswa
    });

    const data =  {
        mahasiswa: mahasiswa.map((value, index) => ({
            ...value,
            penempatan: value.penempatan[0],  // Jika penempatan tidak ada, set null
            index: index + 1 + ((pageMahasiswa - 1) * (pageSizeMahasiswa || 0)),
          })),
          totalMahasiswa: await this.prisma.mahasiswa.count({
            where: {
              ...whereClauseMahasiswa,
              penempatan: {
                some: {
                  mahasiswaId: {
                    in: pilihanPenempatan.map(({ mahasiswaId }) => mahasiswaId),
                },
              },
            },
          },
          }),
          currentPageMahasiswa: pageMahasiswa,
          pageSizeMahasiswa,

        satker: satker.map((value, index) => ({
            ...value,
            dialokasikan: value.penempatan.length,
            kapasitasSatkerTahunAjaran: value.kapasitasSatkerTahunAjaran[0]?.kapasitas ?? 0, // Tambahkan fallback 0 jika tidak ada kapasitas
            status: getStatusPenempatan(
              value.penempatan.length,
              value.kapasitasSatkerTahunAjaran[0]?.kapasitas
            ),
            index: index + 1 + ((pageSatker - 1) * (pageSizeSatker || 0)),
          })),
          totalSatker: await this.prisma.satker.count({
            where: {
              ...whereClauseSatker, povinsiId: findAdminProvinsi.provinsiId
            },
          }),
          currentPageSatker: pageSatker,
          pageSizeSatker,
      }

    // console.log("data mahasiswa", data.mahasiswa[1],"data mahasiswa end")
    // console.log("data satker", data.satker[1],"data satker end")
    return {
      status: 'success',
      data
    }
  }

  async findAllPemilihanPenempatanBy(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data pemilihan penempatan');
    }

    const data = await this.prisma.pilihanSatker.findMany({
      where: {
        satkerId: params.satkerId || undefined,
        mahasiswaId: params.mahasiswaId || undefined,
        AND: [accessibleBy(ability).PilihanSatker],
      },
      select: {
        pilihanSatkerId: true,
        status: true,
        prioritas: true,
        isActive: true,
        satker: {
          select: {
            nama: true,
            satkerId: true,
            provinsi: {
              select: {
                provinsiId: true,
                nama: true,
              }
            }
          },
        },
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
            mahasiswaId: true,
            alamat: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    let pilihanSatkerResponse = [];

    data.forEach((pilihanSatker) => {
      pilihanSatkerResponse.push({
        pilihanSatkerId: pilihanSatker.pilihanSatkerId,
        mahasiswaId: pilihanSatker.mahasiswa.mahasiswaId,
        satkerId: pilihanSatker.satker.satkerId,
        status: pilihanSatker.status,
        isActive: pilihanSatker.isActive,
        prioritas: pilihanSatker.prioritas,
        provinsiId: pilihanSatker.satker.provinsi.provinsiId,
        namaProvinsi: pilihanSatker.satker.provinsi.nama,
        namaSatker: pilihanSatker.satker.nama,
        namaMahasiswa: pilihanSatker.mahasiswa.nama,
        nim: pilihanSatker.mahasiswa.nim,
        alamat: pilihanSatker.mahasiswa.alamat,
        createdAt: pilihanSatker.createdAt,
        updatedAt: pilihanSatker.updatedAt,
      });
    });

    return {
      status: 'success',
      data: pilihanSatkerResponse
    }
  }

  async confirmPenempatan(mahasiswaId: number, payload: any) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);
    let status: string;


    if (payloadJwt.role !== 'admin provinsi') {
      const findPilihanSatker = await this.prisma.pilihanSatker.findMany({
        where: {
          mahasiswaId: mahasiswaId
        }
      })

      const checkSameSatker = findPilihanSatker.find((value) => value.satkerId === payload.satkerId)

      if (!checkSameSatker) {
        status = 'dialihkan'
        await this.prisma.pilihanSatker.updateMany({
          where: {
            mahasiswaId: mahasiswaId
          },
          data: {
            status: 'dialihkan'
          }
        })
      } else {
        status = 'disetujui'
        await this.prisma.pilihanSatker.update({
          where: {
            pilihanSatkerId: checkSameSatker.pilihanSatkerId
          },
          data: {
            status: 'disetujui'
          }
        })
        await this.prisma.pilihanSatker.updateMany({
          where: {
            pilihanSatkerId: {
              notIn: [checkSameSatker.pilihanSatkerId]
            }
          },
          data: {
            status: 'ditolak'
          }
        })
      }


      const penempatan = await this.prisma.penempatan.findFirst({
        where: {
          mahasiswaId: mahasiswaId
        }
      })

      if (!penempatan) {
        await this.prisma.penempatan.create({
          data: {
            satkerId: payload.satkerId,
            mahasiswaId: mahasiswaId
          }
        })
      } else {
        await this.prisma.penempatan.update({
          where: {
            id: penempatan.id
          },
          data: {
            satkerId: payload.satkerId
          }
        })
      }

      // console.info("Before updating mahasiswa:", mahasiswaId, payload.satkerId);

      const updatedMahasiswa = await this.prisma.mahasiswa.update({
        where: { mahasiswaId: mahasiswaId },
        data: {
          statusPenempatan: status,
          satkerId: payload.satkerId,  // Pastikan satkerId di mahasiswa diperbarui
        }
      });
  
      console.log("Mahasiswa updated:", updatedMahasiswa);

      // Mengembalikan respons yang lebih informatif
      return {
        message: 'Sukses memilih penempatan',
        data: {
          mahasiswaId: mahasiswaId,
          satkerId: payload.satkerId,
          statusPenempatan: status,
        }
      };

    } else  {

      const chechkStatusAkses = await this.prisma.accesAlokasiMagang.findFirst()
      if(chechkStatusAkses.status !== true){
        return {
          status: 'Gagal', 
          message: 'akses telah di tutup'
        }
      }
      const findPilihanSatker = await this.prisma.pilihanSatker.findMany({
        where: {
          mahasiswaId: mahasiswaId
        }
      })

      const checkSameSatker = findPilihanSatker.find((value) => value.satkerId === payload.satkerId)

      if (!checkSameSatker) {
        status = 'dialihkan'
        await this.prisma.pilihanSatker.updateMany({
          where: {
            mahasiswaId: mahasiswaId
          },
          data: {
            status: 'dialihkan'
          }
        })
      } else {
        status = 'disetujui'
        await this.prisma.pilihanSatker.update({
          where: {
            pilihanSatkerId: checkSameSatker.pilihanSatkerId
          },
          data: {
            status: 'disetujui'
          }
        })
        await this.prisma.pilihanSatker.updateMany({
          where: {
            pilihanSatkerId: {
              notIn: [checkSameSatker.pilihanSatkerId]
            }
          },
          data: {
            status: 'ditolak'
          }
        })
      }


      const penempatan = await this.prisma.penempatan.findFirst({
        where: {
          mahasiswaId: mahasiswaId
        }
      })

      if (!penempatan) {
        await this.prisma.penempatan.create({
          data: {
            satkerId: payload.satkerId,
            mahasiswaId: mahasiswaId
          }
        })
      } else {
        await this.prisma.penempatan.update({
          where: {
            id: penempatan.id
          },
          data: {
            satkerId: payload.satkerId
          }
        })
      }

      // await this.prisma.mahasiswa.update({
      //   where: { mahasiswaId: mahasiswaId },
      //   data: {
      //     statusPenempatan: 'dikonfirmasi',
      //     satkerId: payload.satkerId,
      //   }
      // })

      const updatedMahasiswaProv = await this.prisma.mahasiswa.update({
        where: { mahasiswaId: mahasiswaId },
        data: {
          statusPenempatan: 'dikonfirmasi',
          satkerId: payload.satkerId,  // Pastikan satkerId di mahasiswa diperbarui
        }
      });
  
      console.log("Mahasiswa updated:", updatedMahasiswaProv);

      return {
        message: 'Sukses memilih penempatan',
        data: {
          mahasiswaId: mahasiswaId,
          satkerId: payload.satkerId,
          statusPenempatan: 'dikonfirmasi'
        }
      };
    }

  }

  async bulkConfirmPenempatan(payload: any) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);
    let status: string;

    const isAdminProvinsi = payloadJwt.role === 'admin provinsi';
    const isAdmin = payloadJwt.role === 'admin';
    const mahasiswaIds = payload.mahasiswa;
    // console.log("payload", payload)

    if (isAdminProvinsi || isAdmin) {
      const findPilihanSatker = await this.prisma.pilihanSatker.findMany({
        where: {
          mahasiswaId: { in: mahasiswaIds }
        }
      });

      const checkSameSatker = findPilihanSatker.find((value) =>
        payload.satkerId.includes(value.satkerId)
      );

      if (!checkSameSatker) {
        status = 'dialihkan';
        await this.prisma.pilihanSatker.updateMany({
          where: {
            mahasiswaId: { in: mahasiswaIds }
          },
          data: { status: 'dialihkan' }
        });
      } else {
        status = 'disetujui';
        await this.prisma.pilihanSatker.update({
          where: { pilihanSatkerId: checkSameSatker.pilihanSatkerId },
          data: { status: 'disetujui' }
        });
        await this.prisma.pilihanSatker.updateMany({
          where: {
            pilihanSatkerId: { notIn: [checkSameSatker.pilihanSatkerId] }
          },
          data: { status: 'ditolak' }
        });
      }

     // Cek per mahasiswa, tidak pakai findFirst
      for (let i = 0; i < mahasiswaIds.length; i++) {
        const mahasiswaId = mahasiswaIds[i];
        const satkerId = payload.satkerId[i];

        const existingPenempatan = await this.prisma.penempatan.findFirst({
          where: { mahasiswaId }
        });

        if (!existingPenempatan) {
          await this.prisma.penempatan.create({
            data: { mahasiswaId, satkerId }
          });
        } else {
          await this.prisma.penempatan.update({
            where: { id: existingPenempatan.id },
            data: { satkerId }
          });
        }
      }

      // Update status mahasiswa sesuai pairing juga
      const mahasiswaUpdatePromises = mahasiswaIds.map((mahasiswaId, index) =>
        this.prisma.mahasiswa.update({
          where: { mahasiswaId },
          data: {
            statusPenempatan: status,
            satkerId: payload.satkerId[index],
          }
        })
      );

      await Promise.all(mahasiswaUpdatePromises);

      return {
        message: 'Sukses mengatur penempatan',
        data: {}
      };
    }

    return {
      message: 'Role tidak valid',
      data: {}
    };
  }


  async confirmPemilihanPenempatan(pilihanId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah status pemilihan penempatan');
    }

    await this.prisma.pilihanSatker.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).PilihanSatker],
        pilihanSatkerId: pilihanId
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah status pemilihan penempatan');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const confirmPilihan = await this.prisma.pilihanSatker.update({
      where: {
        pilihanSatkerId: pilihanId,
      },
      data: {
        status: 'Diterima',
        isActive: false
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    // ubah status pilihan lainnya menjadi 'Ditolak'
    await this.prisma.pilihanSatker.updateMany({
      where: {
        mahasiswaId: confirmPilihan.mahasiswaId,
        NOT: {
          pilihanSatkerId: confirmPilihan.pilihanSatkerId
        },
      },
      data: {
        status: 'Diterima pada pilihan lain',
        isActive: false
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    // connect mahasiswa dengan satker pilihan
    await this.prisma.mahasiswa.update({
      where: {
        mahasiswaId: confirmPilihan.mahasiswaId
      },
      data: {
        satker: {
          connect: {
            satkerId: confirmPilihan.satkerId
          }
        }
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Status Pemilihan Penempatan Berhasil Diubah',
    }
  }

  async cancelConfirmPemilihanPenempatan(pilihanId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah status pemilihan penempatan');
    }

    await this.prisma.pilihanSatker.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).PilihanSatker],
        pilihanSatkerId: pilihanId
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah status pemilihan penempatan');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.pilihanSatker.update({
      where: {
        pilihanSatkerId: pilihanId
      },
      data: {
        status: 'Ditolak',
        isActive: false
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Status Pemilihan Penempatan Berhasil Diubah',
    }
  }

  async createPemilihanPenempatan(
    mahasiswaId: number,
    pilihan: any
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan pemilihan penempatan');
    }

    const countMahasiswa = await this.prisma.pilihanSatker.count({
      where: {
        mahasiswaId: mahasiswaId
      }
    });

    if (countMahasiswa >= 2) {
      return {
        status: 'error',
        message: 'Anda sudah memilih 2 tempat, tidak bisa memilih lagi',
      };
    }

    const jumlahPilihanBaru = pilihan.satker.length;
    if (jumlahPilihanBaru > 2) {
      return {
        status: 'error',
        message: 'Total pilihan tidak boleh lebih dari 2',
      };
    }


    try {
      await Promise.all(
        pilihan.satker.map(async (value, index) => {
          return this.prisma.pilihanSatker.create({
            data: {
              mahasiswaId: mahasiswaId,
              satkerId: Number(value),
              status: "Menunggu",
              prioritas: index + 1,
              isActive: true,
            },
          });
        })
      );

      await this.prisma.mahasiswa.update({
        where: {
          mahasiswaId: mahasiswaId
        },
        data: {
          statusPenempatan: 'menunggu'
        }
      })

      return {
        status: 'success',
        message: 'Pemilihan Penempatan Berhasil Ditambahkan',
      };
    } catch (error) {
      console.error("Error inserting data:", error);
      return {
        status: 'error',
        message: 'Terjadi kesalahan saat menyimpan data',
      };
    }
  }

  async pindahPemilihanPenempatan(
    pilihanId: number,
    pilihan: Satker
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah pemilihan penempatan');
    }

    await this.prisma.pilihanSatker.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).PilihanSatker],
        pilihanSatkerId: pilihanId
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah pemilihan penempatan');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.pilihanSatker.update({
      where: {
        pilihanSatkerId: pilihanId
      },
      data: {
        satkerId: pilihan.satkerId,
        status: 'Menunggu',
        isActive: true
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Pemilihan Penempatan Berhasil Dipindahkan',
    }
  }

  async deletePemilihanPenempatan(pilihanId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'PilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus pemilihan penempatan');
    }

    await this.prisma.pilihanSatker.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).PilihanSatker],
        pilihanSatkerId: pilihanId
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus pemilihan penempatan');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.pilihanSatker.delete({
      where: {
        pilihanSatkerId: pilihanId
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Pemilihan Penempatan Berhasil Dihapus'
    }
  }

  async getPeriodePemilihanTempatMagang(
    params: {
      tahunAjaranId: number;
    }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PeriodePemilihanTempatMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data periode pemilihan tempat magang');
    }

    const periode = await this.prisma.periodePemilihanTempatMagang.findMany({
      where: {
        AND: [accessibleBy(ability).PeriodePemilihanTempatMagang],
        tahunAjaranId: params.tahunAjaranId || undefined
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Periode Berhasil Diambil',
      data: periode
    }
  }

  async createPeriodePemilihanTempatMagang(data: {
    tanggalMulai: Date;
    tanggalAkhir: Date;
    tahunAjaranId: number;
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PeriodePemilihanTempatMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan periode pemilihan tempat magang');
    }

    const periodePemilihanTempatMagang = await this.prisma.periodePemilihanTempatMagang.create({
      data: {
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalAkhir: new Date(data.tanggalAkhir),
        tahunAjaran: {
          connect: {
            tahunAjaranId: data.tahunAjaranId
          }
        }
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode Berhasil Ditambahkan',
      data: periodePemilihanTempatMagang
    }
  }

  async updatePeriodePemilihanTempatMagang(periodeId: number, data: {
    tanggalMulai: Date;
    tanggalAkhir: Date;
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PeriodePemilihanTempatMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah periode pemilihan tempat magang');
    }

    await this.prisma.periodePemilihanTempatMagang.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).PeriodePemilihanTempatMagang],
        periodePemilihanTempatMagangId: parseInt(periodeId.toString())
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah periode pemilihan tempat magang');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const periodePemilihanTempatMagang = await this.prisma.periodePemilihanTempatMagang.update({
      where: {
        periodePemilihanTempatMagangId: parseInt(periodeId.toString())
      },
      data: {
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalAkhir: new Date(data.tanggalAkhir)
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode Berhasil Diubah',
      data: periodePemilihanTempatMagang
    }
  }

  async deletePeriodePemilihanTempatMagang(periodeId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'PeriodePemilihanTempatMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus periode pemilihan tempat magang');
    }

    await this.prisma.periodePemilihanTempatMagang.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).PeriodePemilihanTempatMagang],
        periodePemilihanTempatMagangId: parseInt(periodeId.toString())
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus periode pemilihan tempat magang');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const periodePemilihanTempatMagang = await this.prisma.periodePemilihanTempatMagang.delete({
      where: {
        periodePemilihanTempatMagangId: parseInt(periodeId.toString())
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode Berhasil Dihapus',
      data: periodePemilihanTempatMagang
    }
  }

  async getPeriodeKonfirmasiPemilihanSatker(params: {
    tahunAjaranId: number;
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PeriodeKonfirmasiPemilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data periode konfirmasi pemilihan satker');
    }

    const periode = await this.prisma.periodeKonfirmasiPemilihanSatker.findMany({
      where: {
        AND: [accessibleBy(ability).PeriodeKonfirmasiPemilihanSatker],
        tahunAjaranId: params.tahunAjaranId || undefined
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Periode Berhasil Diambil',
      data: periode
    }
  }

  async createPeriodeKonfirmasiPemilihanSatker(data: {
    tanggalMulai: Date;
    tanggalAkhir: Date;
    tahunAjaranId: number;
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PeriodeKonfirmasiPemilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan periode konfirmasi pemilihan satker');
    }

    const periodeKonfirmasiPemilihanSatker = await this.prisma.periodeKonfirmasiPemilihanSatker.create({
      data: {
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalAkhir: new Date(data.tanggalAkhir),
        tahunAjaran: {
          connect: {
            tahunAjaranId: data.tahunAjaranId
          }
        }
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode Berhasil Ditambahkan',
      data: periodeKonfirmasiPemilihanSatker
    }
  }

  async updatePeriodeKonfirmasiPemilihanSatker(periodeId: number, data: {
    tanggalMulai: Date;
    tanggalAkhir: Date;
    tahunAjaranId: number;
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PeriodeKonfirmasiPemilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah periode konfirmasi pemilihan satker');
    }

    await this.prisma.periodeKonfirmasiPemilihanSatker.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).PeriodeKonfirmasiPemilihanSatker],
        periodeKonfirmasiPemilihanSatkerId: parseInt(periodeId.toString())
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah periode konfirmasi pemilihan satker');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const periodeKonfirmasiPemilihanSatker = await this.prisma.periodeKonfirmasiPemilihanSatker.update({
      where: {
        periodeKonfirmasiPemilihanSatkerId: parseInt(periodeId.toString())
      },
      data: {
        tanggalMulai: new Date(data.tanggalMulai),
        tanggalAkhir: new Date(data.tanggalAkhir),
        tahunAjaran: {
          connect: {
            tahunAjaranId: data.tahunAjaranId
          }
        }
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode Berhasil Diubah',
      data: periodeKonfirmasiPemilihanSatker
    }
  }

  async deletePeriodeKonfirmasiPemilihanSatker(periodeId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'PeriodeKonfirmasiPemilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus periode konfirmasi pemilihan satker');
    }

    await this.prisma.periodeKonfirmasiPemilihanSatker.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).PeriodeKonfirmasiPemilihanSatker],
        periodeKonfirmasiPemilihanSatkerId: parseInt(periodeId.toString())
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus periode konfirmasi pemilihan satker');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const periodeKonfirmasiPemilihanSatker = await this.prisma.periodeKonfirmasiPemilihanSatker.delete({
      where: {
        periodeKonfirmasiPemilihanSatkerId: parseInt(periodeId.toString())
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Periode Berhasil Dihapus',
      data: periodeKonfirmasiPemilihanSatker
    }
  }

  haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c
    const distanceFormatted = (parseFloat(distance.toFixed(2))).toFixed(2)
    return parseFloat(distanceFormatted);
  }



  // Note kode lama
  // for (let i = 0; i < pilihan.length; i++) {
  //   await this.prisma.pilihanSatker.create({
  //     data: {
  //       mahasiswaId: mahasiswaId,
  //       // mahasiswa: {
  //       //   connect: {
  //       //     mahasiswaId: mahasiswaId
  //       //   }
  //       // },
  //       satkerId: pilihan[i],
  //       status: 'Menunggu',
  //       prioritas: i + 1,
  //       isActive: true
  //     }
  //   }).finally(() => {
  //     this.prisma.$disconnect();
  //   });
  // }
}
