
import { User } from '../../users/dto/users/user.entity'
import { Provinsi } from '../../provinsi/dto/provinsi.entity'
import { Satker } from '../../satker/dto/satker/satker.entity'


export class AdminProvinsi {
  adminProvinsiId: number;
  user?: User;
  userId: number;
  provinsi?: Provinsi;
  provinsiId: number;
  satker?: Satker[];
}
