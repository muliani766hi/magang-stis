
import { Satker } from '../satker/satker.entity'
import { TahunAjaran } from '../../../tahun-ajaran/dto/tahunAjaran.entity'


export class KapasitasSatkerTahunAjaran {
  kapasitasId: number;
  satker?: Satker;
  satkerId: number;
  tahunAjaran?: TahunAjaran;
  tahunAjaranId: number;
  kapasitas: number | null;
}
