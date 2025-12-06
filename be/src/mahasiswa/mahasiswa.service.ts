import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMahasiswaDto } from '../mahasiswa/dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from '../mahasiswa/dto/update-mahasiswa.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class MahasiswaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async chartJumlahMhs() {
    const mahasiswa = await this.prisma.mahasiswa.findMany()

    const getPerizinan = mahasiswa.reduce((acc, curr) => {
      const prodi = curr.prodi;
  
      const existing = acc.find(item => item.prodi === prodi);
  
      if (existing) {
        existing.jumlah += 1;
      } else {
        acc.push({ jenis: prodi, jumlah: 1 });
      }
  
      return acc;
    }, []);
  
    return getPerizinan
  }

  async findAll(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'Mahasiswa')) {
      // console.log(payload);
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data mahasiswa');
    }

    const page = parseInt(params.page) || 1;
    const pageSize = params.pageSize ? parseInt(params.pageSize) : undefined;

    const searchNama = (params.searchNama?.trim() || params.nama?.trim()) ?? '';
    const searchNIM = (params.searchNIM?.trim() || params.nim?.trim()) ?? '';
    const searchKelas = (params.searchKelas?.trim() || params.kelas?.trim()) ?? '';
    const searchAlamat = (params.searchAlamat?.trim() || params.alamatWali?.trim()) ?? '';
    const searchSatker = (params.searchSatker?.trim() || params.satker?.trim()) ?? '';
    const searchBank = (params.searchBank?.trim() || params.bank?.trim()) ?? '';
    const searchStatusRek = (params.searchStatusRek?.trim() || params.statusRek?.trim()) ?? '';
    const searchTahunAjaran = params.tahunAjaran?.trim();

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const filters: Prisma.MahasiswaWhereInput = {
      ...(searchNama && {
        nama: {
          contains: searchNama,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(searchNIM && {
        nim: {
          contains: searchNIM
        },
      }),
      ...(searchKelas && {
        kelas: {
          contains: searchKelas,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(searchAlamat && {
        alamatWali: {
          contains: searchAlamat,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(searchBank && {
        bank: {
          contains: searchBank,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(searchStatusRek && {
        statusRek: {
          contains: searchStatusRek,
          mode: 'insensitive' as Prisma.QueryMode,
        },
      }),
      ...(searchSatker && {
        satker: {
          nama: {
            contains: searchSatker,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
      }),
      ...(searchTahunAjaran
      ? {
          user: {
            tahunAjaran: {
              tahun: { contains: searchTahunAjaran },
            },
          },
        }
      : {
          user: {
            tahunAjaranId: year?.tahunAjaranId ?? undefined,
          },
        }),
    };

    const whereClause: Prisma.MahasiswaWhereInput = {
      AND: [accessibleBy(ability).Mahasiswa, filters],
    };

     const [data, total] = await this.prisma.$transaction([
      this.prisma.mahasiswa.findMany({
        where: whereClause,
        skip: pageSize ? (page - 1) * pageSize : undefined,
        take: pageSize,
        orderBy: { nim: 'asc' },
        select: {
        mahasiswaId: true,
        nim: true,
        nama: true,
        kelas: true,
        noHp: true,
        prodi: true,
        alamat: true,
        alamatWali: true,
        nomorRekening: true,
        namaRekening: true,
        bank: true,
        catatanRek: true,
        statusRek: true,
        dosenPembimbingMagang: {
          select: {
            dosenId: true,
            nama: true,
          },
        },
        pembimbingLapangan: {
          select: {
            pemlapId: true,
            nama: true,
          },
        },
        satker: {
          select: {
            satkerId: true,
            nama: true,
          },
        },
        user: {
          select: {
            email: true,
            userId: true,
            tahunAjaran: {
              select: {
                tahun: true,
              },
            },
          },
        },
      },
    }),
    this.prisma.mahasiswa.count({ where: whereClause }),
  ]);

    const responseMahasiswa = data.map((m, index) => ({
      index: index + 1 + ((page - 1) * (pageSize || 0)),
      mahasiswaId: m.mahasiswaId,
      userId: m.user.userId,
      nim: m.nim,
      nama: m.nama,
      kelas: m.kelas,
      noHp: m.noHp,
      prodi: m.prodi,
      alamat: m.alamat,
      alamatWali: m.alamatWali,
      nomorRekening: m.nomorRekening,
      namaRekening: m.namaRekening,
      bank: m.bank,
      catatanRek: m.catatanRek,
      statusRek: m.statusRek,
      dosenId: m.dosenPembimbingMagang?.dosenId,
      namaDosenPembimbingMagang: m.dosenPembimbingMagang?.nama,
      pemlapId: m.pembimbingLapangan?.pemlapId,
      namaPembimbingLapangan: m.pembimbingLapangan?.nama,
      satkerId: m.satker?.satkerId,
      namaSatker: m.satker?.nama,
      email: m.user.email,
      tahunAjaran: m.user.tahunAjaran?.tahun,
    }));

    return {
      status: 'success',
      message: 'Data Mahasiswa Berhasil Ditemukan',
      data: responseMahasiswa,
      total
    };
  }

  async findOne(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);


    if (!ability.can('read', 'Mahasiswa')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat data mahasiswa');
    }

    const resultMahasiswa = await this.prisma.mahasiswa.findMany({
      where: {
        AND: [accessibleBy(ability).Mahasiswa],
        mahasiswaId: params
        // nim: {
        //   contains: params.nim,
        //   mode: 'insensitive',
        // },
        // nama: {
        //   contains: params.nama,
        //   mode: 'insensitive',
        // },
        // kelas: {
        //   contains: params.kelas,
        //   mode: 'insensitive',
        // },
        // prodi: {
        //   contains: params.prodi,
        //   mode: 'insensitive',
        // },
        // dosenPembimbingMagang: {
        //   dosenId: params.dosenId || undefined,
        // },
        // pembimbingLapangan: {
        //   pemlapId: parseInt(params.pemlapId) || undefined,
        // },
        // satker: {
        //   satkerId: parseInt(params.satkerId) || undefined,
        // },
        // user: {
        //   email: {
        //     contains: params.email,
        //     mode: 'insensitive',
        //   },
        //   tahunAjaran: {
        //     tahun: {
        //       contains: params.tahunAjaran,
        //     },
        //   },
        // },
      },
      select: {
        mahasiswaId: true,
        nim: true,
        nama: true,
        kelas: true,
        prodi: true,
        alamat: true,
        dosenPembimbingMagang: {
          select: {
            dosenId: true,
            nama: true,
          },
        },
        pembimbingLapangan: {
          select: {
            pemlapId: true,
            nama: true,
          },
        },
        satker: {
          select: {
            satkerId: true,
            nama: true,
          },
        },
        user: {
          select: {
            userId: true,
            email: true,
            tahunAjaran: {
              select: {
                tahun: true,
              },
            },
          },
        },
      },
      orderBy: {
        nim: 'asc',
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    // let responseMahasiswa = [];

    // for (let i = 0; i < mahasiswas.length; i++) {
    //   responseMahasiswa.push({
    //     mahasiswaId: mahasiswas[i].mahasiswaId || null,
    //     userId: mahasiswas[i].user.userId || null,
    //     nim: mahasiswas[i].nim || null,
    //     nama: mahasiswas[i].nama || null,
    //     kelas: mahasiswas[i].kelas || null,
    //     prodi: mahasiswas[i].prodi || null,
    //     alamat: mahasiswas[i].alamat || null,
    //     dosenId: mahasiswas[i].dosenPembimbingMagang ? mahasiswas[i].dosenPembimbingMagang.dosenId : null,
    //     namaDosenPembimbingMagang: mahasiswas[i].dosenPembimbingMagang ? mahasiswas[i].dosenPembimbingMagang.nama : null,
    //     pemlapId: mahasiswas[i].pembimbingLapangan ? mahasiswas[i].pembimbingLapangan.pemlapId : null,
    //     namaPembimbingLapangan: mahasiswas[i].pembimbingLapangan ? mahasiswas[i].pembimbingLapangan.nama : null,
    //     satkerId: mahasiswas[i].satker ? mahasiswas[i].satker.satkerId : null,
    //     namaSatker: mahasiswas[i].satker ? mahasiswas[i].satker.nama : null,
    //     email: mahasiswas[i].user.email || null,
    //     tahunAjaran: mahasiswas[i].user.tahunAjaran.tahun || null,
    //   });
    // }

    return {
      status: 'success',
      message: 'Data Mahasiswa Berhasil Ditemukan',
      data: resultMahasiswa,
    };
  }

  async importExcel(
    data: any
  ) {
    try {
      const injectedToken = this.request.headers['authorization'].split(' ')[1];
      const payload = this.jwtService.decode(injectedToken);
      const ability = this.caslAbilityFactory.createForUser(payload);

      if (!ability.can('create', 'Mahasiswa')) {
        throw new ForbiddenException('Anda tidak memiliki izin untuk menambahkan data mahasiswa');
      }

      let createMahasiswaDto: CreateMahasiswaDto[] = [];
      let mahasiswa = []

      const tahunAjaranAktif = await this.prisma.tahunAjaran.findFirst({
        where: {
          isActive: true,
        }
      });

      // console.log("data masuk", data)

      for (const mhs of data) {
        // === SATKER UTAMA ===
        let satkerId: number | null = null;
        if (mhs.kodeSatker) {
          const satker = await this.prisma.satker.findFirst({
            where: { kodeSatker: String(mhs.kodeSatker) },
          });
          if (!satker) {
            throw new NotFoundException(`Satker dengan kode ${mhs.kodeSatker} tidak ditemukan`);
          }
          satkerId = satker.satkerId;
        }

        // === KABUPATEN DOMISILI ===
        let kabupatenId: number | null = null;
        if (mhs.kodeSatkerKab) {
          const satkerKab = await this.prisma.satker.findFirst({
            where: { kodeSatker: String(mhs.kodeSatkerKab) },
          });
          if (!satkerKab) {
            throw new NotFoundException(`Satker kabupaten dengan kode ${mhs.kodeSatkerKab} tidak ditemukan`);
          }
          kabupatenId = satkerKab.kabupatenKotaId;
        }

        // === KABUPATEN WALI ===
        let kabupatenWaliId: number | null = null;
        if (mhs.kodeSatkerKabWali) {
          const satkerKabWali = await this.prisma.satker.findFirst({
            where: { kodeSatker: String(mhs.kodeSatkerKabWali) },
          });
          if (!satkerKabWali) {
            throw new NotFoundException(`Satker kabupaten wali dengan kode ${mhs.kodeSatkerKabWali} tidak ditemukan`);
          }
          kabupatenWaliId = satkerKabWali.kabupatenKotaId;
        }

        // === PROVINSI WALI ===
        let provinsiWaliId: number | null = null;
        if (mhs.provinsiWaliId) {
          const provinsi = await this.prisma.provinsi.findUnique({
            where: { kodeProvinsi: String(mhs.provinsiWaliId) },
          });
          if (!provinsi) {
            throw new NotFoundException(`Provinsi dengan ID ${mhs.provinsiWaliId} tidak ditemukan`);
          }
          provinsiWaliId = provinsi.provinsiId;
        }

        const createdUser = await this.prisma.user.create({
          data: {
            email: mhs.email,
            password: bcrypt.hashSync(mhs.password.toString(), 10),
            tahunAjaranId: tahunAjaranAktif.tahunAjaranId,
            userRoles: {
              create: { roleId: 9 }
            },            
            mahasiswa: {
              create: {
                nim: String(mhs.nim),
                nama: mhs.nama,
                prodi: mhs.prodi,
                kelas: mhs.kelas,
                email: mhs.emailNonStis,
                noHpWali: mhs.noHpWali ? String(mhs.noHpWali) : null,
                alamat : mhs.alamat,
                alamatWali : mhs.alamatWali,
                provinsiWaliId : provinsiWaliId,
                satkerId: satkerId,
                kabupatenId: kabupatenId,
                kabupatenWaliId: kabupatenWaliId
              }
            }
          },
          include: { mahasiswa: true },
        });
        
        // === AUTO INSERT PENEMPATAN ===
        const mahasiswaId = createdUser.mahasiswa?.mahasiswaId;

        if (satkerId && mahasiswaId) {
          await this.prisma.penempatan.create({
            data: {
              mahasiswaId: mahasiswaId,
              satkerId: satkerId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        }
      }

      return {
        status: 'success',
        message: 'Data Mahasiswa Berhasil Ditambahkan',
        data: mahasiswa,
      };
    } catch (error) {
      console.log(error)
      await this.prisma.$disconnect();
      throw new BadRequestException('Data yang anda masukkan tidak valid');
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async update(
    mahasiswaId: number,
    updateMahasiswaDto: any
  ) {
    delete updateMahasiswaDto.satkerId
    delete updateMahasiswaDto.dosenId
    delete updateMahasiswaDto.pemlapId
    delete updateMahasiswaDto.mahasiswaId
    delete updateMahasiswaDto.userId

    // Ambil data lama mahasiswa
    const existingMahasiswa = await this.prisma.mahasiswa.findUnique({
      where: { mahasiswaId: mahasiswaId },
    });

    // Cek kalau rekening info berubah
    const rekeningFields = ['nomorRekening', 'bank', 'namaRekening'];
    const isRekeningChanged = rekeningFields.some(
      (field) =>
        updateMahasiswaDto[field] !== undefined &&
        updateMahasiswaDto[field] !== existingMahasiswa[field]
    );

    if (isRekeningChanged) {
      updateMahasiswaDto.statusRek = 'menunggu';
    }

    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    const kabupatenId = Number(updateMahasiswaDto.kabupatenId);
    const kabupatenWaliId = Number(updateMahasiswaDto.kabupatenWaliId);
    const provinsiWaliId = Number(updateMahasiswaDto.provinsiWaliId);

    const cekDosenPembimbingMagang =
      updateMahasiswaDto.dosenPembimbingMagang?.dosenId
        ? { connect: { dosenId: updateMahasiswaDto.dosenPembimbingMagang.dosenId } }
        : { disconnect: true };

    const cekPembimbingLapangan =
      updateMahasiswaDto.pembimbingLapangan?.pemlapId
        ? { connect: { pemlapId: updateMahasiswaDto.pembimbingLapangan.pemlapId } }
        : { disconnect: true };

    const cekSatker =
      updateMahasiswaDto.satker?.satkerId
        ? { connect: { satkerId: updateMahasiswaDto.satker.satkerId } }
        : { disconnect: true };

    const cekKabKotaDomisili =
      kabupatenId
        ? { connect: { kabupatenKotaId: kabupatenId } }
        : { disconnect: true };

    const cekProvinsiWali =
      provinsiWaliId
        ? { connect: { provinsiId: provinsiWaliId } }
        : { disconnect: true };

    const cekKabKotaWaliDomisili =
      kabupatenWaliId
        ? { connect: { kabupatenKotaId: kabupatenWaliId } }
        : { disconnect: true };

    delete updateMahasiswaDto.kabupatenId
    delete updateMahasiswaDto.provinsiWaliId
    delete updateMahasiswaDto.kabupatenWaliId

    await this.prisma.mahasiswa.update({
      where: {
        mahasiswaId: mahasiswaId,
      },
      data: {
        ...updateMahasiswaDto,
        kabupaten: cekKabKotaDomisili,
        kabupatenWali: cekKabKotaWaliDomisili,
        provinsiWali: cekProvinsiWali,
        dosenPembimbingMagang: cekDosenPembimbingMagang,
        pembimbingLapangan: cekPembimbingLapangan,
        satker: cekSatker,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const updatedMahasiswa = await this.prisma.mahasiswa.findUnique({
      where: {
        mahasiswaId: mahasiswaId,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data Mahasiswa Berhasil Diupdate',
      data: updatedMahasiswa,
    };
  }

  async setTempatMagangBatch(
    data: any
  ) {
    try {
      const injectedToken = this.request.headers['authorization'].split(' ')[1];
      const payload = this.jwtService.decode(injectedToken);
      const ability = this.caslAbilityFactory.createForUser(payload);

      if (!ability.can('update', 'Mahasiswa')) {
        throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data mahasiswa');
      }

      let mahasiswa = []

      for (let i = 0; i < data.length; i++) {
        const mahasiswaId = data[i].mahasiswaId;
        const satkerId = data[i].satkerId;

        const cekSatker =
          (satkerId.toString() === '') ?
            {
              disconnect: true,
            } :
            {
              connect: {
                satkerId: satkerId
              }
            };

        await this.prisma.mahasiswa.update({
          where: {
            mahasiswaId: mahasiswaId,
          },
          data: {
            satker: {
              ...cekSatker,
            },
          },
        })

        mahasiswa.push(
          await this.prisma.mahasiswa.findUnique({
            where: {
              mahasiswaId: mahasiswaId,
            },
          })
        )
      }

      // this.prisma.$disconnect();
      const mahasiswas = await this.prisma.mahasiswa.updateMany({
        where: {
          mahasiswaId: {
            in: data.map((item) => item.mahasiswaId),
          },
        },
        data: {
          satkerId: {
            set: data.map((item) => item.satkerId),
          },
        },
      }).finally(() => {
        this.prisma.$disconnect();
      });

      return {
        status: 'success',
        message: 'Data Mahasiswa Berhasil Diupdate',
        data: mahasiswa,
      };
    } catch (error) {
      throw new BadRequestException('Data yang anda masukkan tidak valid');
    }
  }
}


// if (!ability.can('update', 'Mahasiswa')) {
//   throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data mahasiswa');
// }

// await this.prisma.mahasiswa.findFirstOrThrow({
//   where: {
//     mahasiswaId: mahasiswaId,
//     // AND: [accessibleBy(ability).Mahasiswa],
//   }
// }).catch(() => {
//   throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah data mahasiswa');
// }).finally(() => {
//   this.prisma.$disconnect();
// });

// cek dilakukan karna 3 field ini bersifat foreign key dan hanya bisa menerima perintah connect atau disconnect
// const cekDosenPembimbingMagang =
//   (updateMahasiswaDto.dosenPembimbingMagang.dosenId?.toString() === '') ?
//     {
//       disconnect: true,
//     } :
//     {
//       connect: {
//         dosenId: updateMahasiswaDto.dosenPembimbingMagang.dosenId
//       }
//     };

// const cekPembimbingLapangan =
//   (updateMahasiswaDto.pembimbingLapangan.pemlapId?.toString() === '') ?
//     {
//       disconnect: true,
//     } :
//     {
//       connect: {
//         pemlapId: updateMahasiswaDto.pembimbingLapangan.pemlapId
//       }
//     };

// const cekSatker =
//   (updateMahasiswaDto.satker.satkerId?.toString() === '') ?
//     {
//       disconnect: true,
//     } :
//     {
//       connect: {
//         satkerId: updateMahasiswaDto.satker.satkerId
//       }
//     };
