
import { Mahasiswa } from '../../mahasiswa/dto/mahasiswa.entity'


export class Presensi {
  presensiId: number;
  tanggal: Date;
  waktuDatang: Date;
  waktuPulang: Date;
  status: string;
  mahasiswa?: Mahasiswa;
  mahasiswaId: number;
  createdAt: Date;
  updatedAt: Date;
}
