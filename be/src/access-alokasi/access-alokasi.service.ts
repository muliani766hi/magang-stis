import { Inject, Injectable, Res, Response } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Injectable()
@ApiBearerAuth()
export class AccessAlokasiService {
  private accessProvinsiName = 'admin provinsi'
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async findAccessAlokasi () {
    const accessAlocation = await this.prisma.accesAlokasiMagang.findFirst({
      where: {
        role: {
          roleName: {
            contains: this.accessProvinsiName
          }
        }
      },
      include: {
        role: {
          select: {
            roleName: true
          }
        }
      }
    })
    return {
      status: 'success',
      data: accessAlocation
    }
  }

  async update(
    id: number,
    status: boolean,
  ) {
    const update = await this.prisma.accesAlokasiMagang.update({
      where: {
        id: id
      },
      data: {
        status: status
      }
    })

    return {
      status: 'success',
      message: 'Access Alokasi berhasil diupdate',
      data: await this.prisma.accesAlokasiMagang.findFirst({
        where: {
          id: id
        },
        include: {
          role: {
            select: {
              roleName: true
            }
          }
        }
      })
    }
  }

  
  // async create(createAdminProvinsiDto: CreateAdminProvinsiDto) {
  //   const injectedToken = this.request.headers['authorization'].split(' ')[1];
  //   const payload = this.jwtService.decode(injectedToken);
  //   const ability = this.caslAbilityFactory.createForUser(payload);
  //   if (!ability.can('create', 'AdminProvinsi')) {
  //     return {
  //       status: 'error',
  //       message: 'Anda tidak memiliki izin untuk membuat admin provinsi'
  //     }
  //   }

  //   const adminProvinsi = await this.prisma.adminProvinsi.create({
  //     data: {
  //       user: {
  //         create: {
  //           email: createAdminProvinsiDto.user.email,
  //           password: await bcrypt.hash(createAdminProvinsiDto.user.password, 10),
  //           tahunAjaran: {
  //             connect: {
  //               tahunAjaranId: (await this.prisma.tahunAjaran.findFirst({
  //                 where: {
  //                   isActive: true
  //                 }
  //               })).tahunAjaranId
  //             }
  //           },
  //           userRoles: {
  //             create: {
  //               roleId: 7
  //             }
  //           }
  //         }
  //       },
  //       nama: createAdminProvinsiDto.nama,
  //       nip: createAdminProvinsiDto.nip,
  //       provinsi: {
  //         connect: {
  //           kodeProvinsi: createAdminProvinsiDto.kodeProvinsi
  //         }
  //       }
  //     },
  //     select: {
  //       user: true,
  //       provinsi: true
  //     }
  //   }).finally(() => {
  //     this.prisma.$disconnect();
  //   });

  //   return {
  //     status: 'success',
  //     message: 'Admin Provinsi berhasil dibuat',
  //     data: adminProvinsi
  //   }
  // }

  // async remove(adminProvinsiId: number) {
  //   const injectedToken = this.request.headers['authorization'].split(' ')[1];
  //   const payload = this.jwtService.decode(injectedToken);
  //   const ability = this.caslAbilityFactory.createForUser(payload);

  //   if (!ability.can('delete', 'AdminProvinsi')) {
  //     throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus admin provinsi');
  //   }

  //   await this.prisma.adminProvinsi.findFirstOrThrow({
  //     where: {
  //       adminProvinsiId: adminProvinsiId,
  //       AND: [accessibleBy(ability).AdminProvinsi]
  //     }
  //   }).catch(() => {
  //     throw new ForbiddenException('Admin Provinsi tidak ditemukan');
  //   }).finally(() => {
  //     this.prisma.$disconnect();
  //   })

  //   await this.prisma.adminProvinsi.delete({
  //     where: {
  //       adminProvinsiId
  //     }
  //   }).finally(() => {
  //     this.prisma.$disconnect();
  //   });

  //   return {
  //     status: 'success',
  //     message: 'Admin Provinsi berhasil dihapus'
  //   }
  // }
}
