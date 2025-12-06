
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class IzinBimbinganSkripsi {
  izinBimbinganId: number ;
tanggal: Date ;
jamMulai: Date ;
jamSelesai: Date ;
keterangan: string ;
mahasiswaId: number ;
mahasiswa?: Mahasiswa ;
createdAt: Date ;
updatedAt: Date ;
}
