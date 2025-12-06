
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class LaporanMagang {
  laporanId: number ;
mahasiswaId: number ;
tanggal: Date  | null;
fileLaporan: string  | null;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
}
