
import {Roles} from '../../roles/entities/roles.entity'


export class Pengumuman {
  id: number ;
judul: string ;
deskripsi: string ;
roleId: number ;
groupId: number ;
createdAt: Date ;
updatedAt: Date ;
role?: Roles ;
}
