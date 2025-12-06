import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Data dummy mahasiswa
const mahasiswaData = [
  {
    nim: '222112001',
    nama: 'Ahmad Fauzi',
    email: '222112001@stis.ac.id',
    prodi: 'Komputasi Statistik',
    kelas: '3KS1',
    noHp: '081234567801',
    alamat: 'Jakarta Pusat',
  },
  {
    nim: '222112002',
    nama: 'Siti Nurhaliza',
    email: '222112002@stis.ac.id',
    prodi: 'Komputasi Statistik',
    kelas: '3KS1',
    noHp: '081234567802',
    alamat: 'Jakarta Selatan',
  },
  {
    nim: '222112003',
    nama: 'Budi Santoso',
    email: '222112003@stis.ac.id',
    prodi: 'Komputasi Statistik',
    kelas: '3KS2',
    noHp: '081234567803',
    alamat: 'Bandung',
  },
  {
    nim: '222112004',
    nama: 'Dewi Lestari',
    email: '222112004@stis.ac.id',
    prodi: 'Statistika',
    kelas: '3SI1',
    noHp: '081234567804',
    alamat: 'Surabaya',
  },
  {
    nim: '222112005',
    nama: 'Rizki Pratama',
    email: '222112005@stis.ac.id',
    prodi: 'Statistika',
    kelas: '3SI1',
    noHp: '081234567805',
    alamat: 'Yogyakarta',
  },
  {
    nim: '222112006',
    nama: 'Putri Ayu',
    email: '222112006@stis.ac.id',
    prodi: 'Statistika',
    kelas: '3SI2',
    noHp: '081234567806',
    alamat: 'Semarang',
  },
  {
    nim: '222112007',
    nama: 'Andi Wijaya',
    email: '222112007@stis.ac.id',
    prodi: 'Komputasi Statistik',
    kelas: '3KS2',
    noHp: '081234567807',
    alamat: 'Medan',
  },
  {
    nim: '222112008',
    nama: 'Rina Marlina',
    email: '222112008@stis.ac.id',
    prodi: 'Komputasi Statistik',
    kelas: '3KS3',
    noHp: '081234567808',
    alamat: 'Makassar',
  },
  {
    nim: '222112009',
    nama: 'Dimas Arya',
    email: '222112009@stis.ac.id',
    prodi: 'Statistika',
    kelas: '3SI2',
    noHp: '081234567809',
    alamat: 'Palembang',
  },
  {
    nim: '222112010',
    nama: 'Nadia Safitri',
    email: '222112010@stis.ac.id',
    prodi: 'Statistika',
    kelas: '3SI3',
    noHp: '081234567810',
    alamat: 'Denpasar',
  },
];

async function main() {
  console.log('🚀 Memulai seed mahasiswa dummy...\n');

  // Cek tahun ajaran aktif
  const tahunAjaranAktif = await prisma.tahunAjaran.findFirst({
    where: { isActive: true },
  });

  if (!tahunAjaranAktif) {
    console.error('❌ Tahun ajaran aktif tidak ditemukan!');
    console.log('Membuat tahun ajaran 2024/2025...');
    
    await prisma.tahunAjaran.upsert({
      where: { tahun: '2024/2025' },
      update: { isActive: true },
      create: { tahun: '2024/2025', isActive: true },
    });
  }

  const tahunAjaran = await prisma.tahunAjaran.findFirst({
    where: { isActive: true },
  });

  console.log(`📅 Tahun Ajaran Aktif: ${tahunAjaran?.tahun}\n`);

  // Cek role mahasiswa (roleId = 9)
  const roleMahasiswa = await prisma.roles.findFirst({
    where: { roleId: 9 },
  });

  if (!roleMahasiswa) {
    console.log('⚠️ Role mahasiswa belum ada, membuat roles...');
    await prisma.roles.upsert({
      where: { roleName: 'Mahasiswa' },
      update: {},
      create: { roleName: 'Mahasiswa' },
    });
  }

  // Default password untuk semua mahasiswa dummy
  const defaultPassword = 'mahasiswa123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const mhs of mahasiswaData) {
    try {
      // Cek apakah mahasiswa sudah ada berdasarkan NIM
      const existingMahasiswa = await prisma.mahasiswa.findFirst({
        where: { nim: mhs.nim },
      });

      if (existingMahasiswa) {
        console.log(`⏭️ Skip: Mahasiswa ${mhs.nama} (${mhs.nim}) sudah ada.`);
        skipCount++;
        continue;
      }

      // Cek apakah email sudah dipakai
      const existingUser = await prisma.user.findFirst({
        where: {
          email: mhs.email,
          tahunAjaranId: tahunAjaran?.tahunAjaranId,
        },
      });

      if (existingUser) {
        console.log(`⏭️ Skip: Email ${mhs.email} sudah dipakai.`);
        skipCount++;
        continue;
      }

      // Buat user dan mahasiswa
      const createdUser = await prisma.user.create({
        data: {
          email: mhs.email,
          password: hashedPassword,
          tahunAjaranId: tahunAjaran?.tahunAjaranId,
          userRoles: {
            create: { roleId: 9 }, // roleId mahasiswa
          },
          mahasiswa: {
            create: {
              nim: mhs.nim,
              nama: mhs.nama,
              prodi: mhs.prodi,
              kelas: mhs.kelas,
              email: mhs.email,
              noHp: mhs.noHp,
              alamat: mhs.alamat,
            },
          },
        },
        include: { mahasiswa: true },
      });

      console.log(`✅ Berhasil: ${mhs.nama} (${mhs.nim}) - ${mhs.prodi} - ${mhs.kelas}`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ Gagal: ${mhs.nim} - ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n========================================');
  console.log('📊 RINGKASAN:');
  console.log(`   ✅ Berhasil: ${successCount}`);
  console.log(`   ⏭️ Dilewati: ${skipCount}`);
  console.log(`   ❌ Gagal: ${errorCount}`);
  console.log('========================================');
  console.log(`\n🔑 Password default: ${defaultPassword}`);
  console.log('   (Semua mahasiswa dummy menggunakan password ini)\n');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    prisma.$disconnect();
  });
