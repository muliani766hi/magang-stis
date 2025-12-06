
import {Satker} from '../../satker/entities/satker.entity'
import {TahunAjaran} from '../../tahunAjaran/entities/tahunAjaran.entity'


export class KapasitasSatkerTahunAjaran {
  kapasitasId: number ;
satkerId: number ;
tahunAjaranId: number ;
kapasitas: number  | null;
satker?: Satker ;
tahunAjaran?: TahunAjaran ;
}
