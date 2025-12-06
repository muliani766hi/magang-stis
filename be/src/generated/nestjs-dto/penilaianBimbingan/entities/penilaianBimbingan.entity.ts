
import {Penilaian} from '../../penilaian/entities/penilaian.entity'


export class PenilaianBimbingan {
  penilaianBimbinganId: number ;
penilianId: number ;
inisiatif: number ;
disiplin: number ;
ketekunan: number ;
kemampuanBerfikir: number ;
komunikasi: number ;
createdAt: Date ;
updatedAt: Date ;
penilaian?: Penilaian ;
}
