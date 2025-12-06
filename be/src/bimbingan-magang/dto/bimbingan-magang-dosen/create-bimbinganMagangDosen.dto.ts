import { DosenPembimbingMagang } from "../../../dosen-pembimbing-magang/dto/dosenPembimbingMagang.entity";
import { PesertaBimbinganMahasiswa } from "../peserta-bimbingan-mahasiswa/pesertaBimbinganMahasiswa.entity";

export class CreateBimbinganMagangDosenDto {
  bimbinganId: number;
  tanggal: Date;
  status: string;
  tempat: string | null;
  deskripsi: string | null;
  dosenPembimbingMagang?: DosenPembimbingMagang;
  dosenId: number;
  createdAt: Date;
  updatedAt: Date;
  pesertaBimbinganMahasiswa?: PesertaBimbinganMahasiswa[];
}
