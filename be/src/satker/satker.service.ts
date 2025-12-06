import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSatkerDto } from '../satker/dto/satker/create-satker.dto';
import { UpdateSatkerDto } from '../satker/dto/satker/update-satker.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateSatkerBulkDto } from './dto/satker/create-satkerBulk.dto';
import { UpdateKapasitasSatkerTahunAjaranDto } from '../satker/dto/kapasitas-satker-tahun-ajaran/update-kapasitasSatkerTahunAjaran.dto';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class SatkerService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  // async findAllSatkerBy(params: {
  //   satkerId: number;
  //   kodeSatker: string;
  //   namaProvinsi: string;
  //   kodeProvinsi: string;
  //   namaKabupatenKota: string;
  //   kodeKabupatenKota: string;
  //   alamat: string;
  //   internalBps: string;
  // }) {
  //   const injectedToken = this.request.headers['authorization'].split(' ')[1];
  //   const payload = this.jwtService.decode(injectedToken);
  //   const ability = this.caslAbilityFactory.createForUser(payload);

  //   if (!ability.can('read', 'Satker')) {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk melihat satker');
  //   }

  //   const year = await this.prisma.tahunAjaran.findFirst({
  //     where: {
  //       isActive: true
  //     }
  //   })

  //   let whereCondition: any = {
  //     AND: [accessibleBy(ability).Satker],
  //     satkerId: parseInt(params.satkerId?.toString()) || undefined,
  //     kodeSatker: {
  //       contains: params.kodeSatker || undefined,
  //       mode: 'insensitive',
  //     },
  //     kabupatenKota: {
  //       nama: {
  //         contains: params.namaKabupatenKota || undefined,
  //       },
  //       kodeKabupatenKota: {
  //         contains: params.kodeKabupatenKota || undefined,
  //       },
  //     },
  //     alamat: {
  //       contains: params.alamat || undefined,
  //     },
  //   }

  //   if (params.kodeProvinsi !== '') {
  //     whereCondition = {
  //       ...whereCondition,
  //       provinsi: {
  //         nama: {
  //           contains: params.namaProvinsi || undefined,
  //         },
  //         kodeProvinsi: {
  //           contains: params.kodeProvinsi,
  //         },
  //       },
  //     }
  //   }

  //   if (
  //     params.internalBps === 'true' || params.internalBps === 'false'
  //   ) {
  //     whereCondition = {
  //       ...whereCondition,
  //       internalBPS: params.internalBps === 'true'
  //     }
  //   }

  //   if (year) {
  //     const daftarSatker = await this.prisma.satker.findMany({
  //       where: whereCondition,
  //       select: {
  //         satkerId: true,
  //         nama: true,
  //         alamat: true,
  //         email: true,
  //         latitude: true,
  //         longitude: true,
  //         internalBPS: true,
  //         kabupatenKota: {
  //           select: {
  //             nama: true,
  //             kodeKabupatenKota: true,
  //             kabupatenKotaId: true,
  //             provinsi: {
  //               select: {
  //                 nama: true,
  //                 kodeProvinsi: true,
  //                 provinsiId: true,
  //               },
  //             },
  //           },
  //         },
  //         kodeSatker: true,
  //         kapasitasSatkerTahunAjaran: {
  //           where: {
  //             tahunAjaran: {
  //               isActive: true
  //             }
  //           }
  //         },
  //         provinsi: {
  //           select: {
  //             nama: true,
  //             kodeProvinsi: true,
  //             provinsiId: true,
  //             adminProvinsi: {
  //               select: {
  //                 adminProvinsiId: true,
  //                 nama: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       orderBy: {
  //         nama: 'asc'
  //       }
  //     }).finally(() => {
  //       this.prisma.$disconnect();
  //     });

  //     let daftarSatkerResponse = [];

  //     daftarSatker.forEach((satker) => {
  //       daftarSatkerResponse.push({
  //         satkerId: satker.satkerId,
  //         nama: satker.nama,
  //         kodeSatker: satker.kodeSatker,
  //         email: satker.email,
  //         alamat: satker.alamat,
  //         latitude: satker.latitude,
  //         longitude: satker.longitude,
  //         kabupatenKotaId: satker.kabupatenKota.kabupatenKotaId,
  //         kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota,
  //         namaKabupatenKota: satker.kabupatenKota.nama,
  //         provinsiId: satker.kabupatenKota.provinsi.provinsiId,
  //         kodeProvinsi: satker.kabupatenKota.provinsi.kodeProvinsi,
  //         namaProvinsi: satker.kabupatenKota.provinsi.nama,
  //         kapasitas: satker.kapasitasSatkerTahunAjaran,
  //       });
  //     });

  //     return {
  //       status: 'success',
  //       message: 'Data Satuan Kerja Berhasil Diambil',
  //       data: daftarSatkerResponse,
  //     }
  //   } else {
  //     return {
  //       status: 'success',
  //       message: 'Data Satuan Kerja Berhasil Diambil',
  //       data: [],
  //     }
  //   }
  // }

  async findAllSatkerBy(params: any) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'Satker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat satker');
    }

    const page = parseInt(params.page) || 1;
    // const pageSize = Math.min(parseInt(params.pageSize));
    const pageSize = params.pageSize ? parseInt(params.pageSize) : undefined;

    const filters: Prisma.SatkerWhereInput = {
      ...(params.satkerId && {
        satkerId: Number(params.satkerId)
      }),
      ...(params.kodeSatker && {
        kodeSatker: { contains: params.kodeSatker, mode: 'insensitive' as Prisma.QueryMode }
      }),
      ...(params.searchSatker && {
        nama: { contains: params.searchSatker, mode: 'insensitive' as Prisma.QueryMode }
      }),
      ...(params.alamat && {
        alamat: { contains: params.alamat, mode: 'insensitive' as Prisma.QueryMode }
      }),
      ...(params.internalBps === 'true' || params.internalBps === 'false') && {
        internalBPS: params.internalBps === 'true'
      },
      ...(params.namaKabupatenKota || params.kodeKabupatenKota ? {
        kabupatenKota: {
          ...(params.namaKabupatenKota && {
            nama: { contains: params.namaKabupatenKota, mode: 'insensitive' as Prisma.QueryMode }
          }),
          ...(params.kodeKabupatenKota && {
            kodeKabupatenKota: { contains: params.kodeKabupatenKota }
          }),
        }
      } : {}),
      ...(params.namaProvinsi || params.kodeProvinsi || params.searchProvinsi ? {
        provinsi: {
          ...(params.searchProvinsi && {
            nama: { contains: params.searchProvinsi, mode: 'insensitive' as Prisma.QueryMode }
          }),
          ...(params.namaProvinsi && {
            nama: { contains: params.namaProvinsi, mode: 'insensitive' as Prisma.QueryMode }
          }),
          ...(params.kodeProvinsi && {
            kodeProvinsi: { contains: params.kodeProvinsi }
          })
        }
      } : {})
    };

    const whereClause: Prisma.SatkerWhereInput = {
      AND: [accessibleBy(ability).Satker, filters]
    };

    const [satkers, total] = await this.prisma.$transaction([
      this.prisma.satker.findMany({
        where: whereClause,
        skip: pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize,
        orderBy: { kodeSatker: 'asc' },
        select: {
          satkerId: true,
          nama: true,
          kodeSatker: true,
          email: true,
          alamat: true,
          latitude: true,
          longitude: true,
          internalBPS: true,
          kabupatenKota: {
            select: {
              kabupatenKotaId: true,
              nama: true,
              kodeKabupatenKota: true,
              provinsi: {
                select: {
                  provinsiId: true,
                  nama: true,
                  kodeProvinsi: true,
                }
              }
            }
          },
          provinsi: {
            select: {
              provinsiId: true,
              nama: true,
              kodeProvinsi: true,
              adminProvinsi: {
                select: {
                  adminProvinsiId: true,
                  nama: true
                }
              }
            }
          },
          kapasitasSatkerTahunAjaran: {
            where: { tahunAjaran: { isActive: true } }
          }
        }
      }),
      this.prisma.satker.count({ where: whereClause })
    ]);

    const daftarSatkerResponse = satkers.map(s => ({
      satkerId: s.satkerId,
      nama: s.nama,
      kodeSatker: s.kodeSatker,
      email: s.email,
      alamat: s.alamat,
      latitude: s.latitude,
      longitude: s.longitude,
      internalBPS: s.internalBPS,
      kapasitas: s.kapasitasSatkerTahunAjaran,
      kabupatenKotaId: s.kabupatenKota?.kabupatenKotaId,
      kodeKabupatenKota: s.kabupatenKota?.kodeKabupatenKota,
      namaKabupatenKota: s.kabupatenKota?.nama,
      provinsiId: s.kabupatenKota?.provinsi?.provinsiId,
      kodeProvinsi: s.kabupatenKota?.provinsi?.kodeProvinsi,
      namaProvinsi: s.kabupatenKota?.provinsi?.nama,
    }));

    return {
      status: 'success',
      message: 'Data Satuan Kerja Berhasil Diambil',
      data: daftarSatkerResponse,
      total
    };
  }


  // async createBulk(data: any[]) {
  //   const injectedToken = this.request.headers['authorization']?.split(' ')[1];
  //   const payload = this.jwtService.decode(injectedToken);
  //   const ability = this.caslAbilityFactory.createForUser(payload);
  
  //   if (!ability.can('create', 'Satker')) {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan satker');
  //   }
  
  //   const activeTahunAjaran = await this.prisma.tahunAjaran.findFirst({
  //     where: { isActive: true },
  //     select: { tahunAjaranId: true },
  //   });
  
  //   if (!activeTahunAjaran) {
  //     throw new Error('Tidak ada Tahun Ajaran aktif');
  //   }
  
  //   const satkerPromises = data.map(async (item, index) => {
  //     const {
  //       nama,
  //       email,
  //       alamat,
  //       povinsiId,
  //       kodeSatker,
  //       kabupatenKotaId,
  //       latitude,
  //       longitude,
  //       internalBPS,
  //     } = item;
  
  //     if (!nama || !email || !alamat || !povinsiId || !kabupatenKotaId || latitude === undefined || longitude === undefined ) {
  //       throw new Error(`Data tidak lengkap di baris ke-${index + 1}`);
  //     }

  //     if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
  //       throw new Error(`Latitude/Longitude tidak valid di baris ke-${index + 1}`);
  //     }
  
  //     return this.prisma.satker.create({
  //       data: {
  //         nama: nama.toString(),
  //         email: email.toString(),
  //         alamat: alamat.toString(),
  //         kodeSatker: String(kodeSatker),
  //         provinsi: {
  //           connect: { provinsiId: povinsiId},
  //         },
  //         kabupatenKota: {
  //           connect: {
  //             kabupatenKotaId: kabupatenKotaId
  //           },
  //         },
  //         internalBPS: Boolean(internalBPS),
  //         longitude: Number(longitude),
  //         latitude: Number(latitude),
  //         kapasitasSatkerTahunAjaran: {
  //           create: {
  //             tahunAjaran: {
  //               connect: {
  //                 tahunAjaranId: activeTahunAjaran.tahunAjaranId,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       select: {
  //         satkerId: true,
  //         nama: true,
  //         alamat: true,
  //         email: true,
  //         latitude: true,
  //         longitude: true,
  //         kabupatenKota: {
  //           select: {
  //             nama: true,
  //             provinsi: {
  //               select: {
  //                 nama: true,
  //               },
  //             },
  //           },
  //         },
  //         kodeSatker: true,
  //         kapasitasSatkerTahunAjaran: {
  //           select: {
  //             kapasitas: true,
  //             tahunAjaran: {
  //               select: {
  //                 tahun: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   });
  
  //   const satker = await Promise.all(satkerPromises);
  
  //   return {
  //     status: 'success',
  //     message: 'Data Satuan Kerja Berhasil Ditambahkan',
  //     data: satker,
  //   };
  // }

  async createBulk(data: any[]) {
    const injectedToken = this.request.headers['authorization']?.split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'Satker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan satker');
    }

    const activeTahunAjaran = await this.prisma.tahunAjaran.findFirst({
      where: { isActive: true },
      select: { tahunAjaranId: true },
    });

    if (!activeTahunAjaran) {
      throw new Error('Tidak ada Tahun Ajaran aktif');
    }

    const satkerPromises = data.map(async (item, index) => {
      const {
        nama,
        email,
        alamat,
        povinsiId,
        kodeSatker,
        kabupatenKotaId,
        kodeKabupatenKota,
        namaKabupatenKota,
        latitude,
        longitude,
        internalBPS,
      } = item;
      console.log(`BARIS ${index + 1}:`, item);

      if (!nama || !email || !alamat || !povinsiId || !kodeKabupatenKota || !kodeSatker || !namaKabupatenKota || latitude === undefined || longitude === undefined) {
        throw new Error(`Data tidak lengkap di baris ke-${index + 1}`);
      }

      if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
        throw new Error(`Latitude/Longitude tidak valid di baris ke-${index + 1}`);
      }

      // Upsert kabupaten/kota dulu
      const upsertKota = await this.prisma.kabupatenKota.upsert({
        where: { kodeKabupatenKota: String(kodeKabupatenKota) },
        create: {
          nama: namaKabupatenKota,
          kodeKabupatenKota: String(kodeKabupatenKota),
          provinsi: {
            connect: {
              provinsiId: povinsiId
            },
          },
        },
        update: {
          nama: namaKabupatenKota,
          provinsi: {
            connect: {
              provinsiId: povinsiId
            },
          },
        },
      });

      return this.prisma.satker.create({
        data: {
          nama: nama.toString(),
          email: email.toString(),
          alamat: alamat.toString(),
          kodeSatker: String(kodeSatker),
          provinsi: {
            connect: { provinsiId: povinsiId },
          },
          kabupatenKota: {
            connect: {
              kabupatenKotaId: upsertKota.kabupatenKotaId
            },
          },
          internalBPS: internalBPS !== undefined ? Boolean(internalBPS) : true,
          longitude: Number(longitude),
          latitude: Number(latitude),
          kapasitasSatkerTahunAjaran: {
            create: {
              tahunAjaran: {
                connect: {
                  tahunAjaranId: activeTahunAjaran.tahunAjaranId,
                },
              },
            },
          },
        },
        select: {
          satkerId: true,
          nama: true,
          alamat: true,
          email: true,
          latitude: true,
          longitude: true,
          kabupatenKota: {
            select: {
              nama: true,
              provinsi: {
                select: {
                  nama: true,
                },
              },
            },
          },
          kodeSatker: true,
          kapasitasSatkerTahunAjaran: {
            select: {
              kapasitas: true,
              tahunAjaran: {
                select: {
                  tahun: true,
                },
              },
            },
          },
        },
      });
    });

    const satker = await Promise.all(satkerPromises);

    return {
      status: 'success',
      message: 'Data Satuan Kerja Berhasil Ditambahkan',
      data: satker,
    };
  }

  
  

  async create(satker: CreateSatkerDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'Satker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan satker');
    }

    let satkerBaru;

    const upsertKota = await this.prisma.kabupatenKota.upsert({
      where: {
        kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota,
      },
      create: {
        nama: satker.kabupatenKota.namaKabupatenKota,
        kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota,
        provinsi: {
          connect: {
            kodeProvinsi: satker.provinsi.kodeProvinsi,
          },
        },
      },
      update: {
        nama: satker.kabupatenKota.namaKabupatenKota,
        kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota,
        provinsi: {
          connect: {
            kodeProvinsi: satker.provinsi.kodeProvinsi,
          },
        },
      }
    })

    satkerBaru = await this.prisma.satker.create({
      data: {
        nama: satker.nama,
        email: satker.email,
        alamat: satker.alamat,
        kodeSatker: satker.internalBPS !== true ? `${satker.provinsi.kodeProvinsi}99` : (satker.provinsi.kodeProvinsi === "00" ? `00${parseInt(satker.kabupatenKota.kodeKabupatenKota.toString().slice(0, 2))}` : `${satker.provinsi.kodeProvinsi}${parseInt(satker.kabupatenKota.kodeKabupatenKota.toString().slice(0, 2))}`),
        provinsi: {
          connect: {
            kodeProvinsi: satker.provinsi.kodeProvinsi,
          },
        },
        kabupatenKota: {
          connect: {
            kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota
          }
        },
        // kabupatenKota: {
        //   connectOrCreate: {
        //     where: {
        //       kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota, // Menentukan kondisi untuk mencari provinsi
        //     },
        //     create: {
        //       nama: satker.kabupatenKota.namaKabupatenKota,
        //       kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota,
        //       provinsiId: Number(satker.provinsi.kodeProvinsi)
        //     }
        //     // nama: satker.kabupatenKota.namaKabupatenKota,
        //     // kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota,
        //   },
        //   // provinsi: {
        //   //   connect: {
        //   //     kodeProvinsi: satker.provinsi.kodeProvinsi,
        //   //   },
        //   // },

        // },
        internalBPS: satker.internalBPS,
        kapasitasSatkerTahunAjaran: {
          create: {
            tahunAjaran: {
              connect: {
                tahunAjaranId: (await this.prisma.tahunAjaran.findFirst({
                  where: {
                    isActive: true,
                  },
                  select: {
                    tahunAjaranId: true,
                  },
                }).finally(() => {
                  this.prisma.$disconnect();
                })).tahunAjaranId,
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
      message: 'Data Satuan Kerja Berhasil Ditambahkan',
      data: satkerBaru,
    }
  }

  async findAllKapasitasSatkerBy(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'Satker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat kapasitas satker');
    }

    const kapasitasSatker = await this.prisma.kapasitasSatkerTahunAjaran.findMany({
      where: {
        AND: [accessibleBy(ability).KapasitasSatkerTahunAjaran],
        satker: {
          kodeSatker: {
            contains: params.kodeSatker,
          },
          provinsi: {
            nama: {
              contains: params.namaProvinsi,
            },
            kodeProvinsi: {
              contains: params.kodeProvinsi,
            },
          },
          kabupatenKota: {
            nama: {
              contains: params.namaKabupatenKota,
            },
            kodeKabupatenKota: {
              contains: params.kodeKabupatenKota,
            },
          },
        },
        tahunAjaran: {
          tahun: {
            contains: params.tahunAjaran,
          },
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Kapasitas Satuan Kerja Berhasil Diambil',
      data: kapasitasSatker,
    }
  }

  async update(satkerId: number, satker: UpdateSatkerDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'Satker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate satker');
    }

    await this.prisma.satker.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).Satker],
        satkerId: parseInt(satkerId.toString()),
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate satker ini');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const checkKapasitasSatkerTahunAjaranAktif = await this.prisma.kapasitasSatkerTahunAjaran.findFirst({
      where: {
        satkerId: parseInt(satkerId.toString()),
        tahunAjaranId: (await this.prisma.tahunAjaran.findFirst({
          where: {
            isActive: true,
          },
          select: {
            tahunAjaranId: true,
          },
        }).finally(() => {
          this.prisma.$disconnect();
        })).tahunAjaranId,
      },
      select: {
        kapasitasId: true,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (checkKapasitasSatkerTahunAjaranAktif === null) {
      // create kapasitas baru
      const createKapasitas = await this.prisma.kapasitasSatkerTahunAjaran.create({
        data: {
          kapasitas: satker.kapasitasSatkerTahunAjaran.kapasitas,
          tahunAjaran: {
            connect: {
              tahunAjaranId: (await this.prisma.tahunAjaran.findFirst({
                where: {
                  isActive: true,
                },
                select: {
                  tahunAjaranId: true,
                },
              }).finally(() => {
                this.prisma.$disconnect();
              })).tahunAjaranId,
            },
          },
          satker: {
            connect: {
              satkerId: parseInt(satkerId.toString()),
            },
          },
        },
        select: {
          kapasitasId: true,
        },
      }).finally(() => {
        this.prisma.$disconnect();
      });
    }

    const updateSatker = await this.prisma.satker.update({
      where: {
        satkerId: parseInt(satkerId.toString()),
      },
      data: {
        nama: satker.nama,
        alamat: satker.alamat,
        email: satker.email,
        latitude: satker.latitude || undefined,
        longitude: satker.longitude || undefined,
        provinsi: {
          connect: {
            kodeProvinsi: satker.provinsi.kodeProvinsi,
          },
        },
        kabupatenKota: {
          connect: {
            kodeKabupatenKota: satker.kabupatenKota.kodeKabupatenKota,
          },
        },
        kapasitasSatkerTahunAjaran: {
          update: {
            data: {
              kapasitas: satker.kapasitasSatkerTahunAjaran.kapasitas,
            },
            where: {
              kapasitasId: (await this.prisma.kapasitasSatkerTahunAjaran.findFirst({
                where: {
                  satkerId: parseInt(satkerId.toString()),
                  tahunAjaranId: (await this.prisma.tahunAjaran.findFirst({
                    where: {
                      isActive: true,
                    },
                    select: {
                      tahunAjaranId: true,
                    },
                  }).finally(() => {
                    this.prisma.$disconnect();
                  })).tahunAjaranId,
                },
                select: {
                  kapasitasId: true,
                },
              }).finally(() => {
                this.prisma.$disconnect();
              })).kapasitasId
            },
          },
        },
      },
      select: {
        satkerId: true,
        nama: true,
        alamat: true,
        email: true,
        kabupatenKota: {
          select: {
            nama: true,
            provinsi: {
              select: {
                nama: true,
              },
            },
          },
        },
        kodeSatker: true,
        kapasitasSatkerTahunAjaran: {
          select: {
            kapasitas: true,
            tahunAjaran: {
              select: {
                tahun: true,
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
      message: 'Data Satuan Kerja Berhasil Diubah',
      data: updateSatker,
    }
  }

  async updateDataLatLongSatker(satkerId: number, satker: UpdateSatkerDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'Satker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate satker');
    }

    await this.prisma.satker.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).Satker],
        satkerId: parseInt(satkerId.toString()),
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate satker ini');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const updateSatker = await this.prisma.satker.update({
      where: {
        satkerId: parseInt(satkerId.toString()),
      },
      data: {
        latitude: satker.latitude,
        longitude: satker.longitude,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Satuan Kerja Berhasil Diubah',
      data: updateSatker,
    }
  }

  async updateKapasitasSatker(kapasitasSatkerId: number, kapasitasSatker: UpdateKapasitasSatkerTahunAjaranDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'KapasitasSatkerTahunAjaran')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate kapasitas satker');
    }

    await this.prisma.kapasitasSatkerTahunAjaran.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).KapasitasSatkerTahunAjaran],
        kapasitasId: parseInt(kapasitasSatkerId.toString()),
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate kapasitas satker ini');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const updateKapasitas = await this.prisma.kapasitasSatkerTahunAjaran.update({
      where: {
        kapasitasId: parseInt(kapasitasSatkerId.toString()),
      },
      data: {
        kapasitas: kapasitasSatker.kapasitas,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Kapasitas Satuan Kerja Berhasil Diubah',
      data: updateKapasitas,
    }
  }

  async remove(satkerId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'Satker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus satker');
    }

    await this.prisma.kapasitasSatkerTahunAjaran.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).KapasitasSatkerTahunAjaran],
        kapasitasId: parseInt(satkerId.toString()),
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus satker ini');
    });

     // Ambil kabupatenKotaId sebelum hapus
    const satker = await this.prisma.satker.findUnique({
      where: { satkerId },
      select: { kabupatenKotaId: true },
    });

    if (!satker) {
      throw new NotFoundException('Satker tidak ditemukan');
    }

    const kabupatenKotaId = satker.kabupatenKotaId;

    const deleteSatker = await this.prisma.satker.delete({
      where: {
        satkerId: satkerId,
      },
    });

    // Cek apakah masih ada Satker lain dengan kabupatenKotaId ini
    const otherSatkers = await this.prisma.satker.findMany({
      where: { kabupatenKotaId },
    });

    if (otherSatkers.length === 0) {
      // Hapus KabupatenKota kalau sudah tidak dipakai Satker lain
      await this.prisma.kabupatenKota.delete({
        where: { kabupatenKotaId },
      });
    }

    return {
      status: 'success',
      message: 'Data Satuan Kerja Berhasil Dihapus',
      data: deleteSatker,
    }
  }
}
