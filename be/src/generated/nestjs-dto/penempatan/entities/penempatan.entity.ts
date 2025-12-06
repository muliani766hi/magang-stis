
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {Satker} from '../../satker/entities/satker.entity'


export class Penempatan {
  id: number ;
mahasiswaId: number ;
satkerId: number ;
createdAt: Date  | null;
updatedAt: Date  | null;
mahasiswa?: Mahasiswa ;
satker?: Satker ;
}
