
import { Mahasiswa } from '../../../mahasiswa/dto/mahasiswa.entity'
import { PenilaianBimbingan } from '../penilaianBimbingan/penilaianBimbingan.entity'
import { PenilaianKinerja } from '../penilaianKinerja/penilaianKinerja.entity'
import { PenilaianLaporanDosen } from '../penilaianLaporanDosen/penilaianLaporanDosen.entity'
import { PenilaianLaporanPemlap } from '../penilaianLaporanPemlap/penilaianLaporanPemlap.entity'


export class Penilian {
  penilianId: number;
  mahasiswa?: Mahasiswa;
  mahasiswaId: number;
  PenilaianBimbingan?: PenilaianBimbingan | null;
  PenilaianKinerja?: PenilaianKinerja | null;
  PenilaianLaporanDosen?: PenilaianLaporanDosen | null;
  PenilaianLaporanPemlap?: PenilaianLaporanPemlap | null;
}
