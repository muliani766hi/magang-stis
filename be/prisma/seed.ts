import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Roles as RolesEnum } from '../src/enum/roles.enum';

const prisma = new PrismaClient();

async function main() {
  for (const key of Object.keys(RolesEnum)) {
    await prisma.roles.upsert({
      where: { roleName: RolesEnum[key] },
      update: {},
      create: {
        roleName: RolesEnum[key],
      },
    });
  }
  
  const TahunAjaran = [
    '2024/2025',
  ]
  
  await prisma.tahunAjaran.createMany({
    data: TahunAjaran.map((tahun) => ({
      tahun: tahun,
    })),
    skipDuplicates: true,
  });

  // set tahun ajaran aktif
  await prisma.tahunAjaran.update({
    where: {
      tahun: '2024/2025',
    },
    data: {
      isActive: true,
    },
  });

  const hashedPassword = await bcrypt.hash('makanenak', 10);

  const existingAdmin = await prisma.user.findFirst({
    where: {
      email: 'admin@admin.com',
    },
  });

  if (!existingAdmin) {
    const activeTahunAjaran = await prisma.tahunAjaran.findFirst({
      where: {
        isActive: true,
      },
    });

    await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: hashedPassword,
        userRoles: {
          create: {
            roleId: 1,
          },
        },
        tahunAjaran: {
          connect: {
            tahunAjaranId: activeTahunAjaran?.tahunAjaranId,
          },
        },
      },
    });
  }

  const existingIzin = await prisma.accesAlokasiMagang.findFirst({
    where: { roleId: 7 },
  });

  if (!existingIzin) {
    await prisma.accesAlokasiMagang.create({
      data: {
        status: true,
        roleId: 7,
      },
    });
  }

  const provinsi = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Jambi',
    'Sumatera Selatan',
    'Bengkulu',
    'Lampung',
    'Bangka Belitung',
    'Kepulauan Riau',
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Banten',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Sulawesi Tengah',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Gorontalo',
    'Sulawesi Barat',
    'Maluku',
    'Maluku Utara',
    'Papua Barat',
    'Papua',
  ]

  const kodeProvinsi = [
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '21',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '51',
    '52',
    '53',
    '61',
    '62',
    '63',
    '64',
    '65',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '81',
    '82',
    '91',
    '94',
  ]

  await prisma.provinsi.createMany({
    data: provinsi.map((nama, i) => ({
      nama,
      kodeProvinsi: kodeProvinsi[i],
    })),
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });