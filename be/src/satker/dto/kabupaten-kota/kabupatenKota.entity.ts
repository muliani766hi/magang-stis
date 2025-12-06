
import { Provinsi } from '../../../provinsi/dto/provinsi.entity'
import { Satker } from '../satker/satker.entity'


export class KabupatenKota {
  kabupatenKotaId: number;
  kodeKabupatenKota: string;
  nama: string;
  provinsi?: Provinsi;
  provinsiId: number;
  satker?: Satker | null;
}
