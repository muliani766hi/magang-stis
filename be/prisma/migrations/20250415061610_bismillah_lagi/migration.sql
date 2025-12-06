-- CreateTable
CREATE TABLE "TahunAjaran" (
    "tahunAjaranId" SERIAL NOT NULL,
    "tahun" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TahunAjaran_pkey" PRIMARY KEY ("tahunAjaranId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "tahunAjaranId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Roles" (
    "roleId" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DosenPembimbingMagang" (
    "dosenId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "prodi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DosenPembimbingMagang_pkey" PRIMARY KEY ("dosenId")
);

-- CreateTable
CREATE TABLE "Mahasiswa" (
    "mahasiswaId" SERIAL NOT NULL,
    "dosenId" INTEGER,
    "pemlapId" INTEGER,
    "userId" INTEGER,
    "satkerId" INTEGER,
    "nama" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "email" TEXT,
    "noHp" TEXT,
    "noHpWali" TEXT,
    "prodi" TEXT NOT NULL,
    "kelas" TEXT,
    "alamat" TEXT,
    "alamatWali" TEXT,
    "nomorRekening" TEXT,
    "namaRekening" TEXT,
    "bank" TEXT,
    "kabupatenId" INTEGER,
    "kabupatenWaliId" INTEGER,
    "provinsiWaliId" INTEGER,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "statusPenempatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mahasiswa_pkey" PRIMARY KEY ("mahasiswaId")
);

-- CreateTable
CREATE TABLE "AdminProvinsi" (
    "adminProvinsiId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provinsiId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "accesAlocation" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AdminProvinsi_pkey" PRIMARY KEY ("adminProvinsiId")
);

-- CreateTable
CREATE TABLE "Provinsi" (
    "provinsiId" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kodeProvinsi" TEXT NOT NULL,

    CONSTRAINT "Provinsi_pkey" PRIMARY KEY ("provinsiId")
);

-- CreateTable
CREATE TABLE "KabupatenKota" (
    "kabupatenKotaId" SERIAL NOT NULL,
    "provinsiId" INTEGER NOT NULL,
    "kodeKabupatenKota" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "KabupatenKota_pkey" PRIMARY KEY ("kabupatenKotaId")
);

-- CreateTable
CREATE TABLE "AdminSatker" (
    "adminSatkerId" SERIAL NOT NULL,
    "satkerId" INTEGER,
    "userId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,

    CONSTRAINT "AdminSatker_pkey" PRIMARY KEY ("adminSatkerId")
);

-- CreateTable
CREATE TABLE "Satker" (
    "satkerId" SERIAL NOT NULL,
    "povinsiId" INTEGER NOT NULL,
    "kabupatenKotaId" INTEGER,
    "nama" TEXT NOT NULL,
    "kodeSatker" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "internalBPS" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Satker_pkey" PRIMARY KEY ("satkerId")
);

-- CreateTable
CREATE TABLE "KapasitasSatkerTahunAjaran" (
    "kapasitasId" SERIAL NOT NULL,
    "satkerId" INTEGER NOT NULL,
    "tahunAjaranId" INTEGER NOT NULL,
    "kapasitas" INTEGER DEFAULT 0,

    CONSTRAINT "KapasitasSatkerTahunAjaran_pkey" PRIMARY KEY ("kapasitasId")
);

-- CreateTable
CREATE TABLE "PembimbingLapangan" (
    "pemlapId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "PembimbingLapangan_pkey" PRIMARY KEY ("pemlapId")
);

-- CreateTable
CREATE TABLE "IzinBimbinganSkripsi" (
    "izinBimbinganId" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jamMulai" TIMESTAMP(3) NOT NULL,
    "jamSelesai" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IzinBimbinganSkripsi_pkey" PRIMARY KEY ("izinBimbinganId")
);

-- CreateTable
CREATE TABLE "BimbinganMagang" (
    "bimbinganId" SERIAL NOT NULL,
    "dosenId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "tempat" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BimbinganMagang_pkey" PRIMARY KEY ("bimbinganId")
);

-- CreateTable
CREATE TABLE "PesertaBimbinganMahasiswa" (
    "pesertaBimbinganMagangId" SERIAL NOT NULL,
    "bimbinganId" INTEGER NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PesertaBimbinganMahasiswa_pkey" PRIMARY KEY ("pesertaBimbinganMagangId")
);

-- CreateTable
CREATE TABLE "TipeKegiatan" (
    "tipeKegiatanId" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipeKegiatan_pkey" PRIMARY KEY ("tipeKegiatanId")
);

-- CreateTable
CREATE TABLE "KegiatanHarian" (
    "kegiatanId" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "volume" INTEGER NOT NULL DEFAULT 0,
    "durasi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pemberiTugas" TEXT NOT NULL,
    "statusPenyelesaian" INTEGER NOT NULL DEFAULT 0,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "mahasiswaId" INTEGER NOT NULL,
    "tipeKegiatanId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KegiatanHarian_pkey" PRIMARY KEY ("kegiatanId")
);

-- CreateTable
CREATE TABLE "RekapKegiatanBulanan" (
    "rekapId" SERIAL NOT NULL,
    "tanggalAwal" TIMESTAMP(3) NOT NULL,
    "tanggalAkhir" TIMESTAMP(3) NOT NULL,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "mahasiswaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RekapKegiatanBulanan_pkey" PRIMARY KEY ("rekapId")
);

-- CreateTable
CREATE TABLE "RekapKegiatanBulananTipeKegiatan" (
    "rekapTipeId" SERIAL NOT NULL,
    "rekapId" INTEGER NOT NULL,
    "tipeKegiatanId" INTEGER NOT NULL,
    "uraian" TEXT NOT NULL,
    "target" INTEGER NOT NULL DEFAULT 0,
    "realisasi" INTEGER NOT NULL DEFAULT 0,
    "persentase" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tingkatKualitas" INTEGER DEFAULT 0,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RekapKegiatanBulananTipeKegiatan_pkey" PRIMARY KEY ("rekapTipeId")
);

-- CreateTable
CREATE TABLE "Presensi" (
    "presensiId" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "waktuDatang" TIMESTAMP(3),
    "waktuPulang" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Tidak Hadir',
    "jumlahJamKerja" DOUBLE PRECISION DEFAULT 0,
    "statusJamKerja" TEXT DEFAULT 'Jam kerja kurang',
    "durasiJamKerja" DOUBLE PRECISION DEFAULT 0,
    "bobotKetidakHadiran" DOUBLE PRECISION DEFAULT 0,
    "mahasiswaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presensi_pkey" PRIMARY KEY ("presensiId")
);

-- CreateTable
CREATE TABLE "PresensiManual" (
    "presensiManualId" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "bukti" TEXT,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "mahasiswaId" INTEGER NOT NULL,
    "disetujui" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresensiManual_pkey" PRIMARY KEY ("presensiManualId")
);

-- CreateTable
CREATE TABLE "IzinPresensi" (
    "izinId" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3),
    "keterangan" TEXT,
    "jenisIzin" TEXT DEFAULT 'Lainnya',
    "fileBukti" TEXT,
    "status" TEXT DEFAULT 'Menunggu',
    "mahasiswaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "IzinPresensi_pkey" PRIMARY KEY ("izinId")
);

