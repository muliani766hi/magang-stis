
import { AdminProvinsi } from '../../../admin-provinsi/dto/adminProvinsi.entity'
import { AdminSatker } from '../../../admin-satker/dto/admin-satker/adminSatker.entity'
import { Provinsi } from '../../../provinsi/dto/provinsi.entity'
import { KabupatenKota } from '../kabupaten-kota/kabupatenKota.entity'
import { Mahasiswa } from '../../../mahasiswa/dto/mahasiswa.entity'
import { PembimbingLapangan } from '../../../pembimbing-lapangan/dto/pembimbingLapangan.entity'
import { KapasitasSatkerTahunAjaran } from '../kapasitas-satker-tahun-ajaran/kapasitasSatkerTahunAjaran.entity'


export class Satker {
  satkerId: number;
  nama: string;
  kodeSatker: string;
  email: string;
  alamat: string;
  internalBPS: boolean;
  adminProvinsi?: AdminProvinsi;
  adminProvinsiId: number;
  adminSatker?: AdminSatker;
  adminSatkerId: number;
  provinsi?: Provinsi;
  povinsiId: number;
  kabupatenKota?: KabupatenKota;
  kabupatenKotaId: number;
  mahasiswa?: Mahasiswa[];
  pembimbingLapangan?: PembimbingLapangan[];
  kapasitasSatkerTahunAjaran?: KapasitasSatkerTahunAjaran[];
}
