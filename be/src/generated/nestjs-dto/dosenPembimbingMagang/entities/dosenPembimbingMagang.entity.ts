
import {User} from '../../user/entities/user.entity'
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {BimbinganMagang} from '../../bimbinganMagang/entities/bimbinganMagang.entity'


export class DosenPembimbingMagang {
  dosenId: number ;
userId: number ;
nip: string ;
nama: string ;
prodi: string ;
createdAt: Date ;
updatedAt: Date ;
user?: User ;
mahasiswa?: Mahasiswa[] ;
bimbinganMagang?: BimbinganMagang[] ;
}