-- CreateTable
CREATE TABLE "InvalidToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "InvalidToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PilihanSatker" (
    "pilihanSatkerId" SERIAL NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Menunggu',
    "konfirmasiTimMagang" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "prioritas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PilihanSatker_pkey" PRIMARY KEY ("pilihanSatkerId")
);

-- CreateTable
CREATE TABLE "Penempatan" (
    "id" SERIAL NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,
    "satkerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Penempatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanMagang" (
    "laporanId" SERIAL NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3),
    "fileLaporan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaporanMagang_pkey" PRIMARY KEY ("laporanId")
);

-- CreateTable
CREATE TABLE "PresentasiLaporanMagang" (
    "presentasiId" SERIAL NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3),
    "jumlahPenonton" INTEGER,
    "lokasiPresentasi" TEXT,
    "metodePresentasi" TEXT DEFAULT 'Individu',
    "fileDraftLaporanMagang" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresentasiLaporanMagang_pkey" PRIMARY KEY ("presentasiId")
);

-- CreateTable
CREATE TABLE "Penilaian" (
    "penilianId" SERIAL NOT NULL,
    "mahasiswaId" INTEGER NOT NULL,

    CONSTRAINT "Penilaian_pkey" PRIMARY KEY ("penilianId")
);

-- CreateTable
CREATE TABLE "PenilaianBimbingan" (
    "penilaianBimbinganId" SERIAL NOT NULL,
    "penilianId" INTEGER NOT NULL,
    "inisiatif" INTEGER NOT NULL DEFAULT 50,
    "disiplin" INTEGER NOT NULL DEFAULT 50,
    "ketekunan" INTEGER NOT NULL DEFAULT 50,
    "kemampuanBerfikir" INTEGER NOT NULL DEFAULT 50,
    "komunikasi" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianBimbingan_pkey" PRIMARY KEY ("penilaianBimbinganId")
);

