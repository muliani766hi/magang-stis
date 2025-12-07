import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Data dummy Dosen Pembimbing Magang
const dosenData = [
  {
    nip: '198501012010011001',
    nama: 'Dr. Budi Hartono, M.Stat',
    email: 'budi.hartono@stis.ac.id',
    prodi: 'Komputasi Statistik',
  },
  {
    nip: '198602022011012002',
    nama: 'Dr. Siti Rahayu, M.Si',
    email: 'siti.rahayu@stis.ac.id',
    prodi: 'Statistika',
  },
  {
    nip: '198703032012013003',
    nama: 'Ahmad Wijaya, S.ST, M.T',
    email: 'ahmad.wijaya@stis.ac.id',
    prodi: 'Komputasi Statistik',
  },
  {
    nip: '198804042013014004',
    nama: 'Dewi Anggraini, S.Si, M.Stat',
    email: 'dewi.anggraini@stis.ac.id',
    prodi: 'Statistika',
  },
  {
    nip: '198905052014015005',
    nama: 'Rudi Setiawan, S.ST, M.Kom',
    email: 'rudi.setiawan@stis.ac.id',
    prodi: 'Komputasi Statistik',
  },
];

async function main() {
  console.log('🚀 Memulai seed Dosen Pembimbing Magang...\n');

  // Cek tahun ajaran aktif
  const tahunAjaran = await prisma.tahunAjaran.findFirst({
    where: { isActive: true },
  });

  if (!tahunAjaran) {
    console.error('❌ Tahun ajaran aktif tidak ditemukan!');
    return;
  }

  console.log(`📅 Tahun Ajaran Aktif: ${tahunAjaran.tahun}\n`);

  // Default password untuk semua dosen dummy
  const defaultPassword = 'dosen123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const dosen of dosenData) {
    try {
      // Cek apakah dosen sudah ada berdasarkan NIP
      const existingDosen = await prisma.dosenPembimbingMagang.findFirst({
        where: { nip: dosen.nip },
      });

      if (existingDosen) {
        console.log(`⏭️ Skip: Dosen ${dosen.nama} (${dosen.nip}) sudah ada.`);
        skipCount++;
        continue;
      }

      // Cek apakah email sudah dipakai
      const existingUser = await prisma.user.findFirst({
        where: {
          email: dosen.email,
          tahunAjaranId: tahunAjaran.tahunAjaranId,
        },
      });

      if (existingUser) {
        console.log(`⏭️ Skip: Email ${dosen.email} sudah dipakai.`);
        skipCount++;
        continue;
      }

      // Buat user dan dosen pembimbing
      await prisma.user.create({
        data: {
          email: dosen.email,
          password: hashedPassword,
          tahunAjaranId: tahunAjaran.tahunAjaranId,
          userRoles: {
            create: { roleId: 3 }, // roleId 3 = dosen pembimbing magang
          },
          dosenPembimbingMagang: {
            create: {
              nip: dosen.nip,
              nama: dosen.nama,
              prodi: dosen.prodi,
            },
          },
        },
      });

      console.log(`✅ Berhasil: ${dosen.nama} (${dosen.nip}) - ${dosen.prodi}`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ Gagal: ${dosen.nip} - ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n========================================');
  console.log('📊 RINGKASAN DOSEN PEMBIMBING:');
  console.log(`   ✅ Berhasil: ${successCount}`);
  console.log(`   ⏭️ Dilewati: ${skipCount}`);
  console.log(`   ❌ Gagal: ${errorCount}`);
  console.log('========================================');
  console.log(`\n🔑 Password default: ${defaultPassword}`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
