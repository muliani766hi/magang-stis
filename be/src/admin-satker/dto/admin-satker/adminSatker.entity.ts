
import { User } from '../../../users/dto/users/user.entity'
import { Satker } from '../../../satker/dto/satker/satker.entity'

export class AdminSatker {
  adminSatkerId: number;
  user?: User;
  userId: number;
  satker?: Satker | null;
}
