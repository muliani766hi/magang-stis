
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {PenilaianBimbingan} from '../../penilaianBimbingan/entities/penilaianBimbingan.entity'
import {PenilaianKinerja} from '../../penilaianKinerja/entities/penilaianKinerja.entity'
import {PenilaianLaporanDosen} from '../../penilaianLaporanDosen/entities/penilaianLaporanDosen.entity'
import {PenilaianLaporanPemlap} from '../../penilaianLaporanPemlap/entities/penilaianLaporanPemlap.entity'


export class Penilaian {
  penilianId: number ;
mahasiswaId: number ;
mahasiswa?: Mahasiswa ;
PenilaianBimbingan?: PenilaianBimbingan  | null;
PenilaianKinerja?: PenilaianKinerja  | null;
PenilaianLaporanDosen?: PenilaianLaporanDosen  | null;
PenilaianLaporanPemlap?: PenilaianLaporanPemlap  | null;
}
