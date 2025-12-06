
import {Roles} from '../../roles/entities/roles.entity'
import {Permissions} from '../../permissions/entities/permissions.entity'


export class PermissionRoles {
  id: number ;
role?: Roles ;
roleId: number ;
permission?: Permissions ;
permissionId: number ;
}
