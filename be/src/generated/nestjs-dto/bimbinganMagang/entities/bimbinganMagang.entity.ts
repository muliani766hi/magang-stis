
import {DosenPembimbingMagang} from '../../dosenPembimbingMagang/entities/dosenPembimbingMagang.entity'
import {PesertaBimbinganMahasiswa} from '../../pesertaBimbinganMahasiswa/entities/pesertaBimbinganMahasiswa.entity'


export class BimbinganMagang {
  bimbinganId: number ;
dosenId: number ;
tanggal: Date ;
status: string ;
tempat: string ;
deskripsi: string  | null;
createdAt: Date ;
updatedAt: Date ;
dosenPembimbingMagang?: DosenPembimbingMagang ;
PesertaBimbinganMahasiswa?: PesertaBimbinganMahasiswa[] ;
}
