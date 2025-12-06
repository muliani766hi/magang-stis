
import {User} from '../../user/entities/user.entity'
import {Satker} from '../../satker/entities/satker.entity'


export class AdminSatker {
  adminSatkerId: number ;
satkerId: number  | null;
userId: number ;
nama: string ;
nip: string ;
user?: User ;
satker?: Satker  | null;
}
