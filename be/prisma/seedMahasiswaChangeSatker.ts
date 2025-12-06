import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

async function main() {
  // Ambil tahun ajaran aktif
  const tahunAjaranAktif = await prisma.tahunAjaran.findFirst({
    where: {
      isActive: true,
    },
  });

  if (!tahunAjaranAktif) {
    console.error('❌ Tidak ditemukan tahun ajaran yang aktif.');
    process.exit(1);
  }

  // Baca file Excel
  const filePath = path.join(__dirname, 'mahasiswa-satker.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data: { email: string; kodeSatker: string }[] = XLSX.utils.sheet_to_json(sheet);

  for (const item of data) {
    const user = await prisma.user.findFirst({
      where: {
        email: item.email,
        tahunAjaranId: tahunAjaranAktif.tahunAjaranId,
        userRoles: {
          some: {
            role: {
              roleName: 'mahasiswa',
            },
          },
        },
      },
      include: {
        mahasiswa: true,
      },
    });

    if (!user) {
      console.warn(`⚠️ User ${item.email} tidak ditemukan pada tahun ajaran aktif.`);
      continue;
    }

    const satker = await prisma.satker.findUnique({
      where: {
        kodeSatker: item.kodeSatker,
      },
    });

    if (!satker) {
      console.warn(`⚠️ Satker dengan kode ${item.kodeSatker} tidak ditemukan.`);
      continue;
    }

    await prisma.user.update({
      where: { userId: user.userId },
      data: {
        mahasiswa: {
          update: {
            satkerId: satker.satkerId,
          },
        },
      },
    });

    console.log(`✅ Satker untuk ${item.email} berhasil diupdate ke ${satker.kodeSatker} (ID: ${satker.satkerId})`);
  }

  console.log('🎉 Semua satker mahasiswa telah diperbarui berdasarkan file Excel.');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());