
import {TahunAjaran} from '../../tahunAjaran/entities/tahunAjaran.entity'
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {AdminSatker} from '../../adminSatker/entities/adminSatker.entity'
import {AdminProvinsi} from '../../adminProvinsi/entities/adminProvinsi.entity'
import {PembimbingLapangan} from '../../pembimbingLapangan/entities/pembimbingLapangan.entity'
import {DosenPembimbingMagang} from '../../dosenPembimbingMagang/entities/dosenPembimbingMagang.entity'
import {UserRoles} from '../../userRoles/entities/userRoles.entity'
import {Kabag} from '../../kabag/entities/kabag.entity'


export class User {
  userId: number ;
tahunAjaranId: number ;
email: string ;
userName: string  | null;
password: string ;
createdAt: Date ;
updatedAt: Date ;
tahunAjaran?: TahunAjaran ;
mahasiswa?: Mahasiswa  | null;
adminSatker?: AdminSatker  | null;
adminProvinsi?: AdminProvinsi  | null;
pembimbingLapangan?: PembimbingLapangan  | null;
dosenPembimbingMagang?: DosenPembimbingMagang  | null;
userRoles?: UserRoles[] ;
Kabag?: Kabag  | null;
}
