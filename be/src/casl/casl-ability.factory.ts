import {
  User,
  UserRoles,
  Satker,
  AdminProvinsi,
  AdminSatker,
  BimbinganMagang,
  DosenPembimbingMagang,
  IzinBimbinganSkripsi,
  IzinPresensi,
  KabupatenKota,
  KapasitasSatkerTahunAjaran,
  KegiatanHarian,
  Mahasiswa,
  PembimbingLapangan,
  PesertaBimbinganMahasiswa,
  PilihanSatker,
  Presensi,
  Provinsi,
  RekapKegiatanBulanan,
  Roles,
  RekapKegiatanBulananTipeKegiatan,
  TahunAjaran,
  TipeKegiatan,
  LaporanMagang,
  PenilaianBimbingan,
  PenilaianKinerja,
  PenilaianLaporanDosen,
  PenilaianLaporanPemlap,
  Penilaian,
  PeriodePemilihanTempatMagang,
  PeriodeKonfirmasiPemilihanSatker,
  PeriodePengumpulanLaporanMagang,
  PresensiManual,
  PresentasiLaporanMagang,
} from '@prisma/client';
import { PureAbility, AbilityBuilder, hkt } from '@casl/ability';
import {
  createPrismaAbility,
  PrismaQuery,
  Subjects
} from '@casl/prisma';
import { Injectable } from '@nestjs/common';
// import type { Prisma, PrismaClient } from "../../node_modules/.prisma/client";
// import { createAbilityFactory, createAccessibleByFactory, ExtractModelName, Model } from '@casl/prisma/dist/types/runtime';


