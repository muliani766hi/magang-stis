import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
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
  const filePath = path.join(__dirname, 'mahasiswa-passwords.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data: { email: string; password: string }[] = XLSX.utils.sheet_to_json(sheet);

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
    });

    if (!user) {
      console.warn(`⚠️ User ${item.email} tidak ditemukan pada tahun ajaran aktif.`);
      continue;
    }

    // const hashedPassword = await bcrypt.hash(item.password, 10);

    await prisma.user.update({
      where: { userId: user.userId },
      data: { password: item.password },
    });

    console.log(`✅ Password untuk ${item.email} berhasil diupdate.`);
  }

  console.log('🎉 Semua password mahasiswa telah diperbarui berdasarkan tahun ajaran aktif.');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
