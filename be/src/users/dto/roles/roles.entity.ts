
import { UserRoles } from '../user-roles/userRoles.entity'


export class Roles {
  roleId: number;
  roleName: string;
  userRoles?: UserRoles[];
}
