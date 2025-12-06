
import { Mahasiswa } from "src/mahasiswa/dto/mahasiswa.entity";


export class IzinPresensi {
  izinId: number ;
tanggal: Date ;
waktu: Date ;
keterangan: string ;
mahasiswa?: Mahasiswa ;
mahasiswaId: number ;
createdAt: Date  | null;
updatedAt: Date  | null;
}
