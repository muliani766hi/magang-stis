
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'


export class DokumenTranslok {
  id: number ;
bulan: Date  | null;
fileDokumenTranslok: string  | null;
mahasiswaId: number ;
status: string  | null;
catatan: string  | null;
updateKe: number ;
update: Date ;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
}
