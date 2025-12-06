
import {AdminSatker} from '../../adminSatker/entities/adminSatker.entity'
import {Provinsi} from '../../provinsi/entities/provinsi.entity'
import {KabupatenKota} from '../../kabupatenKota/entities/kabupatenKota.entity'
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {PilihanSatker} from '../../pilihanSatker/entities/pilihanSatker.entity'
import {Penempatan} from '../../penempatan/entities/penempatan.entity'
import {PembimbingLapangan} from '../../pembimbingLapangan/entities/pembimbingLapangan.entity'
import {KapasitasSatkerTahunAjaran} from '../../kapasitasSatkerTahunAjaran/entities/kapasitasSatkerTahunAjaran.entity'


export class Satker {
  satkerId: number ;
povinsiId: number ;
kabupatenKotaId: number  | null;
nama: string ;
kodeSatker: string ;
email: string ;
alamat: string ;
latitude: number  | null;
longitude: number  | null;
internalBPS: boolean ;
createdAt: Date ;
updatedAt: Date ;
adminSatker?: AdminSatker  | null;
provinsi?: Provinsi ;
kabupatenKota?: KabupatenKota  | null;
mahasiswa?: Mahasiswa[] ;
pilihanSatker?: PilihanSatker[] ;
penempatan?: Penempatan[] ;
pembimbingLapangan?: PembimbingLapangan[] ;
kapasitasSatkerTahunAjaran?: KapasitasSatkerTahunAjaran[] ;
}
