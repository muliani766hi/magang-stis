
import { User } from '../../users/dto/users/user.entity'
import { Satker } from '../../satker/dto/satker/satker.entity'
import { Mahasiswa } from '../../mahasiswa/dto/mahasiswa.entity'


export class PembimbingLapangan {
  pemlapId: number;
  nip: string;
  nama: string;
  user?: User;
  userId: number;
  satker?: Satker;
  satkerId: number;
  mahasiswa?: Mahasiswa[];
}
