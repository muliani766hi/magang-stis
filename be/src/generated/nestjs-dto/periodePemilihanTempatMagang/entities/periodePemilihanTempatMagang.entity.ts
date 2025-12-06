
import {TahunAjaran} from '../../tahunAjaran/entities/tahunAjaran.entity'


export class PeriodePemilihanTempatMagang {
  periodePemilihanTempatMagangId: number ;
tahunAjaranId: number ;
tanggalMulai: Date ;
tanggalAkhir: Date ;
createdAt: Date ;
updatedAt: Date ;
tahunAjaran?: TahunAjaran ;
}
