
import {Mahasiswa} from '../../mahasiswa/entities/mahasiswa.entity'
import {KegiatanHarian} from '../../kegiatanHarian/entities/kegiatanHarian.entity'
import {RekapKegiatanBulananTipeKegiatan} from '../../rekapKegiatanBulananTipeKegiatan/entities/rekapKegiatanBulananTipeKegiatan.entity'


export class TipeKegiatan {
  tipeKegiatanId: number ;
nama: string ;
satuan: string ;
mahasiswaId: number ;
createdAt: Date ;
updatedAt: Date ;
mahasiswa?: Mahasiswa ;
kegiatanHarian?: KegiatanHarian[] ;
RekapKegiatanBulananTipeKegiatan?: RekapKegiatanBulananTipeKegiatan[] ;
}