-- CreateTable
CREATE TABLE "PenilaianKinerja" (
    "penilaianKinerjaId" SERIAL NOT NULL,
    "penilianId" INTEGER NOT NULL,
    "initiatif" INTEGER NOT NULL DEFAULT 50,
    "disiplin" INTEGER NOT NULL DEFAULT 50,
    "ketekunan" INTEGER NOT NULL DEFAULT 50,
    "kemampuanBerfikir" INTEGER NOT NULL DEFAULT 50,
    "kemampuanBeradaptasi" INTEGER NOT NULL DEFAULT 50,
    "komunikasi" INTEGER NOT NULL DEFAULT 50,
    "penampilan" INTEGER NOT NULL DEFAULT 50,
    "teknikal" INTEGER NOT NULL DEFAULT 50,
    "kerjasama" INTEGER NOT NULL DEFAULT 50,
    "hasil" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianKinerja_pkey" PRIMARY KEY ("penilaianKinerjaId")
);

-- CreateTable
CREATE TABLE "PenilaianLaporanDosen" (
    "penilaianLaporanDosenId" SERIAL NOT NULL,
    "penilianId" INTEGER NOT NULL,
    "var1" INTEGER NOT NULL DEFAULT 50,
    "var2" INTEGER NOT NULL DEFAULT 50,
    "var3" INTEGER NOT NULL DEFAULT 50,
    "var4" INTEGER NOT NULL DEFAULT 50,
    "var5" INTEGER NOT NULL DEFAULT 50,
    "var6" INTEGER NOT NULL DEFAULT 50,
    "var7" INTEGER NOT NULL DEFAULT 50,
    "var8" INTEGER NOT NULL DEFAULT 50,
    "var9" INTEGER NOT NULL DEFAULT 50,
    "var10" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianLaporanDosen_pkey" PRIMARY KEY ("penilaianLaporanDosenId")
);

-- CreateTable
CREATE TABLE "PenilaianLaporanPemlap" (
    "penilaianLaporanPemlapId" SERIAL NOT NULL,
    "penilianId" INTEGER NOT NULL,
    "var1" INTEGER NOT NULL DEFAULT 50,
    "var2" INTEGER NOT NULL DEFAULT 50,
    "var3" INTEGER NOT NULL DEFAULT 50,
    "var4" INTEGER NOT NULL DEFAULT 50,
    "var5" INTEGER NOT NULL DEFAULT 50,
    "var6" INTEGER NOT NULL DEFAULT 50,
    "var7" INTEGER NOT NULL DEFAULT 50,
    "var8" INTEGER NOT NULL DEFAULT 50,
    "var9" INTEGER NOT NULL DEFAULT 50,
    "var10" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenilaianLaporanPemlap_pkey" PRIMARY KEY ("penilaianLaporanPemlapId")
);