//To support rule definition for all, we just need to explicitly do it:
export type AppSubjects = 'all' | Subjects<{
  UserRoles: UserRoles;
  Satker: Satker;
  User: User;
  TahunAjaran: TahunAjaran;
  AdminProvinsi: AdminProvinsi;
  AdminSatker: AdminSatker;
  BimbinganMagang: BimbinganMagang;
  DosenPembimbingMagang: DosenPembimbingMagang;
  IzinBimbinganSkripsi: IzinBimbinganSkripsi;
  IzinPresensi: IzinPresensi;
  KabupatenKota: KabupatenKota;
  KapasitasSatkerTahunAjaran: KapasitasSatkerTahunAjaran;
  KegiatanHarian: KegiatanHarian;
  Mahasiswa: Mahasiswa;
  PembimbingLapangan: PembimbingLapangan;
  PesertaBimbinganMahasiswa: PesertaBimbinganMahasiswa;
  PilihanSatker: PilihanSatker;
  Presensi: Presensi;
  Provinsi: Provinsi;
  RekapKegiatanBulanan: RekapKegiatanBulanan;
  Roles: Roles;
  RekapKegiatanBulananTipeKegiatan: RekapKegiatanBulananTipeKegiatan;
  TipeKegiatan: TipeKegiatan;
  LaporanMagang: LaporanMagang;
  PenilaianBimbingan: PenilaianBimbingan;
  PenilaianKinerja: PenilaianKinerja;
  PenilaianLaporanDosen: PenilaianLaporanDosen;
  PenilaianLaporanPemlap: PenilaianLaporanPemlap;
  Penilaian: Penilaian;
  PeriodePemilihanTempatMagang: PeriodePemilihanTempatMagang;
  PeriodeKonfirmasiPemilihanSatker: PeriodeKonfirmasiPemilihanSatker;
  PeriodePengumpulanLaporanMagang: PeriodePengumpulanLaporanMagang;
  PresensiManual: PresensiManual;
  PresentasiLaporanMagang: PresentasiLaporanMagang;
}>;

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(payload: {
    role: string;
    roleId: number;
    id: number;
  }) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    //ADMIN
    if (payload.roleId == 1) {
      can('manage', 'all', 'all');
    }

    //TIM MAGANG
    if (payload.roleId == 2) {
      can('manage', 'AdminProvinsi', 'all');
      can('manage', 'BimbinganMagang', 'all');
      can('manage', 'DosenPembimbingMagang', 'all');
      can('manage', 'RekapKegiatanBulanan', 'all');
      can('manage', 'RekapKegiatanBulananTipeKegiatan', 'all');
      can('manage', 'TipeKegiatan', 'all');
      can('manage', 'KegiatanHarian', 'all');
      can('manage', 'Mahasiswa', 'all');
      can('manage', 'PembimbingLapangan', 'all');
      can('manage', 'PilihanSatker', 'all');
      can('manage', 'Presensi', 'all');
      can('manage', 'Provinsi', 'all');
      can('manage', 'Satker', 'all');
      can('manage', 'TahunAjaran', 'all');
      can('manage', 'User', 'all');
      can('manage', 'UserRoles', 'all');
      can('manage', 'Roles', 'all');
      can('manage', 'PesertaBimbinganMahasiswa', 'all');
      can('manage', 'AdminSatker', 'all');
      can('manage', 'IzinBimbinganSkripsi', 'all');
      can('manage', 'IzinPresensi', 'all');
      can('manage', 'KabupatenKota', 'all');
      can('manage', 'KapasitasSatkerTahunAjaran', 'all');
      can('manage', 'LaporanMagang', 'all');
      can('manage', 'PenilaianBimbingan', 'all');
      can('manage', 'PenilaianKinerja', 'all');
      can('manage', 'PenilaianLaporanDosen', 'all');
      can('manage', 'PenilaianLaporanPemlap', 'all');
      can('manage', 'Penilaian', 'all');
      can('manage', 'PeriodePemilihanTempatMagang', 'all');
      can('manage', 'PeriodeKonfirmasiPemilihanSatker', 'all');
      can('manage', 'PeriodePengumpulanLaporanMagang', 'all');
      can('manage', 'PresensiManual', 'all');
      can('manage', 'PresentasiLaporanMagang', 'all');
    }

    //DOSEN
    if (payload.roleId == 3) {
      //USER
      can('manage', 'User', 'all', {
        userId: payload.id
      });

      //BIMBINGAN MAGANG
      can('manage', 'BimbinganMagang', 'all', {
        dosenPembimbingMagang: {
          userId: payload.id
        }
      });

      //DOSEN PEMBIMBING MAGANG
      can('read', 'DosenPembimbingMagang', 'all')
      can('update', 'DosenPembimbingMagang', 'all', {
        userId: payload.id
      });

      //REKAP KEGIATAN BULANAN
      can('read', 'RekapKegiatanBulanan', 'all', {
        mahasiswa: {
          dosenPembimbingMagang: {
            userId: payload.id
          }
        }
      });

      //REKAP KEGIATAN BULANAN TIPE KEGIATAN
      can('read', 'RekapKegiatanBulananTipeKegiatan', 'all', {
        rekapKegiatan: {
          mahasiswa: {
            dosenPembimbingMagang: {
              userId: payload.id
            }
          }
        }
      });

      //TIPE KEGIATAN
      can('read', 'TipeKegiatan', 'all', {
        mahasiswa: {
          dosenPembimbingMagang: {
            userId: payload.id
          }
        }
      });

      //KEGIATAN HARIAN
      can('read', 'KegiatanHarian', 'all', {
        mahasiswa: {
          dosenPembimbingMagang: {
            userId: payload.id
          }
        }
      });

      //MAHASISWA
      can('read', 'Mahasiswa', 'all', {
        dosenPembimbingMagang: {
          userId: payload.id
        }
      });

      //PENILAIAN
      can('manage', 'Penilaian', 'all', {
        mahasiswa: {
          dosenPembimbingMagang: {
            userId: payload.id
          }
        }
      });

      //PEMBIMBING LAPANGAN
      can('read', 'PembimbingLapangan', 'all', {
        mahasiswa: {
          some: {
            dosenPembimbingMagang: {
              userId: payload.id
            }
          }
        }
      });

      //PRESENSI
      can('read', 'Presensi', 'all', {
        mahasiswa: {
          dosenPembimbingMagang: {
            userId: payload.id
          }
        }
      });

      //TAHUN AJARAN
      can('read', 'TahunAjaran', 'all');

      //IZIN BIMBINGAN SKRIPSI
      can('read', 'IzinBimbinganSkripsi', 'all', {
        mahasiswa: {
          dosenPembimbingMagang: {
            userId: payload.id
          }
        }
      });

      //PRESENTASI LAPORAN MAGANG
      can('manage', 'PresentasiLaporanMagang', 'all', {
        mahasiswa: {
          dosenPembimbingMagang: {
            userId: payload.id
          }
        }
      });

      //LAPORAN MAGANG
      can('manage', 'LaporanMagang', 'all', {
        mahasiswa: {
          dosenPembimbingMagang: {
            userId: payload.id
          }
        }
      });

      cannot('delete', 'LaporanMagang', 'all');
      cannot('create', 'LaporanMagang', 'all');

      //PENILAIAN BIMBINGAN
      can('manage', 'PenilaianBimbingan', 'all', {
        penilaian: {
          mahasiswa: {
            dosenPembimbingMagang: {
              userId: payload.id
            }
          }
        }
      });

      //PENILAIAN LAPORAN DOSEN
      can('manage', 'PenilaianLaporanDosen', 'all', {
        penilaian: {
          mahasiswa: {
            dosenPembimbingMagang: {
              userId: payload.id
            }
          }
        }
      });
    }

    //PEMLAP
    if (payload.roleId == 4) {
      //USER
      can('manage', 'User', 'all', {
        userId: payload.id
      });

      //DOSEN PEMBIMBING MAGANG
      can('read', 'DosenPembimbingMagang', 'all')

      //REKAP KEGIATAN BULANAN
      can('read', 'RekapKegiatanBulanan', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      can('update', 'RekapKegiatanBulanan', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      //REKAP KEGIATAN BULANAN TIPE KEGIATAN
      can('read', 'RekapKegiatanBulananTipeKegiatan', 'all', {
        rekapKegiatan: {
          mahasiswa: {
            pembimbingLapangan: {
              userId: payload.id
            }
          }
        }
      });

      can('update', 'RekapKegiatanBulananTipeKegiatan', 'all', {
        rekapKegiatan: {
          mahasiswa: {
            pembimbingLapangan: {
              userId: payload.id
            }
          }
        }
      });

      //TIPE KEGIATAN
      can('read', 'TipeKegiatan', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      //KEGIATAN HARIAN
      can('read', 'KegiatanHarian', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      can('update', 'KegiatanHarian', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      //MAHASISWA
      can('read', 'Mahasiswa', 'all', {
        pembimbingLapangan: {
          userId: payload.id
        }
      });

      //PEMBIMBING LAPANGAN
      can('read', 'PembimbingLapangan', 'all', {
        userId: payload.id
      });

      can('update', 'PembimbingLapangan', 'all', {
        userId: payload.id
      });

      //PRESENSI
      can('read', 'Presensi', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      //IZIN PRESENSI
      can('manage', 'IzinPresensi', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      can('manage', 'PresensiManual', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      //TAHUN AJARAN
      can('read', 'TahunAjaran', 'all');

      //IZIN BIMBINGAN SKRIPSI
      can('read', 'IzinBimbinganSkripsi', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      //LAPORAN MAGANG
      can('manage', 'LaporanMagang', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      cannot('delete', 'LaporanMagang', 'all');
      cannot('create', 'LaporanMagang', 'all');

      //PRESENTASI LAPORAN MAGANG
      can('manage', 'PresentasiLaporanMagang', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      //PENILAIAN
      can('manage', 'Penilaian', 'all', {
        mahasiswa: {
          pembimbingLapangan: {
            userId: payload.id
          }
        }
      });

      //PENILAIAN KINERJA
      can('manage', 'PenilaianKinerja', 'all', {
        penilaian: {
          mahasiswa: {
            pembimbingLapangan: {
              userId: payload.id
            }
          }
        }
      });

      //PENILAIAN LAPORAN PEMLAP
      can('manage', 'PenilaianLaporanPemlap', 'all', {
        penilaian: {
          mahasiswa: {
            pembimbingLapangan: {
              userId: payload.id
            }
          }
        }
      });
    }

    //BAU
    if (payload.roleId == 5) {
      //USER
      can('manage', 'User', 'all', {
        userId: payload.id
      });

      //DOSEN PEMBIMBING MAGANG
      can('read', 'DosenPembimbingMagang', 'all')

      //MAHASISWA
      can('read', 'Mahasiswa', 'all')

      //TAHUN AJARAN
      can('read', 'TahunAjaran', 'all');
    }

    //KEUANGAN
    if (payload.roleId == 10) {
      //USER
      can('manage', 'User', 'all', {
        userId: payload.id
      });

      //DOSEN PEMBIMBING MAGANG
      can('read', 'DosenPembimbingMagang', 'all')

      //MAHASISWA
      can('read', 'Mahasiswa', 'all')

      //TAHUN AJARAN
      can('read', 'TahunAjaran', 'all');
    }    

    //BAAK
    if (payload.roleId == 6) {
      //USER
      can('manage', 'User', 'all', {
        userId: payload.id
      });

      //DOSEN PEMBIMBING MAGANG
      can('read', 'DosenPembimbingMagang', 'all')

      //MAHASISWA
      can('read', 'Mahasiswa', 'all')

      //PRESENSI
      can('read', 'Presensi', 'all')

      //TAHUN AJARAN
      can('read', 'TahunAjaran', 'all');
    }

    //ADMIN PROVINSI
    if (payload.roleId == 7) {
      //USER
      can('manage', 'User', 'all', {
        userId: payload.id
      });

      //ADMIN PROVINSI
      can('manage', 'AdminProvinsi', 'all', {
        userId: payload.id
      });

      //ADMIN SATKER
      can('manage', 'AdminSatker', 'all', {
        satker: {
          provinsi: {
            adminProvinsi: {
              userId: payload.id
            }
          }
        }
      });

      //DOSEN PEMBIMBING MAGANG
      can('read', 'DosenPembimbingMagang', 'all')

      //REKAP KEGIATAN BULANAN
      can('read', 'RekapKegiatanBulanan', 'all', {
        mahasiswa: {
          satker: {
            provinsi: {
              adminProvinsi: {
                userId: payload.id
              }
            }
          }
        }
      });

      //REKAP KEGIATAN BULANAN TIPE KEGIATAN
      can('read', 'RekapKegiatanBulananTipeKegiatan', 'all', {
        rekapKegiatan: {
          mahasiswa: {
            satker: {
              provinsi: {
                adminProvinsi: {
                  userId: payload.id
                }
              }
            }
          }
        }
      });

      //TIPE KEGIATAN
      can('read', 'TipeKegiatan', 'all', {
        mahasiswa: {
          satker: {
            provinsi: {
              adminProvinsi: {
                userId: payload.id
              }
            }
          }
        }
      });

      //KEGIATAN HARIAN
      can('read', 'KegiatanHarian', 'all', {
        mahasiswa: {
          satker: {
            provinsi: {
              adminProvinsi: {
                userId: payload.id
              }
            }
          }
        }
      });

      //MAHASISWA
      can('read', 'Mahasiswa', 'all', {
        satker: {
          provinsi: {
            adminProvinsi: {
              userId: payload.id
            }
          }
        }
      });

      can('update', 'Mahasiswa', ['satkerId'], {
        satker: {
          provinsi: {
            adminProvinsi: {
              userId: payload.id
            }
          }
        }
      });

      //PEMBIMBING LAPANGAN
      can('read', 'PembimbingLapangan', 'all', {
        mahasiswa: {
          some: {
            satker: {
              provinsi: {
                adminProvinsi: {
                  userId: payload.id
                }
              }
            }
          }
        }
      });

      //PILIHAN SATKER
      can('update', 'PilihanSatker', 'all', {
        AND: [
          {
            mahasiswa: {
              pilihanSatker: {
                some: {
                  satker: {
                    provinsi: {
                      adminProvinsi: {
                        userId: payload.id
                      }
                    }
                  }
                }
              }
            }
          },
          {
            status: 'Menunggu'
          },
          {
            isActive: false
          },
          {
            konfirmasiTimMagang: true
          }
        ]
      });

      //PRESENSI
      can('read', 'Presensi', 'all', {
        mahasiswa: {
          satker: {
            provinsi: {
              adminProvinsi: {
                userId: payload.id
              }
            }
          }
        }
      });

      //KAPASITAS SATKER TAHUN AJARAN
      can('manage', 'KapasitasSatkerTahunAjaran', 'all', {
        satker: {
          provinsi: {
            adminProvinsi: {
              userId: payload.id
            }
          }
        },
        tahunAjaran: {
          isActive: true
        }
      });

      //SATKER
      can('manage', 'Satker', 'all', {
        provinsi: {
          adminProvinsi: {
            userId: payload.id
          }
        }
      });
      
      //PROVINSI
      can('read', 'Provinsi', {
        adminProvinsi: {
          userId: payload.id
        }
      });


      //TAHUN AJARAN
      can('read', 'TahunAjaran', 'all');

      //IZIN BIMBINGAN SKRIPSI
      can('read', 'IzinBimbinganSkripsi', 'all', {
        mahasiswa: {
          satker: {
            provinsi: {
              adminProvinsi: {
                userId: payload.id
              }
            }
          }
        }
      });

      //LAPORAN MAGANG
      can('read', 'LaporanMagang', 'all', {
        mahasiswa: {
          satker: {
            provinsi: {
              adminProvinsi: {
                userId: payload.id
              }
            }
          }
        }
      });
    }

    //ADMIN SATKER
    if (payload.roleId == 8) {
      //USER
      can('manage', 'User', 'all', {
        userId: payload.id
      });

      //DOSEN PEMBIMBING MAGANG
      can('read', 'DosenPembimbingMagang', 'all')

      //REKAP KEGIATAN BULANAN
      can('read', 'RekapKegiatanBulanan', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });

      //REKAP KEGIATAN BULANAN TIPE KEGIATAN
      can('read', 'RekapKegiatanBulananTipeKegiatan', 'all', {
        rekapKegiatan: {
          mahasiswa: {
            satker: {
              adminSatker: {
                userId: payload.id
              }
            }
          }
        }
      });

      //TIPE KEGIATAN
      can('read', 'TipeKegiatan', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });

      //KEGIATAN HARIAN
      can('read', 'KegiatanHarian', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });

      //MAHASISWA
      can('read', 'Mahasiswa', 'all', {
        satker: {
          adminSatker: {
            userId: payload.id
          }
        }
      });

      can('update', 'Mahasiswa', ['pemlapId'], {
        satker: {
          adminSatker: {
            userId: payload.id
          }
        }
      });

      //PEMBIMBING LAPANGAN
      can('manage', 'PembimbingLapangan', 'all', {
        satker: {
          adminSatker: {
            userId: payload.id
          }
        }
      });

      //PRESENSI
      can('read', 'Presensi', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });

      //PRESENSI MANUAL
      can('manage', 'PresensiManual', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });

      //IZIN PRESENSI
      can('manage', 'IzinPresensi', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });

      //SATKER
      can('read', 'Satker', 'all', {
        adminSatker: {
          userId: payload.id
        }
      });

      can('update', 'Satker', ['latitude', 'longitude'], {
        adminSatker: {
          userId: payload.id
        }
      });

      //TAHUN AJARAN
      can('read', 'TahunAjaran', 'all');

      //IZIN BIMBINGAN SKRIPSI
      can('read', 'IzinBimbinganSkripsi', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });

      //LAPORAN MAGANG
      can('read', 'LaporanMagang', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });

      //PRESENTASI LAPORAN MAGANG
      can('read', 'PresentasiLaporanMagang', 'all', {
        mahasiswa: {
          satker: {
            adminSatker: {
              userId: payload.id
            }
          }
        }
      });
    }

    //MAHASISWA
    if (payload.roleId == 9) {
      //USER
      can('manage', 'User', 'all', {
        userId: payload.id
      });

      //BIMBINGAN MAGANG
      can('read', 'BimbinganMagang', 'all', {
        PesertaBimbinganMahasiswa: {
          some: {
            mahasiswa: {
              userId: payload.id
            }
          }
        }
      });

      can('create', 'BimbinganMagang', 'all', {
        PesertaBimbinganMahasiswa: {
          some: {
            mahasiswa: {
              userId: payload.id
            }
          }
        }
      })

      can('update', 'BimbinganMagang', ['tanggal', 'tempat'], {
        AND: [
          {
            PesertaBimbinganMahasiswa: {
              some: {
                mahasiswa: {
                  userId: payload.id
                }
              }
            }
          },
          {
            status: 'Menunggu'
          }
        ]
      });

      //DOSEN PEMBIMBING MAGANG
      can('read', 'DosenPembimbingMagang', 'all')

      //REKAP KEGIATAN BULANAN
      can('manage', 'RekapKegiatanBulanan', 'all', {
        mahasiswa: {
          userId: payload.id
        }
      });
      cannot('update', 'RekapKegiatanBulanan', ['isFinal']);

      //REKAP KEGIATAN BULANAN TIPE KEGIATAN
      can('manage', 'RekapKegiatanBulananTipeKegiatan', 'all', {
        rekapKegiatan: {
          mahasiswa: {
            userId: payload.id
          }
        }
      });

      cannot('update', 'RekapKegiatanBulananTipeKegiatan', 'all', {
        rekapKegiatan: {
          isFinal: true
        }
      });

      //TIPE KEGIATAN
      can('manage', 'TipeKegiatan', 'all', {
        mahasiswa: {
          userId: payload.id
        }
      });

      //KEGIATAN HARIAN
      can('manage', 'KegiatanHarian', 'all', {
        mahasiswa: {
          user: {
            userId: payload.id
          }
        }
      });

      cannot('update', 'KegiatanHarian', 'all', {
        mahasiswa: {
          userId: payload.id
        },
        isFinal: true
      });

      //MAHASISWA
      can('read', 'Mahasiswa', 'all', {
        userId: payload.id
      });

      //IZIN UPDATE MAHASISWA
      can('update', 'Mahasiswa', {
        userId: payload.id
      });

      can('read', 'Provinsi', 'all');

      can('update', 'Mahasiswa', ['alamat', 'nomorRekening'], {
        userId: payload.id
      });

      //PEMBIMBING LAPANGAN
      can('read', 'PembimbingLapangan', 'all', {
        mahasiswa: {
          some: {
            userId: payload.id
          }
        }
      });

      //PILIHAN SATKER
      can('manage', 'PilihanSatker', 'all', {
        AND: [
          {
            mahasiswa: {
              userId: payload.id
            }
          },
          {
            status: 'Menunggu'
          }
        ]
      });

      //PRESENSI
      can('manage', 'Presensi', 'all', {
        mahasiswa: {
          userId: payload.id
        }
      });

      //PRESENSI MANUAL
      can('manage', 'PresensiManual', 'all', {
        mahasiswa: {
          userId: payload.id
        }
      });

      cannot('delete', 'PresensiManual', 'all', {
        disetujui: true
      });

      //IZIN PRESENSI
      can('manage', 'IzinPresensi', 'all', {
        mahasiswa: {
          userId: payload.id
        }
      });

      //KAPASITAS SATKER TAHUN AJARAN
      can('read', 'KapasitasSatkerTahunAjaran', 'all', {
        tahunAjaran: {
          isActive: true
        }
      });

      //SATKER
      can('read', 'Satker', 'all');

      //IZIN UPDATE MAHASISWA
      can('update', 'Mahasiswa', {
        mahasiswaId: payload.id
      });

      //IZIN BIMBINGAN SKRIPSI
      can('manage', 'IzinBimbinganSkripsi', 'all', {
        mahasiswa: {
          userId: payload.id
        }
      });

      //PRESENTASI LAPORAN MAGANG
      can('manage', 'PresentasiLaporanMagang', 'all', {
        mahasiswa: {
          userId: payload.id
        }
      });

      //LAPORAN MAGANG
      can('manage', 'LaporanMagang', 'all', {
        AND: [
          {
            mahasiswa: {
              userId: payload.id
            }
          },
        ]
      });

      cannot('update', 'LaporanMagang', ['isFinalByDosen', 'isFinalByPemlap']);
    }

    return build();
  }
}