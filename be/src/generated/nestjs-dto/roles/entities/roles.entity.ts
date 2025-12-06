
import {UserRoles} from '../../userRoles/entities/userRoles.entity'
import {AccesAlokasiMagang} from '../../accesAlokasiMagang/entities/accesAlokasiMagang.entity'
import {Pengumuman} from '../../pengumuman/entities/pengumuman.entity'


export class Roles {
  roleId: number ;
roleName: string ;
userRoles?: UserRoles[] ;
accesAlokasiMagang?: AccesAlokasiMagang[] ;
pengumuman?: Pengumuman[] ;
}