-- CreateTable
CREATE TABLE "PeriodePemilihanTempatMagang" (
    "periodePemilihanTempatMagangId" SERIAL NOT NULL,
    "tahunAjaranId" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalAkhir" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodePemilihanTempatMagang_pkey" PRIMARY KEY ("periodePemilihanTempatMagangId")
);

-- CreateTable
CREATE TABLE "PeriodeKonfirmasiPemilihanSatker" (
    "periodeKonfirmasiPemilihanSatkerId" SERIAL NOT NULL,
    "tahunAjaranId" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalAkhir" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodeKonfirmasiPemilihanSatker_pkey" PRIMARY KEY ("periodeKonfirmasiPemilihanSatkerId")
);

-- CreateTable
CREATE TABLE "PeriodePengumpulanLaporanMagang" (
    "periodePengumpulanLaporanMagangId" SERIAL NOT NULL,
    "tahunAjaranId" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalAkhir" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodePengumpulanLaporanMagang_pkey" PRIMARY KEY ("periodePengumpulanLaporanMagangId")
);

-- CreateTable
CREATE TABLE "AccesAlokasiMagang" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccesAlokasiMagang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DokumenTranslok" (
    "id" SERIAL NOT NULL,
    "bulan" TIMESTAMP(3),
    "fileDokumenTranslok" TEXT,
    "mahasiswaId" INTEGER NOT NULL,
    "status" TEXT DEFAULT 'menunggu',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DokumenTranslok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kabag" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT NOT NULL,

    CONSTRAINT "Kabag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TahunAjaran_tahun_key" ON "TahunAjaran"("tahun");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_roleName_key" ON "Roles"("roleName");

-- CreateIndex
CREATE UNIQUE INDEX "DosenPembimbingMagang_userId_key" ON "DosenPembimbingMagang"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Mahasiswa_userId_key" ON "Mahasiswa"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProvinsi_userId_key" ON "AdminProvinsi"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProvinsi_provinsiId_key" ON "AdminProvinsi"("provinsiId");

-- CreateIndex
CREATE UNIQUE INDEX "Provinsi_kodeProvinsi_key" ON "Provinsi"("kodeProvinsi");

-- CreateIndex
CREATE UNIQUE INDEX "KabupatenKota_kabupatenKotaId_key" ON "KabupatenKota"("kabupatenKotaId");

-- CreateIndex
CREATE UNIQUE INDEX "KabupatenKota_kodeKabupatenKota_key" ON "KabupatenKota"("kodeKabupatenKota");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSatker_satkerId_key" ON "AdminSatker"("satkerId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSatker_userId_key" ON "AdminSatker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Satker_kabupatenKotaId_key" ON "Satker"("kabupatenKotaId");

-- CreateIndex
CREATE UNIQUE INDEX "Satker_kodeSatker_key" ON "Satker"("kodeSatker");

-- CreateIndex
CREATE UNIQUE INDEX "KapasitasSatkerTahunAjaran_satkerId_tahunAjaranId_key" ON "KapasitasSatkerTahunAjaran"("satkerId", "tahunAjaranId");

