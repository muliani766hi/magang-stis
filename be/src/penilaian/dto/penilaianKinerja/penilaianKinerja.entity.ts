
import { Penilian } from '../penilian/penilian.entity'


export class PenilaianKinerja {
  penilaianKinerjaId: number;
  penilaian?: Penilian;
  penilianId: number;
  initiatif: number;
  disiplin: number;
  ketekunan: number;
  kemampuanBerfikir: number;
  kemampuanBeradaptasi: number;
  komunikasi: number;
  penampilan: number;
  teknikal: number;
  kerjasama: number;
  hasil: number;
  createdAt: Date;
  updatedAt: Date;
}
