import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const workbook = XLSX.readFile('./mahasiswa.xlsx');
  const sheet = workbook.SheetNames[0];
  const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

  const tahunAjaranAktif = await prisma.tahunAjaran.findFirst({
    where: { isActive: true },
  });

  for (const mhs of data) {
    try {
      // === SATKER UTAMA ===
      let satkerId: number | null = null;
      if (mhs.kodeSatker) {
        const satker = await prisma.satker.findFirst({
          where: { kodeSatker: String(mhs.kodeSatker) },
        });
        if (!satker) throw new Error(`Satker ${mhs.kodeSatker} tidak ditemukan`);
        satkerId = satker.satkerId;
      }

      // === KABUPATEN DOMISILI ===
      let kabupatenId: number | null = null;
      if (mhs.kodeSatkerKab) {
        const kabSatker = await prisma.satker.findFirst({
          where: { kodeSatker: String(mhs.kodeSatkerKab) },
        });
        if (!kabSatker) throw new Error(`SatkerKab ${mhs.kodeSatkerKab} tidak ditemukan`);
        kabupatenId = kabSatker.kabupatenKotaId;
      }

      // === KABUPATEN WALI ===
      let kabupatenWaliId: number | null = null;
      if (mhs.kodeSatkerKabWali) {
        const kabSatkerWali = await prisma.satker.findFirst({
          where: { kodeSatker: String(mhs.kodeSatkerKabWali) },
        });
        if (!kabSatkerWali) throw new Error(`SatkerKabWali ${mhs.kodeSatkerKabWali} tidak ditemukan`);
        kabupatenWaliId = kabSatkerWali.kabupatenKotaId;
      }

      // === PROVINSI WALI ===
      let provinsiWaliId: number | null = null;
      if (mhs.provinsiWaliId) {
        const provinsi = await prisma.provinsi.findUnique({
          where: { kodeProvinsi: String(mhs.provinsiWaliId) },
        });
        if (!provinsi) throw new Error(`Provinsi ${mhs.provinsiWaliId} tidak ditemukan`);
        provinsiWaliId = provinsi.provinsiId;
      }

      // === BUAT USER + MAHASISWA ===
      const createdUser = await prisma.user.create({
        data: {
          email: mhs.email,
          password: mhs.password,
          tahunAjaranId: tahunAjaranAktif?.tahunAjaranId,
          userRoles: {
            create: { roleId: 9 }, // roleId mahasiswa
          },
          mahasiswa: {
            create: {
              nim: String(mhs.nim),
              nama: mhs.nama,
              prodi: mhs.prodi,
              kelas: mhs.kelas,
              email: mhs.emailNonStis,
              noHp: String(mhs.noHp),
              alamat: mhs.alamat,
              alamatWali: mhs.alamatWali,
              provinsiWaliId: provinsiWaliId,
              satkerId: satkerId,
              kabupatenId: kabupatenId,
              kabupatenWaliId: kabupatenWaliId,
            },
          },
        },
        include: { mahasiswa: true },
      });

      // === PENEMPATAN ===
      const mahasiswaId = createdUser.mahasiswa?.mahasiswaId;
      if (satkerId && mahasiswaId) {
        await prisma.penempatan.create({
          data: {
            mahasiswaId,
            satkerId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      console.log(`✅ Mahasiswa ${mhs.nama} (${mhs.nim}) berhasil ditambahkan.`);
    } catch (err) {
      console.error(`❌ Gagal menambahkan ${mhs.nim}:`, err.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
