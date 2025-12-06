
import { User } from '../users/user.entity'
import { Roles } from '../roles/roles.entity'


export class UserRoles {
  id: number;
  user?: User;
  userId: number;
  role?: Roles;
  roleId: number;
}
