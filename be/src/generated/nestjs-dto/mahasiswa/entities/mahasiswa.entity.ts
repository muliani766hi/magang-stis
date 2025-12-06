
import {KabupatenKota} from '../../kabupatenKota/entities/kabupatenKota.entity'
import {Provinsi} from '../../provinsi/entities/provinsi.entity'
import {Satker} from '../../satker/entities/satker.entity'
import {PembimbingLapangan} from '../../pembimbingLapangan/entities/pembimbingLapangan.entity'
import {User} from '../../user/entities/user.entity'
import {LaporanMagang} from '../../laporanMagang/entities/laporanMagang.entity'
import {DosenPembimbingMagang} from '../../dosenPembimbingMagang/entities/dosenPembimbingMagang.entity'
import {Presensi} from '../../presensi/entities/presensi.entity'
import {TipeKegiatan} from '../../tipeKegiatan/entities/tipeKegiatan.entity'
import {IzinPresensi} from '../../izinPresensi/entities/izinPresensi.entity'
import {PilihanSatker} from '../../pilihanSatker/entities/pilihanSatker.entity'
import {KegiatanHarian} from '../../kegiatanHarian/entities/kegiatanHarian.entity'
import {PresensiManual} from '../../presensiManual/entities/presensiManual.entity'
import {RekapKegiatanBulanan} from '../../rekapKegiatanBulanan/entities/rekapKegiatanBulanan.entity'
import {IzinBimbinganSkripsi} from '../../izinBimbinganSkripsi/entities/izinBimbinganSkripsi.entity'
import {PresentasiLaporanMagang} from '../../presentasiLaporanMagang/entities/presentasiLaporanMagang.entity'
import {PesertaBimbinganMahasiswa} from '../../pesertaBimbinganMahasiswa/entities/pesertaBimbinganMahasiswa.entity'
import {Penilaian} from '../../penilaian/entities/penilaian.entity'
import {Penempatan} from '../../penempatan/entities/penempatan.entity'
import {DokumenTranslok} from '../../dokumenTranslok/entities/dokumenTranslok.entity'


export class Mahasiswa {
  mahasiswaId: number ;
dosenId: number  | null;
pemlapId: number  | null;
userId: number  | null;
satkerId: number  | null;
nama: string ;
nim: string ;
email: string  | null;
noHp: string  | null;
noHpWali: string  | null;
prodi: string ;
kelas: string  | null;
alamat: string  | null;
alamatWali: string  | null;
nomorRekening: string  | null;
namaRekening: string  | null;
bank: string  | null;
statusRek: string  | null;
catatanRek: string  | null;
kabupatenId: number  | null;
kabupaten?: KabupatenKota  | null;
kabupatenWaliId: number  | null;
kabupatenWali?: KabupatenKota  | null;
provinsiWaliId: number  | null;
provinsiWali?: Provinsi  | null;
lat: number  | null;
lng: number  | null;
statusPenempatan: string  | null;
createdAt: Date ;
updatedAt: Date ;
satker?: Satker  | null;
pembimbingLapangan?: PembimbingLapangan  | null;
user?: User  | null;
laporanMagang?: LaporanMagang  | null;
dosenPembimbingMagang?: DosenPembimbingMagang  | null;
presensi?: Presensi[] ;
tipeKegiatan?: TipeKegiatan[] ;
izinPresensi?: IzinPresensi[] ;
pilihanSatker?: PilihanSatker[] ;
kegiatanHarian?: KegiatanHarian[] ;
presensiManual?: PresensiManual[] ;
rekapKegiatanBulanan?: RekapKegiatanBulanan[] ;
izinBimbinganSkripsi?: IzinBimbinganSkripsi[] ;
presentasiLaporanMagang?: PresentasiLaporanMagang[] ;
pesertaBimbinganMagang?: PesertaBimbinganMahasiswa[] ;
penilaian?: Penilaian  | null;
penempatan?: Penempatan[] ;
dokumenTranslok?: DokumenTranslok[] ;
}
