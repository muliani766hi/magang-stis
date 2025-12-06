
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {PenilaianBimbingan} from '../../penilaianBimbingan/entities/penilaianBimbingan.entity'
import {PenilaianKinerja} from '../../penilaianKinerja/entities/penilaianKinerja.entity'
import {PenilaianLaporanDosen} from '../../penilaianLaporanDosen/entities/penilaianLaporanDosen.entity'
import {PenilaianLaporanPemlap} from '../../penilaianLaporanPemlap/entities/penilaianLaporanPemlap.entity'


export class Penilian {
  penilianId: number ;
mahasiswa?: Mahasiswa ;
mahasiswaId: number ;
PenilaianBimbingan?: PenilaianBimbingan  | null;
PenilaianKinerja?: PenilaianKinerja  | null;
PenilaianLaporanDosen?: PenilaianLaporanDosen  | null;
PenilaianLaporanPemlap?: PenilaianLaporanPemlap  | null;
}
