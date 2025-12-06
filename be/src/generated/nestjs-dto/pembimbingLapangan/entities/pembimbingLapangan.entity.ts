
import {User} from '../../user/entities/user.entity'
import {Satker} from '../../satker/entities/satker.entity'
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class PembimbingLapangan {
  pemlapId: number ;
userId: number ;
satkerId: number ;
nip: string ;
nama: string ;
user?: User ;
satker?: Satker ;
mahasiswa?: Mahasiswa[] ;
}
