
import { TahunAjaran } from '../../../tahun-ajaran/dto/tahunAjaran.entity'
import { Mahasiswa } from '../../../mahasiswa/dto/mahasiswa.entity'
import { AdminSatker } from '../../../admin-satker/dto/admin-satker/adminSatker.entity'
import { AdminProvinsi } from '../../../admin-provinsi/dto/adminProvinsi.entity'
import { PembimbingLapangan } from '../../../pembimbing-lapangan/dto/pembimbingLapangan.entity'
import { DosenPembimbingMagang } from '../../../dosen-pembimbing-magang/dto/dosenPembimbingMagang.entity'
import { UserRoles } from '../user-roles/userRoles.entity'
import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator'


export class User {
  userId: number;
  email: string;
  password: string;
  tahunAjaran?: TahunAjaran;
  tahunAjaranId: number;
  createdAt: Date;
  updatedAt: Date;
  mahasiswa?: Mahasiswa | null;
  adminSatker?: AdminSatker | null;
  adminProvinsi?: AdminProvinsi | null;
  pembimbingLapangan?: PembimbingLapangan | null;
  dosenPembimbingMagang?: DosenPembimbingMagang | null;
  userRoles?: UserRoles[];
}
