import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PemberkasanService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async fetchAll() {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);
    
    const year = await this.prisma.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const mahasiswa = await this.prisma.mahasiswa.findMany({
      where: {
        user: {
          tahunAjaranId: year.tahunAjaranId
        }
      },
      include: {
        kabupaten: true,
      },
      orderBy: {
        nama: 'asc'
      }
    })

    const penempatan = await this.prisma.mahasiswa.findMany({
      where: {
        user: {
          tahunAjaranId: year.tahunAjaranId
        }
      },
      select: {
        nama: true,
        nim: true,
        prodi: true,
        kelas: true,
        email: true,
        noHp: true,
        noHpWali: true,
        alamat: true,
        alamatWali: true,
        kabupaten: true,
        penempatan: {
          select: {
            satker: {
              select: {
                nama: true,
                provinsi: {
                  select: {
                    nama: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const bimbingan = await this.prisma.pesertaBimbinganMahasiswa.findMany({
      where: {
        mahasiswa: {
          user: {
            tahunAjaranId: year.tahunAjaranId
          }
        }
      },
      include: {
        mahasiswa: {
          include: {
            dosenPembimbingMagang: true
          }
        },
        bimbingan: {
          include: {
            dosenPembimbingMagang: true
          }
        }
      }
    })

    const groupedByProdis = bimbingan.reduce((acc, { bimbingan, mahasiswa }, index) => {
      const existingProdi = acc.find(item => item.prodi === mahasiswa.prodi);

      if (existingProdi) {
        existingProdi.listMahasiswa.push({
          nama: mahasiswa.nama,
          nim: mahasiswa.nim,
          prodi: mahasiswa.prodi,
          dosen: mahasiswa.dosenPembimbingMagang.nama,
          tanggal: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(bimbingan.tanggal)),
          pokokBahasan: bimbingan.deskripsi,
        });
      } else {
        acc.push({
          index: index,
          prodi: mahasiswa.prodi,
          listMahasiswa: [{
            nama: mahasiswa.nama,
            nim: mahasiswa.nim,
            prodi: mahasiswa.prodi,
            dosen: mahasiswa.dosenPembimbingMagang.nama,
            tanggal: new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(bimbingan.tanggal)),
            pokokBahasan: bimbingan.deskripsi,
          }]
        });
      }

      return acc;
    }, []);

    const logbookBulananNew = await this.prisma.rekapKegiatanBulanan.findMany({
      where: {
        mahasiswaId: {
          in: mahasiswa.map(value => value.mahasiswaId)
        },
        mahasiswa: {
          user: {
            tahunAjaranId: year.tahunAjaranId
          }
        }
      },
      include: {
        mahasiswa: {
          select: {
            prodi: true,
            nama: true,
            nim: true,
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
        RekapKegiatanBulananTipeKegiatan: {
        include: {
          tipeKegiatan:  {
            select: {
              kegiatanHarian:  {
                select: {
                  tim: true,
                },
              }
            },
      }
        },
      }
      }
    })

    const groupedLogbookBulanan = logbookBulananNew.reduce((acc, logbook, index) => {
      const mahasiswa = logbook.mahasiswa;
      const rekapKegiatan = logbook.RekapKegiatanBulananTipeKegiatan;

      const date = new Date(logbook.tanggalAwal);
      const bulan = date.toLocaleString('default', { month: 'long' });
      const bulanIndex = date.getMonth(); // index 0–11
      const prodi = mahasiswa.prodi;

      const existingGroup = acc.find(
        item => item.prodi === prodi && item.bulan === bulan
      );

      const mappedMahasiswa = rekapKegiatan.map(value => ({
        nama: mahasiswa.nama,
        nim: mahasiswa.nim,
        prodi,
        satker: mahasiswa.penempatan?.[0]?.satker?.nama || '',
        bulan,
        kegiatan: value.uraian,
        tim: value.tipeKegiatan?.kegiatanHarian?.[0]?.tim || '-' ,
        kualitas: value.tingkatKualitas
      }));

      if (existingGroup) {
        existingGroup.listMahasiswa.push(...mappedMahasiswa);
      } else {
        acc.push({
          index,
          prodi,
          bulan,
          bulanIndex, // kunci urut bulan
          listMahasiswa: mappedMahasiswa
        });
      }

      return acc;
    }, []);

    // 🔥 Sort: bulan ASC ➜ prodi ASC
    groupedLogbookBulanan.sort((a, b) => {
      if (a.bulanIndex !== b.bulanIndex) {
        return a.bulanIndex - b.bulanIndex; // bulan dulu
      }
      return a.prodi.localeCompare(b.prodi); // kalau bulan sama ➜ prodi
    });

    const penilaian = await this.prisma.penilaian.findMany({
      where: {
        mahasiswaId: {
          in: mahasiswa.map(value => value.mahasiswaId)
        },
      },
      include: {
        mahasiswa: true
      }
    })

    function hitungRataRataVar(data: any[], penilianId: number): number {
      // console.log("Data yang dikirim:", data);
      
      const dataFiltered = data.filter(item => item.penilianId === penilianId);
      // console.log("data sebelum rata", dataFiltered)

      let total = 0;
      const totalData = dataFiltered.length;

      dataFiltered.forEach(item => {
        for (let i = 1; i <= 10; i++) {
          total += item[`var${i}`] ?? 0;
          // console.log(i,total,item[`var${i}`])
        }
      });

      return totalData > 0 ? total / (totalData * 10) : 0;
    };

    function hitungRataRataKinerja(data: any[], penilianId: number): number {
      const dataFiltered = data.filter(item => item.penilianId === penilianId);
      const fields = [
        'initiatif',
        'disiplin',
        'ketekunan',
        'kemampuanBerfikir',
        'kemampuanBeradaptasi',
        'komunikasi',
        'penampilan',
        'teknikal',
        'kerjasama',
        'hasil'
      ];

      let total = 0;
      const totalData = dataFiltered.length;

      dataFiltered.forEach(item => {
        fields.forEach(field => {
          total += item[field] ?? 0;
        });
      });

      return totalData > 0 ? total / (totalData * fields.length) : 0;
    }

    function hitungRataRataBimbingan(data: any[], penilianId: number): number {
      // console.log("Data yang dikirim:", data);
      
      const dataFiltered = data.filter(item => item.penilianId === penilianId);
      // console.log("data sebelum rata", dataFiltered);
    
      let total = 0;
      const totalData = dataFiltered.length;
    
      // Nama-nama variabel yang ada dalam data
      const fields = [
        'inisiatif',
        'disiplin',
        'ketekunan',
        'kemampuanBerfikir',
        'komunikasi'
      ];
    
      // Menghitung total dari semua variabel untuk setiap data
      dataFiltered.forEach(item => {
        fields.forEach(field => {
          total += item[field] ?? 0; // Tambahkan nilai, jika tidak ada set nilai 0
          // console.log(field, total, item[field]);  // Debug: Print nama variabel dan nilai
        });
      });
    
      // Rata-rata = total nilai / (jumlah data * jumlah variabel)
      const rataRata = total / (totalData * fields.length); // fields.length = jumlah variabel (5)
      return rataRata;
    }
    

    const penilianIds = penilaian.map(value => value.penilianId);

    const [nilaiLapPemlap, nilaiLapDosen, nilaiKinerja, nilaiBimbingan] = await Promise.all([
      this.prisma.penilaianLaporanPemlap.findMany({ where: { penilianId: { in: penilianIds } } }),
      this.prisma.penilaianLaporanDosen.findMany({ where: { penilianId: { in: penilianIds } } }),
      this.prisma.penilaianKinerja.findMany({ where: { penilianId: { in: penilianIds } } }),
      this.prisma.penilaianBimbingan.findMany({ where: { penilianId: { in: penilianIds } } })
    ]);

    const hasilPenilaian = penilaian.map(value => ({
      nim: value.mahasiswa.nim,
      nama: value.mahasiswa.nama,
      prodi: value.mahasiswa.prodi,
      kelas: value.mahasiswa.kelas,
      nilaiKinerja: parseFloat(hitungRataRataKinerja(nilaiKinerja, value.penilianId).toFixed(2)),
      nilaiPemlap: parseFloat(hitungRataRataVar(nilaiLapPemlap, value.penilianId).toFixed(2)),
      nilaiBimbingan: parseFloat(hitungRataRataBimbingan(nilaiBimbingan, value.penilianId).toFixed(2)),
      nilaiDosen: parseFloat(hitungRataRataVar(nilaiLapDosen, value.penilianId).toFixed(2)),
      nilaiAkhir: parseFloat(
        (
          (hitungRataRataKinerja(nilaiKinerja, value.penilianId) * 0.3) +
          (hitungRataRataVar(nilaiLapPemlap, value.penilianId) * 0.2) +
          (hitungRataRataBimbingan(nilaiBimbingan, value.penilianId) * 0.2) +
          (hitungRataRataVar(nilaiLapDosen, value.penilianId) * 0.3)
        ).toFixed(2) 
      )
    }));

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const presensiMahasiswa = await this.prisma.mahasiswa.findMany({
      where: {
        user: {
          tahunAjaranId: year?.tahunAjaranId
        },
      },
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

    // Fungsi hitung bobot berdasarkan sumber data (blm dipake)
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

    const resultPresensi = presensiMahasiswa.map((mhs) => {
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


    const penempatanSatker = await this.prisma.satker.findMany({
      where: {
        mahasiswa: {
          some: {
            user: {
              tahunAjaranId: year.tahunAjaranId
            }
          }
        }
      },
      include: {
        mahasiswa: true,
        provinsi: true
      }
    })

    const groupingMhsOnSatker = penempatanSatker.map((satker) => {
      // console.log("penempatan satker:",penempatanSatker)
      // console.log("mahasiswa:", satker.mahasiswa);
      const count1 = satker.mahasiswa.filter((value) => value.prodi === 'DIV ST').length
      const count2 = satker.mahasiswa.filter((value) => value.prodi === 'DIV KS').length
      const count3 = satker.mahasiswa.filter((value) => value.prodi === 'DIII ST').length
      const jumlahTotal = count1 + count2 + count3

      const satkerGroup = {
        kodeSatker: satker.kodeSatker,
        satkerId: satker.satkerId,
        satkerName: satker.nama,
        provinsi: satker.provinsi.nama,
        count1,
        count2,
        count3,
        jumlahTotal
      };

      return satkerGroup;
    });

    return {
      data: {
        biodata_mahasiswa: mahasiswa,
        penempatan: {
          seluruhMahasiswa: penempatan,
          seluruhSatker: groupingMhsOnSatker
        },
        presensi: resultPresensi,
        logbookBulanan: groupedLogbookBulanan,
        kartu_bimbingan: groupedByProdis,
        penilaian: hasilPenilaian
      }
    }
  }

  // async create(payload: any) {
  //   const groupId = Math.floor(1000 + Math.random() * 9000);
  //   Promise.all(payload.roleIds.map(async (value) => {
  //     await this.prisma.pengumuman.create({
  //       data: {
  //         roleId: Number(value),
  //         judul: payload.judul,
  //         deskripsi: payload.isi,
  //         groupId: groupId
  //       }
  //     })
  //   }))


  //   return {
  //     status: "Sukses",
  //     message: "Berhasil membuat pengumuman"
  //   }
  // }

  // async delete(groupId: any) {
  //   const pengumuman = await this.prisma.pengumuman.findMany({
  //     where: {
  //       groupId: Number(groupId)
  //     }
  //   })

  //   await this.prisma.pengumuman.deleteMany({
  //     where: {
  //       id: {
  //         in: pengumuman.map(value => value.id)
  //       }
  //     }
  //   })


  //   return {
  //     status: "Sukses",
  //     message: "Berhasil menghapus pengumuman"
  //   }
  // }
}