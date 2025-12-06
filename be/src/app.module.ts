import { Module, ValidationPipe } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './users/users.module';
import { SatkerModule } from './satker/satker.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { KegiatanHarianModule } from './kegiatan-harian/kegiatan-harian.module';
import { KegiatanBulananModule } from './kegiatan-bulanan/kegiatan-bulanan.module';
import { BimbinganMagangModule } from './bimbingan-magang/bimbingan-magang.module';
import { PembimbingLapanganModule } from './pembimbing-lapangan/pembimbing-lapangan.module';
import { PemilihanPenempatanModule } from './pemilihan-penempatan/pemilihan-penempatan.module';
import { DosenPembimbingMagangModule } from './dosen-pembimbing-magang/dosen-pembimbing-magang.module';
import { PresensiModule } from './presensi/presensi.module';
import { AdminProvinsiModule } from './admin-provinsi/admin-provinsi.module';
import { TahunAjaranModule } from './tahun-ajaran/tahun-ajaran.module';
import { ProvinsiModule } from './provinsi/provinsi.module';
import { TimMagangModule } from './tim-magang/tim-magang.module';
import { CaslModule } from './casl/casl.module';
import { LaporanMagangModule } from './laporan-magang/laporan-magang.module';
import { PenilaianModule } from './penilaian/penilaian.module';
import { BimbinganSkripsiModule } from './bimbingan-skripsi/bimbingan-skripsi.module';
import { AdminSatkerModule } from './admin-satker/admin-satker.module';
import { PresensiManualModule } from './presensi-manual/presensi-manual.module';
import { PresentasiLaporanMagangModule } from './presentasi-laporan-magang/presentasi-laporan-magang.module';
import { AccessAlocationModule } from './access-alokasi/access-alokasi.module';
import { RolesModule } from './roles/roles.module';
import { PengumumanModule } from './pengumuman/pengumuman.module';
import { PemberkasanModule } from './pemberkasan/pemberkasan.module';
import { DokumenTranslokModule } from './dokumen-translok/dokumen-translok.module';
import { KabagModule } from './kabag/kabag.module';
import { KabupatenModule } from './kabupaten/kabupaten.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        
      }
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public', // URL path
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    JwtModule,
    PassportModule,
    MahasiswaModule,
    DosenPembimbingMagangModule,
    PembimbingLapanganModule,
    SatkerModule,
    PemilihanPenempatanModule,
    BimbinganMagangModule,
    KegiatanHarianModule,
    KegiatanBulananModule,
    PresensiModule,
    AdminProvinsiModule,
    TahunAjaranModule,
    ProvinsiModule,
    TimMagangModule,
    CaslModule,
    LaporanMagangModule,
    PenilaianModule,
    BimbinganSkripsiModule,
    AdminSatkerModule,
    PresensiManualModule,
    PresentasiLaporanMagangModule,
    AccessAlocationModule,
    RolesModule,
    PengumumanModule,
    PemberkasanModule,
    DokumenTranslokModule,
    KabagModule,
    KabupatenModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
  ],
})
export class AppModule{}
