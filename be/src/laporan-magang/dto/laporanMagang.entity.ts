
import { Mahasiswa } from "../../mahasiswa/dto/mahasiswa.entity";


export class LaporanMagang {
  laporanId: number ;
mahasiswa?: Mahasiswa ;
mahasiswaId: number ;
tanggal: Date  | null;
komentar: string  | null;
jumlahPenonton: number  | null;
lokasiPresentasi: string  | null;
metodePresentasi: string  | null;
fileLaporan: string  | null;
createdAt: Date ;
updatedAt: Date ;
}
