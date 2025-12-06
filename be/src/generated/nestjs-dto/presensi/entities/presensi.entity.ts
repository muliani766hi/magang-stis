
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class Presensi {
  presensiId: number ;
tanggal: Date ;
waktuDatang: Date  | null;
waktuPulang: Date  | null;
status: string ;
jumlahJamKerja: number  | null;
statusJamKerja: string  | null;
durasiJamKerja: number  | null;
bobotKetidakHadiran: number  | null;
mahasiswaId: number ;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
}
