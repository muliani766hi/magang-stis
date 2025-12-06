import { accessibleBy } from '@casl/prisma';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CreatePresensiDto } from '../presensi/dto/create-presensi.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIzinPresensiDto } from './dto/create-izinPresensi.dto';
import { unlinkSync } from 'fs';
import { join, parse } from 'path';

@Injectable()
export class PresensiService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async chartPerizinan() {
    const izinPresensi = await this.prisma.izinPresensi.findMany();
  
    const getPerizinan = izinPresensi.reduce((acc, curr) => {
      const jenis = curr.jenisIzin;
  
      const existing = acc.find(item => item.jenis === jenis);
  
      if (existing) {
        existing.jumlah += 1;
      } else {
        acc.push({ jenis, jumlah: 1 });
      }
  
      return acc;
    }, []);
  
    const presensiManual = await this.prisma.presensiManual.findMany({
      where: {
        disetujui: true
      }
    });
  
    const getPresensiManual = presensiManual.reduce((acc, curr) => {
      const jenis = curr.keterangan;
  
      const existing = acc.find(item => item.jenis === jenis);
  
      if (existing) {
        existing.jumlah += 1;
      } else {
        acc.push({ jenis, jumlah: 1 });
      }
  
      return acc;
    }, []);
  
    return {
      perizinan: getPerizinan,
      manual: getPresensiManual
    };
  }
  


  async findAllPresensiByMahasiswa() {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);
    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    let whereCondition: any = {
      user: {
        tahunAjaranId: year?.tahunAjaranId
      }
    }

    if(payloadJwt.role === 'admin satuan kerja' || payloadJwt.roleId === 8){
      const user = await this.prisma.user.findFirst({
        where: {
          userId: payloadJwt.id
        }
      })
      const adminSatker = await this.prisma.adminSatker.findFirst({
        where: {
          userId : user.userId
        }
      })
      whereCondition = {
        ...whereCondition,
        satkerId: adminSatker?.satkerId
      }
    }

    if(payloadJwt.role === 'dosen pembimbing magang' || payloadJwt.roleId === 3){
      const user = await this.prisma.user.findFirst({
        where: {
          userId: payloadJwt.id
        }
      })
      const dosen = await this.prisma.dosenPembimbingMagang.findFirst({
        where: {
          userId: user.userId
        }
      })
      whereCondition = {
        ...whereCondition,
        dosenId: dosen?.dosenId
      }
    }

    if(payloadJwt.role === 'pembimbing lapangan' || payloadJwt.roleId === 4){
      const user = await this.prisma.user.findFirst({
        where: {
          userId: payloadJwt.id
        }
      })
      const pemlap = await this.prisma.pembimbingLapangan.findFirst({
        where: {
          userId: user.userId
        }
      })
      whereCondition = {
        ...whereCondition,
        pemlapId: pemlap?.pemlapId
      }
      // console.info(user, pemlap)
    }

    const mahasiswa = await this.prisma.mahasiswa.findMany({
      where: whereCondition,
      include: {
        presensi: {
          // where: {
          //   tanggal: {
          //     gte: startOfMonth,
          //     lte: endOfMonth
          //   }
          // },
          orderBy: {
            tanggal: 'desc'
          }
        },
        presensiManual: {
          where: {
            status: 'Disetujui'
          }
        },
        izinPresensi: {
          where: {
            status: 'Disetujui'
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Fungsi hitung bobot berdasarkan sumber data
    function getBobot({ sumber, data }: { sumber: string, data: any }): number {
      if (sumber === 'izinPresensi') {
        const jenis = data.jenisIzin;
        switch (jenis) {
          case 'izin dispensasi':
          case 'izin sakit rawat inap':
          case 'izin keperluan penting':
            return 1.0;
          case 'izin sakit rawat jalan':
            return 0.6;
          default:
            return 0.0;
        }
      } else {
        const status = data.status;
        switch (status) {
          case 'Tepat Waktu':
          case 'Website Error':
          case 'Dinas Luar':
          case 'Terlambat A':
            return 1.0;
          case 'Terlambat B':
            return 0.75;
          case 'Terlambat C':
          case 'Alpha':
            return 0.0;
          default:
            return 0.0;
        }
      }
    }

    const result = mahasiswa.map((mhs) => {
      const semuaPresensi = [
        ...mhs.presensi.map(p => ({ sumber: 'presensi', data: p })),
        ...mhs.izinPresensi.map(p => ({ sumber: 'izinPresensi', data: p })),
        // ...mhs.presensiManual.map(p => ({ sumber: 'presensiManual', data: p })),
      ];

      const terlambatA = mhs.presensi.filter(p => p.status === 'Terlambat A');
      const terlambatB = mhs.presensi.filter(p => p.status === 'Terlambat B');
      const terlambatC = mhs.presensi.filter(p => p.status === 'Terlambat C');

      const totalTerlambatA = terlambatA.length;
      const totalTerlambatB = terlambatB.length;
      const totalTerlambatC = terlambatC.length;

      const totalPresensi = mhs.presensi.length;

      let totalBobot = 0;
      let jumlahHari = semuaPresensi.length;

      for (const entry of semuaPresensi) {
        totalBobot += getBobot(entry);
      }

      const persentase = jumlahHari > 0 ? (totalBobot / jumlahHari) * 100 : 0;

      const izinRawatInap = mhs.izinPresensi.filter((value) => value.jenisIzin === 'izin sakit rawat inap').length
      const izinDispensasi = mhs.izinPresensi.filter((value) => value.jenisIzin === 'izin dispensasi').length
      const izinKeperluanPenting = mhs.izinPresensi.filter((value) => value.jenisIzin === 'izin keperluan penting').length
      const izinRawatJalan = mhs.izinPresensi.filter((value) => value.jenisIzin === 'izin sakit rawat jalan').length

      const presensiWebError = mhs.presensiManual.filter((value) => value.keterangan === 'website error').length
      const presensiDinalLuar = mhs.presensiManual.filter((value) => value.keterangan === 'dinas luar').length
      return {
        ...mhs,
        totalPresensi,
        totalTerlambatA,
        totalTerlambatB,
        totalTerlambatC,
        persentaseKehadiran: parseFloat(persentase.toFixed(2)),
        semuaPresensi,
        izinRawatInap: izinRawatInap,
        dispensasi: izinDispensasi,
        izin: izinKeperluanPenting,
        izinRawatJalan: izinRawatJalan,
        dinasLuar: presensiDinalLuar,
        webError: presensiWebError
      };
    });

    return {
      status: 'Sukses',
      data: result
    };
  }

  async findAllPresensiByBulan(bulan: Date) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);
    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    let whereCondition: any = {
      user: {
        tahunAjaranId: year?.tahunAjaranId
      }
    }

    const startOfMonth = bulan;
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const mahasiswa = await this.prisma.mahasiswa.findMany({
      where: whereCondition,
      include: {
        presensi: {
          where: {
            tanggal: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          },
          orderBy: {
            tanggal: 'desc'
          }
        },
        presensiManual: {
          where: {
            status: 'Disetujui'
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

     const result = mahasiswa.map((mhs) => {
      const semuaPresensi = [
        ...mhs.presensi.map(p => ({ sumber: 'presensi', data: p })),
      ];

      const totalPresensi = mhs.presensi.length;

      const presensiWebError = mhs.presensiManual.filter((value) => value.keterangan === 'website error').length
      const presensiDinalLuar = mhs.presensiManual.filter((value) => value.keterangan === 'dinas luar').length

      const hasil = {
        ...mhs,
        totalPresensi,
        semuaPresensi,
        dinasLuar: presensiDinalLuar,
        webError: presensiWebError
      };

      console.info(hasil); // Logging

      return hasil; // Kembalikan hasilnya
    });

    return {
      status: 'Sukses',
      data: result
    };    
  }

  async findAllPresensiByMahasiswaId(mahasiswaId: number) {

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        AND: [
          {
            isActive: true
          }
        ]
      }
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const mahasiswa = await this.prisma.mahasiswa.findFirst({
      where: {
        mahasiswaId,
        user: {
          tahunAjaranId: year?.tahunAjaranId
        }
      },
      include: {
        presensi: {
          where: {
            tanggal: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          },
          orderBy: {
            tanggal: 'desc'
          }
        },
        presensiManual: {
          where: {
            status: 'Disetujui'
          }
        },
        izinPresensi: {
          where: {
            status: 'Disetujui'
          }
        }
      }
    });

    if (!mahasiswa) {
      return {
        status: 'Gagal',
        message: 'Mahasiswa tidak ditemukan',
      };
    }

    const presensi = mahasiswa.presensi;

    const countStatus = (status: string) => presensi.filter(p => p.status === status).length;

    const tepatWaktu = countStatus('Tepat Waktu');
    const terlambat = countStatus('Terlambat A') + countStatus('Terlambat B') + countStatus('Terlambat C');

    const totalPresensi = presensi.length;

    const persen = (jumlah: number, total: number) => total > 0 ? parseFloat(((jumlah / total) * 100).toFixed(2)) : 0;

    const result = {
      jumlah: {
        tepatWaktu,
        terlambat,
      },
      persentasePerKategori: {
        tepatWaktu: persen(tepatWaktu, totalPresensi),
        terlambat: persen(terlambat, totalPresensi),
      },
      persentaseKehadiran: persen(tepatWaktu + terlambat, totalPresensi),
      distribusiKehadiran: {
        tepatWaktu: persen(tepatWaktu, tepatWaktu + terlambat),
        terlambat: persen(terlambat, tepatWaktu + terlambat),
      }
    };

    return {
      status: 'Sukses',
      data: result
    };
  }

  //IZIN PRESENSI
  async findAllIzinPresensi() {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'IzinPresensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat izin presensi');
    }

    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const izinPresensis = await this.prisma.izinPresensi.findMany({
      where: {
        AND: [
          accessibleBy(ability).IzinPresensi,
          {
            mahasiswa: {
              user: {
                tahunAjaranId: year.tahunAjaranId
              }
            }
          }
        ],
      },
      select: {
        izinId: true,
        tanggal: true,
        keterangan: true,
        jenisIzin: true,
        status: true,
        fileBukti: true,
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
          },
        },
      },
      orderBy: {
        izinId: 'desc',
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data izin presensi berhasil ditemukan',
      data: izinPresensis,
    }
  }

  async createIzinPresensi(createIzinPresensiDto: CreateIzinPresensiDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'IzinPresensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat izin presensi');
    }

    const mahasiswa = await this.prisma.mahasiswa.findFirst({
      where: {
        userId: payload['id']
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const izinPresensi = await this.prisma.izinPresensi.create({
      data: {
        tanggal: new Date(createIzinPresensiDto.tanggal),
        keterangan: createIzinPresensiDto.keterangan,
        jenisIzin: createIzinPresensiDto.jenisIzin,
        mahasiswa: {
          connect: {
            mahasiswaId: parseInt(mahasiswa.mahasiswaId.toString()),
          },
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Izin presensi berhasil ditambahkan',
      data: izinPresensi,
    }
  }

  async updateIzinPresensi(izinId: number, updateIzinPresensiDto: CreateIzinPresensiDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'IzinPresensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah izin presensi');
    }

    await this.prisma.izinPresensi.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).IzinPresensi],
        izinId: parseInt(izinId.toString())
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah izin presensi');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const izinPresensi = await this.prisma.izinPresensi.update({
      where: {
        izinId: parseInt(izinId.toString())
      },
      data: {
        tanggal: new Date(updateIzinPresensiDto.tanggal),
        keterangan: updateIzinPresensiDto.keterangan,
        jenisIzin: updateIzinPresensiDto.jenisIzin,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Izin presensi berhasil diubah',
      data: izinPresensi,
    }
  }

  async uploadBuktiPendukung(
    izinId: number,
    file: string
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'IzinPresensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat izin presensi');
    }

    const mahasiswa = await this.prisma.mahasiswa.findFirst({
      where: {
        userId: payload['id']
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    // hapus file lama
    const izinPresensiLama = await this.prisma.izinPresensi.findFirst({
      where: {
        izinId: parseInt(izinId.toString())
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (izinPresensiLama.fileBukti) {
      try {
        unlinkSync(join(process.cwd(), 'public/file-bukti-izin-presensi/' + izinPresensiLama.fileBukti));
      } catch (error) {
        console.log(error);
      }
    }

    const izinPresensi = await this.prisma.izinPresensi.update({
      where: {
        izinId: parseInt(izinId.toString())
      },
      data: {
        fileBukti: file,
        mahasiswa: {
          connect: {
            mahasiswaId: parseInt(mahasiswa.mahasiswaId.toString()),
          },
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Izin presensi berhasil ditambahkan',
      data: izinPresensi,
    }
  }

  async approveIzinPresensi(izinId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'IzinPresensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menyetujui izin presensi');
    }

    await this.prisma.izinPresensi.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).IzinPresensi],
        izinId: izinId
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menyetujui izin presensi');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const izinPresensi = await this.prisma.izinPresensi.update({
      where: {
        izinId: izinId
      },
      data: {
        status: 'Disetujui',
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Izin presensi berhasil disetujui',
      data: izinPresensi,
    }
  }

  async rejectIzinPresensi(izinId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'IzinPresensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menolak izin presensi');
    }

    await this.prisma.izinPresensi.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).IzinPresensi],
        izinId: izinId
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menolak izin presensi');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const izinPresensi = await this.prisma.izinPresensi.update({
      where: {
        izinId: izinId
      },
      data: {
        status: 'Ditolak',
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Izin presensi berhasil ditolak',
      data: izinPresensi,
    }
  }

  //PRESENSI
  async create(createPresensiDto: CreatePresensiDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'Presensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat presensi');
    }

    const mahasiswa = await this.prisma.mahasiswa.findFirst({
      where: {
        userId: payload['id']
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const dateToday = new Date(new Date());
    dateToday.setHours(7, 0, 0, 0);

    let tanggalClientMasihUTC = new Date(createPresensiDto.tanggal);
    let timzoneOffset = tanggalClientMasihUTC.getTimezoneOffset();
    let tanggalClient = new Date(tanggalClientMasihUTC.setTime(tanggalClientMasihUTC.getTime() + (-timzoneOffset) * 60 * 1000));
    let waktuClientMasihUTC = new Date(createPresensiDto.waktu);
    let waktuClient = new Date(waktuClientMasihUTC.setTime(waktuClientMasihUTC.getTime() + (-timzoneOffset) * 60 * 1000));

    // console.log(createPresensiDto.tanggal);
    // console.log(tanggalClientMasihUTC);
    // console.log(timzoneOffset);
    // console.log(tanggalClient);

    // console.log(new Date(new Date(new Date(tanggalClient).toISOString().slice(0, 10) + ' 00:00:00').getTime() + (-timzoneOffset) * 60 * 1000));
    // console.log(new Date(new Date(new Date(tanggalClient).toISOString().slice(0, 10) + ' 23:59:59').getTime() + (-timzoneOffset) * 60 * 1000));

    const presensiMahasiswaPadaTanggal = await this.prisma.presensi.findFirst({
      where: {
        tanggal: {
          gte: new Date(new Date(new Date(tanggalClient).toISOString().slice(0, 10) + ' 00:00:00').getTime() + (-timzoneOffset) * 60 * 1000),
          lte: new Date(new Date(new Date(tanggalClient).toISOString().slice(0, 10) + ' 23:59:59').getTime() + (-timzoneOffset) * 60 * 1000),
        },
        mahasiswaId: parseInt(mahasiswa.mahasiswaId.toString()),
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    let presensi = null;

    if (presensiMahasiswaPadaTanggal) {
      const durasiJamKerja = ((new Date().getTime() - new Date(presensiMahasiswaPadaTanggal.createdAt).getTime()) / 3600000) - 1;

      const durasiJamKerjaHariJumat = ((new Date().getTime() - new Date(presensiMahasiswaPadaTanggal.createdAt).getTime()) / 3600000) - 1.5;

      const namaHari = new Date(createPresensiDto.tanggal).toLocaleDateString('id-ID', { weekday: 'long' });

      // jika hari jumat dan jumlah jam kerja kurang dari 9 jam maka status jam kerja adalah 'Jam kerja kurang'
      if (namaHari == 'Jumat' && durasiJamKerjaHariJumat < 7.5) {
        createPresensiDto.statusJamKerja = 'Jam kerja kurang';

        if (durasiJamKerjaHariJumat > 7.5) {
          createPresensiDto.jumlahJamKerja = 7.5;
        } else {
          createPresensiDto.jumlahJamKerja = durasiJamKerjaHariJumat;
        }

        presensi = await this.prisma.presensi.update({
          where: {
            presensiId: presensiMahasiswaPadaTanggal.presensiId
          },
          data: {
            waktuPulang: new Date(waktuClient),
            jumlahJamKerja: createPresensiDto.jumlahJamKerja,
            durasiJamKerja: durasiJamKerjaHariJumat,
            statusJamKerja: createPresensiDto.statusJamKerja,
          }
        }).finally(() => {
          this.prisma.$disconnect();
        });

      } else if (durasiJamKerja < 7.5) {
        createPresensiDto.statusJamKerja = 'Jam kerja kurang';

        if (durasiJamKerja > 7.5) {
          createPresensiDto.jumlahJamKerja = 7.5;
        } else {
          createPresensiDto.jumlahJamKerja = durasiJamKerja;
        }

        presensi = await this.prisma.presensi.update({
          where: {
            presensiId: presensiMahasiswaPadaTanggal.presensiId
          },
          data: {
            waktuPulang: new Date(waktuClient),
            jumlahJamKerja: createPresensiDto.jumlahJamKerja,
            durasiJamKerja: durasiJamKerja,
            statusJamKerja: createPresensiDto.statusJamKerja,
          }
        }).finally(() => {
          this.prisma.$disconnect();
        });

      } else if (namaHari == 'Jumat' && durasiJamKerjaHariJumat >= 7.5) {
        createPresensiDto.statusJamKerja = 'Jam kerja terpenuhi';

        if (durasiJamKerjaHariJumat > 7.5) {
          createPresensiDto.jumlahJamKerja = 7.5;
        } else {
          createPresensiDto.jumlahJamKerja = durasiJamKerjaHariJumat;
        }

        presensi = await this.prisma.presensi.update({
          where: {
            presensiId: presensiMahasiswaPadaTanggal.presensiId
          },
          data: {
            waktuPulang: new Date(waktuClient),
            jumlahJamKerja: createPresensiDto.jumlahJamKerja,
            durasiJamKerja: durasiJamKerjaHariJumat,
            statusJamKerja: createPresensiDto.statusJamKerja,
          }
        }).finally(() => {
          this.prisma.$disconnect();
        });

      } else {
        createPresensiDto.statusJamKerja = 'Jam kerja terpenuhi';

        if (durasiJamKerja > 7.5) {
          createPresensiDto.jumlahJamKerja = 7.5;
        } else {
          createPresensiDto.jumlahJamKerja = durasiJamKerja;
        }

        presensi = await this.prisma.presensi.update({
          where: {
            presensiId: presensiMahasiswaPadaTanggal.presensiId
          },
          data: {
            waktuPulang: new Date(waktuClient),
            jumlahJamKerja: createPresensiDto.jumlahJamKerja,
            durasiJamKerja: durasiJamKerja,
            statusJamKerja: createPresensiDto.statusJamKerja,
          }
        }).finally(() => {
          this.prisma.$disconnect();
        });

      }
    } else {
      const waktu = new Date(createPresensiDto.waktu);
      // console.log(waktu, waktu.getHours(), waktu.getMinutes());
      const jam = waktu.getHours();
      const menit = waktu.getMinutes();

      if (jam >= 8 && menit > 0) {
        createPresensiDto.status = 'Terlambat C';
        createPresensiDto.bobotKetidakhadiran = 0;
      } else if (jam == 7 && menit > 45) {
        createPresensiDto.status = 'Terlambat B';
        createPresensiDto.bobotKetidakhadiran = 0.75;
      } else if (jam == 7 && menit > 30) {
        createPresensiDto.status = 'Terlambat A';
        createPresensiDto.bobotKetidakhadiran = 1;
      }
      else {
        createPresensiDto.status = 'Tepat Waktu';
        createPresensiDto.bobotKetidakhadiran = 0;
      }

      presensi = await this.prisma.presensi.create({
        data: {
          tanggal: new Date(tanggalClient),
          waktuDatang: new Date(waktuClient),
          waktuPulang: new Date(waktuClient),
          bobotKetidakHadiran: createPresensiDto.bobotKetidakhadiran,
          status: createPresensiDto.status,
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
      message: 'Presensi berhasil ditambahkan',
      data: presensi,
    }
  }

  async findAllPresensiBy(
    params: {
      tanggal: string;
      mahasiswaId: number;
    }
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'Presensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat presensi');
    }

    // console.log(params.mahasiswaId && params.mahasiswaId.toString().trim() !== '')
    // console.log(params.mahasiswaId)

    const presensis = await this.prisma.presensi.findMany({
      where: {
        // AND: [accessibleBy(ability).Presensi],
        tanggal: params.tanggal == '' ? undefined : new Date(params.tanggal).toLocaleDateString(),
        // mahasiswaId: 
        //   (params.mahasiswaId && params.mahasiswaId.toString().trim() !== '' && params.mahasiswaId !== undefined),
        mahasiswaId: Number(params.mahasiswaId)
      },
      orderBy: {
        tanggal: 'desc',
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Data presensi berhasil ditemukan',
      data: presensis,
    }
  }

  async remove(presensiId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'Presensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus presensi');
    }

    await this.prisma.presensi.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).Presensi],
        presensiId: presensiId
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus presensi');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.presensi.delete({
      where: {
        presensiId: presensiId,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Presensi berhasil dihapus',
    }
  }
}
