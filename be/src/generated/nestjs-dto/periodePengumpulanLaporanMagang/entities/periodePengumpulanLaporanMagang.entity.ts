
import {TahunAjaran} from '../../tahunAjaran/entities/tahunAjaran.entity'


export class PeriodePengumpulanLaporanMagang {
  periodePengumpulanLaporanMagangId: number ;
tahunAjaranId: number ;
tanggalMulai: Date ;
tanggalAkhir: Date ;
createdAt: Date ;
updatedAt: Date ;
tahunAjaran?: TahunAjaran ;
}
