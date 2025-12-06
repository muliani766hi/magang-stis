import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== CEK DATABASE ===\n');

  const users = await prisma.user.findMany();
  console.log(`📊 Total User: ${users.length}`);

  const mahasiswa = await prisma.mahasiswa.findMany();
  console.log(`📊 Total Mahasiswa: ${mahasiswa.length}`);

  const roles = await prisma.roles.findMany();
  console.log(`📊 Total Roles: ${roles.length}`);

  const tahunAjaran = await prisma.tahunAjaran.findMany();
  console.log(`📊 Total Tahun Ajaran: ${tahunAjaran.length}`);

  console.log('\n=== DETAIL MAHASISWA ===\n');
  mahasiswa.forEach((mhs, i) => {
    console.log(`${i + 1}. ${mhs.nama} (${mhs.nim}) - ${mhs.prodi} - ${mhs.kelas}`);
  });

  console.log('\n=== DETAIL USER ===\n');
  users.forEach((user, i) => {
    console.log(`${i + 1}. ID: ${user.userId} | Email: ${user.email}`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
