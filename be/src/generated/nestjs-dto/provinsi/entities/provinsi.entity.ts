
import {AdminProvinsi} from '../../adminProvinsi/entities/adminProvinsi.entity'
import {Satker} from '../../satker/entities/satker.entity'
import {KabupatenKota} from '../../kabupatenKota/entities/kabupatenKota.entity'
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class Provinsi {
  provinsiId: number ;
nama: string ;
kodeProvinsi: string ;
adminProvinsi?: AdminProvinsi  | null;
satker?: Satker[] ;
kabupatenKota?: KabupatenKota[] ;
mahasiswaWali?: Mahasiswa[] ;
}
