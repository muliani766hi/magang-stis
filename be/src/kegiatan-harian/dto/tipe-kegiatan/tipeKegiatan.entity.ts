
import { Mahasiswa } from '../../../mahasiswa/dto/mahasiswa.entity'
import { KegiatanHarian } from '../kegiatan-harian/kegiatanHarian.entity'


export class TipeKegiatan {
  tipeKegiatanId: number;
  nama: string;
  mahasiswa?: Mahasiswa;
  mahasiswaId: number;
  createdAt: Date;
  updatedAt: Date;
  kegiatanHarian?: KegiatanHarian[];
}