-- CreateIndex
CREATE UNIQUE INDEX "PembimbingLapangan_userId_key" ON "PembimbingLapangan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TipeKegiatan_nama_satuan_mahasiswaId_key" ON "TipeKegiatan"("nama", "satuan", "mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "RekapKegiatanBulanan_tanggalAwal_tanggalAkhir_mahasiswaId_key" ON "RekapKegiatanBulanan"("tanggalAwal", "tanggalAkhir", "mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "Presensi_tanggal_mahasiswaId_key" ON "Presensi"("tanggal", "mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "InvalidToken_id_key" ON "InvalidToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvalidToken_token_key" ON "InvalidToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Penempatan_id_key" ON "Penempatan"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LaporanMagang_mahasiswaId_key" ON "LaporanMagang"("mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "PresentasiLaporanMagang_mahasiswaId_key" ON "PresentasiLaporanMagang"("mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "Penilaian_mahasiswaId_key" ON "Penilaian"("mahasiswaId");

-- CreateIndex
CREATE UNIQUE INDEX "Penilaian_mahasiswaId_penilianId_key" ON "Penilaian"("mahasiswaId", "penilianId");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianBimbingan_penilianId_key" ON "PenilaianBimbingan"("penilianId");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianBimbingan_penilianId_penilaianBimbinganId_key" ON "PenilaianBimbingan"("penilianId", "penilaianBimbinganId");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianKinerja_penilianId_key" ON "PenilaianKinerja"("penilianId");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianKinerja_penilianId_penilaianKinerjaId_key" ON "PenilaianKinerja"("penilianId", "penilaianKinerjaId");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianLaporanDosen_penilianId_key" ON "PenilaianLaporanDosen"("penilianId");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianLaporanDosen_penilianId_penilaianLaporanDosenId_key" ON "PenilaianLaporanDosen"("penilianId", "penilaianLaporanDosenId");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianLaporanPemlap_penilianId_key" ON "PenilaianLaporanPemlap"("penilianId");

-- CreateIndex
CREATE UNIQUE INDEX "PenilaianLaporanPemlap_penilianId_penilaianLaporanPemlapId_key" ON "PenilaianLaporanPemlap"("penilianId", "penilaianLaporanPemlapId");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodePemilihanTempatMagang_tahunAjaranId_periodePemilihan_key" ON "PeriodePemilihanTempatMagang"("tahunAjaranId", "periodePemilihanTempatMagangId");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodeKonfirmasiPemilihanSatker_tahunAjaranId_periodeKonfi_key" ON "PeriodeKonfirmasiPemilihanSatker"("tahunAjaranId", "periodeKonfirmasiPemilihanSatkerId");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodePengumpulanLaporanMagang_tahunAjaranId_periodePengum_key" ON "PeriodePengumpulanLaporanMagang"("tahunAjaranId", "periodePengumpulanLaporanMagangId");

-- CreateIndex
CREATE UNIQUE INDEX "Kabag_userId_key" ON "Kabag"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("tahunAjaranId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DosenPembimbingMagang" ADD CONSTRAINT "DosenPembimbingMagang_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_kabupatenId_fkey" FOREIGN KEY ("kabupatenId") REFERENCES "KabupatenKota"("kabupatenKotaId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_kabupatenWaliId_fkey" FOREIGN KEY ("kabupatenWaliId") REFERENCES "KabupatenKota"("kabupatenKotaId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_provinsiWaliId_fkey" FOREIGN KEY ("provinsiWaliId") REFERENCES "Provinsi"("provinsiId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("satkerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_pemlapId_fkey" FOREIGN KEY ("pemlapId") REFERENCES "PembimbingLapangan"("pemlapId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mahasiswa" ADD CONSTRAINT "Mahasiswa_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "DosenPembimbingMagang"("dosenId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProvinsi" ADD CONSTRAINT "AdminProvinsi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProvinsi" ADD CONSTRAINT "AdminProvinsi_provinsiId_fkey" FOREIGN KEY ("provinsiId") REFERENCES "Provinsi"("provinsiId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KabupatenKota" ADD CONSTRAINT "KabupatenKota_provinsiId_fkey" FOREIGN KEY ("provinsiId") REFERENCES "Provinsi"("provinsiId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSatker" ADD CONSTRAINT "AdminSatker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSatker" ADD CONSTRAINT "AdminSatker_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("satkerId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Satker" ADD CONSTRAINT "Satker_povinsiId_fkey" FOREIGN KEY ("povinsiId") REFERENCES "Provinsi"("provinsiId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Satker" ADD CONSTRAINT "Satker_kabupatenKotaId_fkey" FOREIGN KEY ("kabupatenKotaId") REFERENCES "KabupatenKota"("kabupatenKotaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KapasitasSatkerTahunAjaran" ADD CONSTRAINT "KapasitasSatkerTahunAjaran_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("satkerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KapasitasSatkerTahunAjaran" ADD CONSTRAINT "KapasitasSatkerTahunAjaran_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("tahunAjaranId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembimbingLapangan" ADD CONSTRAINT "PembimbingLapangan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembimbingLapangan" ADD CONSTRAINT "PembimbingLapangan_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("satkerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IzinBimbinganSkripsi" ADD CONSTRAINT "IzinBimbinganSkripsi_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BimbinganMagang" ADD CONSTRAINT "BimbinganMagang_dosenId_fkey" FOREIGN KEY ("dosenId") REFERENCES "DosenPembimbingMagang"("dosenId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesertaBimbinganMahasiswa" ADD CONSTRAINT "PesertaBimbinganMahasiswa_bimbinganId_fkey" FOREIGN KEY ("bimbinganId") REFERENCES "BimbinganMagang"("bimbinganId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesertaBimbinganMahasiswa" ADD CONSTRAINT "PesertaBimbinganMahasiswa_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipeKegiatan" ADD CONSTRAINT "TipeKegiatan_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KegiatanHarian" ADD CONSTRAINT "KegiatanHarian_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KegiatanHarian" ADD CONSTRAINT "KegiatanHarian_tipeKegiatanId_fkey" FOREIGN KEY ("tipeKegiatanId") REFERENCES "TipeKegiatan"("tipeKegiatanId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekapKegiatanBulanan" ADD CONSTRAINT "RekapKegiatanBulanan_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekapKegiatanBulananTipeKegiatan" ADD CONSTRAINT "RekapKegiatanBulananTipeKegiatan_rekapId_fkey" FOREIGN KEY ("rekapId") REFERENCES "RekapKegiatanBulanan"("rekapId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RekapKegiatanBulananTipeKegiatan" ADD CONSTRAINT "RekapKegiatanBulananTipeKegiatan_tipeKegiatanId_fkey" FOREIGN KEY ("tipeKegiatanId") REFERENCES "TipeKegiatan"("tipeKegiatanId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresensiManual" ADD CONSTRAINT "PresensiManual_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IzinPresensi" ADD CONSTRAINT "IzinPresensi_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilihanSatker" ADD CONSTRAINT "PilihanSatker_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilihanSatker" ADD CONSTRAINT "PilihanSatker_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("satkerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penempatan" ADD CONSTRAINT "Penempatan_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penempatan" ADD CONSTRAINT "Penempatan_satkerId_fkey" FOREIGN KEY ("satkerId") REFERENCES "Satker"("satkerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanMagang" ADD CONSTRAINT "LaporanMagang_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PresentasiLaporanMagang" ADD CONSTRAINT "PresentasiLaporanMagang_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianBimbingan" ADD CONSTRAINT "PenilaianBimbingan_penilianId_fkey" FOREIGN KEY ("penilianId") REFERENCES "Penilaian"("penilianId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianKinerja" ADD CONSTRAINT "PenilaianKinerja_penilianId_fkey" FOREIGN KEY ("penilianId") REFERENCES "Penilaian"("penilianId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianLaporanDosen" ADD CONSTRAINT "PenilaianLaporanDosen_penilianId_fkey" FOREIGN KEY ("penilianId") REFERENCES "Penilaian"("penilianId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenilaianLaporanPemlap" ADD CONSTRAINT "PenilaianLaporanPemlap_penilianId_fkey" FOREIGN KEY ("penilianId") REFERENCES "Penilaian"("penilianId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodePemilihanTempatMagang" ADD CONSTRAINT "PeriodePemilihanTempatMagang_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("tahunAjaranId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodeKonfirmasiPemilihanSatker" ADD CONSTRAINT "PeriodeKonfirmasiPemilihanSatker_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("tahunAjaranId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodePengumpulanLaporanMagang" ADD CONSTRAINT "PeriodePengumpulanLaporanMagang_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("tahunAjaranId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccesAlokasiMagang" ADD CONSTRAINT "AccesAlokasiMagang_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("roleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DokumenTranslok" ADD CONSTRAINT "DokumenTranslok_mahasiswaId_fkey" FOREIGN KEY ("mahasiswaId") REFERENCES "Mahasiswa"("mahasiswaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kabag" ADD CONSTRAINT "Kabag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
