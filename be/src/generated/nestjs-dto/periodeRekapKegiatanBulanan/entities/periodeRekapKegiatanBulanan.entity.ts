
import {TahunAjaran} from '../../tahunAjaran/entities/tahunAjaran.entity'
import {RekapKegiatanBulanan} from '../../rekapKegiatanBulanan/entities/rekapKegiatanBulanan.entity'


export class PeriodeRekapKegiatanBulanan {
  periodeRekapId: number ;
tahunAjaranId: number ;
tanggalAwal: Date ;
tanggalAkhir: Date ;
prodi: string ;
createdAt: Date ;
updatedAt: Date ;
tahunAjaran?: TahunAjaran ;
RekapKegiatanBulanan?: RekapKegiatanBulanan[] ;
}
