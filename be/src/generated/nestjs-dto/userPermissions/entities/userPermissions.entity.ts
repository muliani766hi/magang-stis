
import {User} from '../../user/entities/user.entity'
import {Permissions} from '../../permissions/entities/permissions.entity'


export class UserPermissions {
  id: number ;
user?: User ;
userId: number ;
permission?: Permissions ;
permissionId: number ;
}
