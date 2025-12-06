
import { Mahasiswa } from '../../../mahasiswa/dto/mahasiswa.entity'


export class RekapKegiatanBulanan {
  rekapId: number;
  periode: string;
  uraian: string;
  satuan: string;
  target: number;
  realisasi: number;
  persentase: number;
  tingkatKualitas: number | null;
  keterangan: string | null;
  mahasiswa?: Mahasiswa;
  mahasiswaId: number;
  createdAt: Date;
  updatedAt: Date;
}
