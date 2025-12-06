
import { AdminProvinsi } from '../../admin-provinsi/dto/adminProvinsi.entity'
import { Satker } from '../../satker/dto/satker/satker.entity'
import { KabupatenKota } from '../../satker/dto/kabupaten-kota/kabupatenKota.entity'


export class Provinsi {
  provinsiId: number;
  nama: string;
  kodeProvinsi: string;
  adminProvinsi?: AdminProvinsi | null;
  satker?: Satker[];
  kabupatenKota?: KabupatenKota[];
}
