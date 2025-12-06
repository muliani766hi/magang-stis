
import {Roles} from '../../roles/entities/roles.entity'


export class AccesAlokasiMagang {
  id: number ;
status: boolean ;
roleId: number ;
createdAt: Date ;
updatedAt: Date ;
role?: Roles ;
}
