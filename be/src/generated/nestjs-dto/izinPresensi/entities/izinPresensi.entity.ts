
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class IzinPresensi {
  izinId: number ;
tanggal: Date  | null;
keterangan: string  | null;
jenisIzin: string  | null;
fileBukti: string  | null;
status: string  | null;
mahasiswaId: number ;
createdAt: Date  | null;
updatedAt: Date  | null;
mahasiswa?: Mahasiswa ;
}
