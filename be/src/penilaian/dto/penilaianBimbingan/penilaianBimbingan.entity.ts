
import { Penilian } from '../penilian/penilian.entity'


export class PenilaianBimbingan {
  penilaianBimbinganId: number;
  penilaian?: Penilian;
  penilianId: number;
  inisiatif: number;
  disiplin: number;
  ketekunan: number;
  kemampuanBerfikir: number;
  komunikasi: number;
  createdAt: Date;
  updatedAt: Date;
}
