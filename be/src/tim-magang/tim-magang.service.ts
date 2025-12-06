import { accessibleBy } from '@casl/prisma';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { Mahasiswa } from '../mahasiswa/dto/mahasiswa.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimMagangService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request,
  ) { }

  async assignMahasiswaToDosenPembimbing(
    dosenId: number,
    params: Mahasiswa[]
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'DosenPembimbingMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengassign mahasiswa ke dosen pembimbing');
    }

    await this.prisma.dosenPembimbingMagang.findFirstOrThrow({
      where: {
        dosenId: parseInt(dosenId.toString()),
        AND: [accessibleBy(ability).DosenPembimbingMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengassign mahasiswa ke dosen pembimbing');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.dosenPembimbingMagang.update({
      where: {
        dosenId: dosenId,
      },
      data: {
        mahasiswa: {
          connect: params.map((mahasiswa) => {
            return {
              mahasiswaId: mahasiswa.mahasiswaId,
            };
          }),
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Mahasiswa Berhasil Diassign Ke Dosen Pembimbing',
    };
  }

  async unassignMahasiswaToDosenPembimbing(
    dosenId: number,
    params: Mahasiswa[]
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'DosenPembimbingMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menunassign mahasiswa dari dosen pembimbing');
    }

    await this.prisma.dosenPembimbingMagang.findFirstOrThrow({
      where: {
        dosenId: parseInt(dosenId.toString()),
        AND: [accessibleBy(ability).DosenPembimbingMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menunassign mahasiswa dari dosen pembimbing');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.dosenPembimbingMagang.findMany({
      where: {
        dosenId: dosenId,
        mahasiswa: {
          some: {
            mahasiswaId: {
              in: params.map((mahasiswa) => mahasiswa.mahasiswaId),
            },
          },
        },
      },
    }).then((result) => {
      if (result.length !== params.length) {
        throw new NotFoundException('Mahasiswa tidak ditemukan pada dosen pembimbing ini');
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.dosenPembimbingMagang.update({
      where: {
        dosenId: dosenId,
      },
      data: {
        mahasiswa: {
          disconnect: params.map((mahasiswa) => {
            return {
              mahasiswaId: mahasiswa.mahasiswaId,
            };
          }),
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Mahasiswa Berhasil Diunassign Dari Dosen Pembimbing',
    };
  }

  async konfirmasiPilihanSatkerSatuProvinsi(pilihanId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PilihanSatker')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengkonfirmasi pilihan satker');
    }

    await this.prisma.pilihanSatker.findFirstOrThrow({
      where: {
        pilihanSatkerId: parseInt(pilihanId.toString()),
        AND: [accessibleBy(ability).PilihanSatker]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengkonfirmasi pilihan satker');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const provinsi = await this.prisma.pilihanSatker.findFirst({
      where: {
        pilihanSatkerId: pilihanId,
      },
      select: {
        mahasiswaId: true,
        satker: {
          select: {
            provinsi: {
              select: {
                provinsiId: true,
              },
            }
          },
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.pilihanSatker.updateMany({
      where: {
        pilihanSatkerId: pilihanId,
        satker: {
          provinsi: {
            provinsiId: provinsi.satker.provinsi.provinsiId,
          },
        },
        mahasiswaId: provinsi.mahasiswaId,
      },
      data: {
        konfirmasiTimMagang: true,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'success',
      message: 'Pilihan Satker dengan Provinsi yang sama Berhasil Dikonfirmasi',
    };
  }
}
