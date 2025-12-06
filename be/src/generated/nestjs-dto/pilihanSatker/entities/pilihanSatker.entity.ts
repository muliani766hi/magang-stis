
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {Satker} from '../../satker/entities/satker.entity'


export class PilihanSatker {
  pilihanSatkerId: number ;
mahasiswaId: number ;
satkerId: number ;
status: string ;
konfirmasiTimMagang: boolean ;
isActive: boolean ;
prioritas: number ;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
satker?: Satker ;
}
