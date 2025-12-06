
import { User } from '../../users/dto/users/user.entity'
import { Mahasiswa } from '../../mahasiswa/dto/mahasiswa.entity'
import { BimbinganMagang } from '../../bimbingan-magang/dto/bimbingan-magang/bimbinganMagang.entity'


export class DosenPembimbingMagang {
  dosenId: number;
  nip: string;
  nama: string;
  prodi: string;
  user?: User;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  mahasiswa?: Mahasiswa[];
  bimbinganMagang?: BimbinganMagang[];
}
