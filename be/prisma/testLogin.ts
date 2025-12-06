import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = '222112001@stis.ac.id';
  
  const user = await prisma.user.findFirst({
    where: { email },
    include: { userRoles: true, mahasiswa: true }
  });
  
  if (!user) {
    console.log('❌ User tidak ditemukan!');
    return;
  }
  
  console.log('=== USER DITEMUKAN ===');
  console.log('User ID:', user.userId);
  console.log('Email:', user.email);
  console.log('Password hash:', user.password.substring(0, 30) + '...');
  console.log('Tahun Ajaran ID:', user.tahunAjaranId);
  console.log('Roles:', user.userRoles);
  console.log('Mahasiswa:', user.mahasiswa?.nama);
  
  // Test password
  const testPassword = 'mahasiswa123';
  const isMatch = await bcrypt.compare(testPassword, user.password);
  console.log('\n=== TEST PASSWORD ===');
  console.log(`Password "${testPassword}" cocok:`, isMatch);
  
  if (!isMatch) {
    // Coba hash baru dan bandingkan
    const newHash = await bcrypt.hash(testPassword, 10);
    console.log('Hash baru:', newHash.substring(0, 30) + '...');
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
