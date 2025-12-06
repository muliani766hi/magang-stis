import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== CEK TAHUN AJARAN ===\n');
  
  const tahunAjaran = await prisma.tahunAjaran.findMany();
  tahunAjaran.forEach(ta => {
    console.log(`ID: ${ta.tahunAjaranId} | Tahun: ${ta.tahun} | Aktif: ${ta.isActive}`);
  });
  
  console.log('\n=== CEK USER MAHASISWA ===\n');
  
  const user = await prisma.user.findFirst({
    where: { email: '222112001@stis.ac.id' },
    include: { 
      tahunAjaran: true,
      userRoles: {
        include: { role: true }
      },
      mahasiswa: true
    }
  });
  
  if (user) {
    console.log('Email:', user.email);
    console.log('Tahun Ajaran ID user:', user.tahunAjaranId);
    console.log('Tahun Ajaran:', user.tahunAjaran?.tahun);
    console.log('Tahun Ajaran Aktif:', user.tahunAjaran?.isActive);
    console.log('Role:', user.userRoles.map(r => r.role.roleName));
    console.log('Mahasiswa:', user.mahasiswa?.nama);
  }
  
  console.log('\n=== SIMULASI QUERY LOGIN ===\n');
  
  // Simulasi query yang sama dengan auth service
  try {
    const loginUser = await prisma.user.findFirstOrThrow({
      select: {
        userId: true,
        email: true,
        password: true,
        userRoles: {
          select: {
            roleId: true,
            role: {
              select: {
                roleName: true,
              },
            },
          }
        },
      },
      where: {
        AND: [
          {
            OR: [
              { email: '222112001@stis.ac.id' },
              { userName: '222112001@stis.ac.id' }
            ]
          },
          {
            tahunAjaran: {
              isActive: true,
            },
          }
        ]
      },
    });
    
    console.log('✅ User ditemukan dengan query login!');
    console.log('User ID:', loginUser.userId);
    console.log('Email:', loginUser.email);
    console.log('Roles:', loginUser.userRoles);
  } catch (e: any) {
    console.log('❌ User TIDAK ditemukan dengan query login!');
    console.log('Error:', e.message);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
