
import { DosenPembimbingMagang } from '../../dosen-pembimbing-magang/dto/dosenPembimbingMagang.entity'
import { PembimbingLapangan } from '../../pembimbing-lapangan/dto/pembimbingLapangan.entity'
import { User } from '../../users/dto/users/user.entity'
import { Satker } from '../../satker/dto/satker/satker.entity'
import { Presensi } from '../../presensi/dto/presensi.entity'
import { TipeKegiatan } from '../../kegiatan-harian/dto/tipe-kegiatan/tipeKegiatan.entity'
// import { IzinPresensi } from '../../generated/nestjs-dto/izinPresensi.entity'
import { KegiatanHarian } from '../../kegiatan-harian/dto/kegiatan-harian/kegiatanHarian.entity'
import { RekapKegiatanBulanan } from '../../kegiatan-bulanan/dto/rekap-kegiatan-bulanan/rekapKegiatanBulanan.entity'
import { IzinBimbinganSkripsi } from '../../bimbingan-skripsi/dto/izinBimbinganSkripsi.entity'
import { PesertaBimbinganMahasiswa } from '../../bimbingan-magang/dto/peserta-bimbingan-mahasiswa/pesertaBimbinganMahasiswa.entity'

export class Mahasiswa {
  mahasiswaId?: number;
  nim: string;
  nama: string;
  prodi: string;
  kelas: string;
  alamat: string;
  nomorRekening: string | null;
  dosenPembimbingMagang?: DosenPembimbingMagang | null;
  dosenId: number | null;
  pembimbingLapangan?: PembimbingLapangan | null;
  pemlapId: number | null;
  user?: User | null;
  userId: number | null;
  satker?: Satker | null;
  satkerId: number | null;
  createdAt: Date;
  updatedAt: Date;
  presensi?: Presensi[];
  tipeKegiatan?: TipeKegiatan[];
  // izinPresensi?: IzinPresensi[];
  kegiatanHarian?: KegiatanHarian[];
  rekapKegiatanBulanan?: RekapKegiatanBulanan[];
  izinBimbinganSkripsi?: IzinBimbinganSkripsi[];
  pesertaBimbinganMagang?: PesertaBimbinganMahasiswa[];
}
