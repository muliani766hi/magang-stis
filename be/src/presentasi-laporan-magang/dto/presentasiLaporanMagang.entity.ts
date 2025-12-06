
import { LaporanMagang } from '../../laporan-magang/dto/laporanMagang.entity';


export class PresentasiLaporanMagang {
  presentasiId: number ;
laporanId: number ;
tanggal: Date  | null;
jumlahPenonton: number  | null;
lokasiPresentasi: string  | null;
metodePresentasi: string  | null;
fileDraftLaporanMagang: string  | null;
createdAt: Date ;
updatedAt: Date ;
laporan?: LaporanMagang ;
}
