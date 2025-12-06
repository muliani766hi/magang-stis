
import {RekapKegiatanBulanan} from '../../rekapKegiatanBulanan/entities/rekapKegiatanBulanan.entity'
import {TipeKegiatan} from '../../tipeKegiatan/entities/tipeKegiatan.entity'


export class RekapKegiatanBulananTipeKegiatan {
  rekapTipeId: number ;
rekapId: number ;
tipeKegiatanId: number ;
uraian: string ;
target: number ;
realisasi: number ;
persentase: number ;
tingkatKualitas: number  | null;
keterangan: string  | null;
createdAt: Date ;
updatedAt: Date ;
rekapKegiatan?: RekapKegiatanBulanan ;
tipeKegiatan?: TipeKegiatan ;
}
