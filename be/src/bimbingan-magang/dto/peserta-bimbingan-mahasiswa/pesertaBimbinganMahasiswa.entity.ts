
import { BimbinganMagang } from '../bimbingan-magang/bimbinganMagang.entity'
import { Mahasiswa } from '../../../mahasiswa/dto/mahasiswa.entity'


export class PesertaBimbinganMahasiswa {
  pesertaBimbinganMagangId: number;
  bimbingan?: BimbinganMagang;
  bimbinganId: number;
  mahasiswa?: Mahasiswa;
  mahasiswaId: number;
  createdAt: Date;
  updatedAt: Date;
}
