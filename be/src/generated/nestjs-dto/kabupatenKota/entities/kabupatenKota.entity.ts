
import {Provinsi} from '../../provinsi/entities/provinsi.entity'
import {Satker} from '../../satker/entities/satker.entity'
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class KabupatenKota {
  kabupatenKotaId: number ;
provinsiId: number ;
kodeKabupatenKota: string ;
nama: string ;
provinsi?: Provinsi ;
satker?: Satker  | null;
mahasiswa?: Mahasiswa[] ;
mahasiswaWali?: Mahasiswa[] ;
}
