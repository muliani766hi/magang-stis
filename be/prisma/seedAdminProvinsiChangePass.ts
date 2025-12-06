import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

async function main() {
  // Ambil semua user dengan role ADMIN_PROVINSI
  const users = await prisma.user.findMany({
    where: {
      userRoles: {
        some: {
          role: {
            roleName: 'admin provinsi',
          },
        },
      },
    },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  const updatedUsers: { userId: number; email: string; password: string }[] = [];

  for (const user of users) {
    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.user.update({
      where: { userId: user.userId },
      data: { password: hashedPassword },
    });

    updatedUsers.push({
      userId: user.userId,
      email: user.email,
      password: plainPassword,
    });
  }

  writeToExcel(updatedUsers);
  console.log('✅ Seeder selesai. Password baru disimpan ke file Excel.');
}

function generateRandomPassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function writeToExcel(data: { userId: number; email: string; password: string }[]) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'AdminProvinsiPasswords');

  const filePath = path.join(__dirname, 'admin-provinsi-passwords-dokploy.xlsx');
  XLSX.writeFile(wb, filePath);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
