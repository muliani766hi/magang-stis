import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Data dummy Pembimbing Lapangan
const pemlapData = [
  {
    nip: '199001011015011001',
    nama: 'Hendra Kusuma',
    email: 'hendra.kusuma@bps.go.id',
    kodeSatker: '3100', // BPS Pusat (akan dicari berdasarkan kode)
  },
  {
    nip: '199102021016012002',
    nama: 'Maya Sari',
    email: 'maya.sari@bps.go.id',
    kodeSatker: '3100',
  },
  {
    nip: '199203031017013003',
    nama: 'Agus Prabowo',
    email: 'agus.prabowo@bps.go.id',
    kodeSatker: '3200', // BPS Jabar (jika ada)
  },
  {
    nip: '199304041018014004',
    nama: 'Rina Wulandari',
    email: 'rina.wulandari@bps.go.id',
    kodeSatker: '3200',
  },
  {
    nip: '199405051019015005',
    nama: 'Bambang Sutrisno',
    email: 'bambang.sutrisno@bps.go.id',
    kodeSatker: '3300', // BPS Jateng (jika ada)
  },
];

async function main() {
  console.log('🚀 Memulai seed Pembimbing Lapangan...\n');

  // Cek tahun ajaran aktif
  const tahunAjaran = await prisma.tahunAjaran.findFirst({
    where: { isActive: true },
  });

  if (!tahunAjaran) {
    console.error('❌ Tahun ajaran aktif tidak ditemukan!');
    return;
  }

  console.log(`📅 Tahun Ajaran Aktif: ${tahunAjaran.tahun}\n`);

  // Cek apakah ada satker, jika tidak buat dummy satker dulu
  let satkerCount = await prisma.satker.count();
  
  if (satkerCount === 0) {
    console.log('⚠️ Tidak ada Satker, membuat satker dummy...\n');
    
    // Cek atau buat provinsi
    let provinsi = await prisma.provinsi.findFirst({
      where: { kodeProvinsi: '31' }
    });
    
    if (!provinsi) {
      provinsi = await prisma.provinsi.create({
        data: {
          nama: 'DKI Jakarta',
          kodeProvinsi: '31',
        }
      });
    }

    // Buat satker dummy
    const dummySatkers = [
      { kodeSatker: '3100', nama: 'BPS Pusat', alamat: 'Jl. Dr. Sutomo 6-8, Jakarta Pusat', email: 'bps@bps.go.id' },
      { kodeSatker: '3200', nama: 'BPS Provinsi Jawa Barat', alamat: 'Jl. PHH Mustopa No.43, Bandung', email: 'bpsjabar@bps.go.id' },
      { kodeSatker: '3300', nama: 'BPS Provinsi Jawa Tengah', alamat: 'Jl. Pahlawan No.6, Semarang', email: 'bpsjateng@bps.go.id' },
    ];

    for (const satker of dummySatkers) {
      const existing = await prisma.satker.findFirst({
        where: { kodeSatker: satker.kodeSatker }
      });
      
      if (!existing) {
        await prisma.satker.create({
          data: {
            ...satker,
            povinsiId: provinsi.provinsiId,
            latitude: -6.2088,
            longitude: 106.8456,
          }
        });
        console.log(`   ✅ Satker ${satker.nama} dibuat.`);
      }
    }
    console.log('');
  }

  // Default password untuk semua pemlab dummy
  const defaultPassword = 'pemlab123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const pemlap of pemlapData) {
    try {
      // Cek apakah pemlab sudah ada berdasarkan NIP
      const existingPemlap = await prisma.pembimbingLapangan.findFirst({
        where: { nip: pemlap.nip },
      });

      if (existingPemlap) {
        console.log(`⏭️ Skip: Pemlab ${pemlap.nama} (${pemlap.nip}) sudah ada.`);
        skipCount++;
        continue;
      }

      // Cek apakah email sudah dipakai
      const existingUser = await prisma.user.findFirst({
        where: {
          email: pemlap.email,
          tahunAjaranId: tahunAjaran.tahunAjaranId,
        },
      });

      if (existingUser) {
        console.log(`⏭️ Skip: Email ${pemlap.email} sudah dipakai.`);
        skipCount++;
        continue;
      }

      // Cari satker berdasarkan kode
      let satker = await prisma.satker.findFirst({
        where: { kodeSatker: pemlap.kodeSatker },
      });

      if (!satker) {
        // Gunakan satker pertama yang ada
        satker = await prisma.satker.findFirst();
        if (!satker) {
          console.error(`❌ Tidak ada satker tersedia untuk ${pemlap.nama}`);
          errorCount++;
          continue;
        }
      }

      // Buat user dan pembimbing lapangan
      await prisma.user.create({
        data: {
          email: pemlap.email,
          password: hashedPassword,
          tahunAjaranId: tahunAjaran.tahunAjaranId,
          userRoles: {
            create: { roleId: 4 }, // roleId 4 = pembimbing lapangan
          },
          pembimbingLapangan: {
            create: {
              nip: pemlap.nip,
              nama: pemlap.nama,
              satkerId: satker.satkerId,
            },
          },
        },
      });

      console.log(`✅ Berhasil: ${pemlap.nama} (${pemlap.nip}) - Satker: ${satker.nama}`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ Gagal: ${pemlap.nip} - ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n========================================');
  console.log('📊 RINGKASAN PEMBIMBING LAPANGAN:');
  console.log(`   ✅ Berhasil: ${successCount}`);
  console.log(`   ⏭️ Dilewati: ${skipCount}`);
  console.log(`   ❌ Gagal: ${errorCount}`);
  console.log('========================================');
  console.log(`\n🔑 Password default: ${defaultPassword}`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
