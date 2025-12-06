
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class PresensiManual {
  presensiManualId: number ;
tanggal: Date ;
bukti: string  | null;
keterangan: string  | null;
status: string ;
mahasiswaId: number ;
disetujui: boolean ;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
}
