
import {BimbinganMagang} from '../../bimbinganMagang/entities/bimbinganMagang.entity'
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class PesertaBimbinganMahasiswa {
  pesertaBimbinganMagangId: number ;
bimbinganId: number ;
mahasiswaId: number ;
createdAt: Date ;
updatedAt: Date ;
bimbingan?: BimbinganMagang ;
mahasiswa?: Mahasiswa ;
}
