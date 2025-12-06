
import { User } from '../../users/dto/users/user.entity'
import { KapasitasSatkerTahunAjaran } from '../../satker/dto/kapasitas-satker-tahun-ajaran/kapasitasSatkerTahunAjaran.entity'


export class TahunAjaran {
  tahunAjaranId: number;
  tahun: string;
  isActive: boolean;
  user?: User[];
  kapasitasSatkerTahunAjaran?: KapasitasSatkerTahunAjaran[];
}
