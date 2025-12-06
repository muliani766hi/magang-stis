
import {User} from '../../user/entities/user.entity'
import {KapasitasSatkerTahunAjaran} from '../../kapasitasSatkerTahunAjaran/entities/kapasitasSatkerTahunAjaran.entity'
import {PeriodePemilihanTempatMagang} from '../../periodePemilihanTempatMagang/entities/periodePemilihanTempatMagang.entity'
import {PeriodePengumpulanLaporanMagang} from '../../periodePengumpulanLaporanMagang/entities/periodePengumpulanLaporanMagang.entity'
import {PeriodeKonfirmasiPemilihanSatker} from '../../periodeKonfirmasiPemilihanSatker/entities/periodeKonfirmasiPemilihanSatker.entity'


export class TahunAjaran {
  tahunAjaranId: number ;
tahun: string ;
isActive: boolean ;
user?: User[] ;
kapasitasSatkerTahunAjaran?: KapasitasSatkerTahunAjaran[] ;
PeriodePemilihanTempatMagang?: PeriodePemilihanTempatMagang[] ;
PeriodePengumpulanLaporanMagang?: PeriodePengumpulanLaporanMagang[] ;
PeriodeKonfirmasiPemilihanSatker?: PeriodeKonfirmasiPemilihanSatker[] ;
}
