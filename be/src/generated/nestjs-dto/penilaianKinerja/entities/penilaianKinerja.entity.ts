
import {Penilaian} from '../../penilaian/entities/penilaian.entity'


export class PenilaianKinerja {
  penilaianKinerjaId: number ;
penilianId: number ;
initiatif: number ;
disiplin: number ;
ketekunan: number ;
kemampuanBerfikir: number ;
kemampuanBeradaptasi: number ;
komunikasi: number ;
penampilan: number ;
teknikal: number ;
kerjasama: number ;
hasil: number ;
createdAt: Date ;
updatedAt: Date ;
penilaian?: Penilaian ;
}
