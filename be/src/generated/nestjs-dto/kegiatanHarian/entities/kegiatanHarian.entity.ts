
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {TipeKegiatan} from '../../tipeKegiatan/entities/tipeKegiatan.entity'


export class KegiatanHarian {
  kegiatanId: number ;
tanggal: Date ;
deskripsi: string ;
volume: number ;
durasi: number ;
pemberiTugas: string ;
statusPenyelesaian: number ;
isFinal: boolean ;
mahasiswaId: number ;
tipeKegiatanId: number  | null;
tim: string  | null;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
tipeKegiatan?: TipeKegiatan  | null;
}
