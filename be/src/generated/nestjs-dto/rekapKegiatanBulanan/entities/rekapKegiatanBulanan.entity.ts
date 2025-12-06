
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {RekapKegiatanBulananTipeKegiatan} from '../../rekapKegiatanBulananTipeKegiatan/entities/rekapKegiatanBulananTipeKegiatan.entity'


export class RekapKegiatanBulanan {
  rekapId: number ;
tanggalAwal: Date ;
tanggalAkhir: Date ;
isFinal: boolean ;
mahasiswaId: number ;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
RekapKegiatanBulananTipeKegiatan?: RekapKegiatanBulananTipeKegiatan[] ;
}
