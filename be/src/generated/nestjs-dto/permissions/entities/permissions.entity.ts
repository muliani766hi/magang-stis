
import {PermissionRoles} from '../../permissionRoles/entities/permissionRoles.entity'
import {UserPermissions} from '../../userPermissions/entities/userPermissions.entity'


export class Permissions {
  permissionId: number ;
permissionName: string ;
permissionRoles?: PermissionRoles[] ;
userPermissions?: UserPermissions[] ;
}
