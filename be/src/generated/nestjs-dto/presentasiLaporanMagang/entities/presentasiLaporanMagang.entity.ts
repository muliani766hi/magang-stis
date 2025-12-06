
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class PresentasiLaporanMagang {
  presentasiId: number ;
mahasiswaId: number ;
tanggal: Date  | null;
jumlahPenonton: number  | null;
lokasiPresentasi: string  | null;
metodePresentasi: string  | null;
fileDraftLaporanMagang: string  | null;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
}
