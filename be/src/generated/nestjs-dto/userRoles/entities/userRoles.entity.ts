
import {User} from '../../user/entities/user.entity'
import {Roles} from '../../roles/entities/roles.entity'


export class UserRoles {
  id: number ;
userId: number ;
roleId: number ;
user?: User ;
role?: Roles ;
}
