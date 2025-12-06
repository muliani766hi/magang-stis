import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateBimbinganMagangDto } from '../bimbingan-magang/dto/bimbingan-magang/create-bimbinganMagang.dto';
import { UpdateBimbinganMagangDto } from '../bimbingan-magang/dto/bimbingan-magang/update-bimbinganMagang.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';
import { CreateBimbinganMagangDosenDto } from './dto/bimbingan-magang-dosen/create-bimbinganMagangDosen.dto';

@Injectable()
export class BimbinganMagangService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async createByMahasiswa(mahasiswaId: number, createBimbinganMagangDto: CreateBimbinganMagangDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'BimbinganMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat bimbingan magang');
    }

    const bimbinganMagang = await this.prismaService.bimbinganMagang.create({
      data: {
        tanggal: new Date(createBimbinganMagangDto.tanggal),
        status: "Menunggu",
        tempat: createBimbinganMagangDto.tempat === undefined ? null : createBimbinganMagangDto.tempat,
        deskripsi: createBimbinganMagangDto.deskripsi === undefined ? null : createBimbinganMagangDto.deskripsi,
        PesertaBimbinganMahasiswa: {
          create: {
            mahasiswa: {
              connect: {
                mahasiswaId: mahasiswaId
              }
            },
          }
        },
        dosenPembimbingMagang: {
          connect: {
            dosenId: (
              await this.prismaService.dosenPembimbingMagang.findFirstOrThrow({
                where: {
                  mahasiswa: {
                    some: {
                      mahasiswaId: mahasiswaId
                    }
                  }
                }
              }).catch(() => {
                throw new ForbiddenException('Mahasiswa tidak memiliki dosen pembimbing magang');
              })
            ).dosenId
          }
        }
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Bimbingan Magang Berhasil Ditambahkan",
      data: bimbinganMagang
    }
  }

  async createByDosenPembimbing(
    dosenId: number,
    createBimbinganMagangDto: CreateBimbinganMagangDosenDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'BimbinganMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat bimbingan magang');
    }

    const bimbinganMagang = await this.prismaService.bimbinganMagang.create({
      data: {
        tanggal: new Date(createBimbinganMagangDto.tanggal),
        status: "Menunggu",
        tempat: createBimbinganMagangDto.tempat === undefined ? null : createBimbinganMagangDto.tempat,
        deskripsi: createBimbinganMagangDto.deskripsi === undefined ? null : createBimbinganMagangDto.deskripsi,
        dosenPembimbingMagang: {
          connect: {
            dosenId: dosenId
          }
        },
        PesertaBimbinganMahasiswa: {
          create: createBimbinganMagangDto.pesertaBimbinganMahasiswa.map((peserta) => ({
            mahasiswa: {
              connect: {
                mahasiswaId: peserta.mahasiswaId
              }
            }
          }))
        }
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Bimbingan Magang Berhasil Ditambahkan",
      data: bimbinganMagang
    }
  }

  async findAllBimbinganMagangBy(
    query: {
      nim: string;
      nipDosen: string;
      tanggal: Date;
      status: string;
    }
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'BimbinganMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat bimbingan magang');
    }

    const year = await this.prismaService.tahunAjaran.findFirst({
      where: {
        isActive: true
      }
    })

    const listBimbinganMagang = await this.prismaService.bimbinganMagang.findMany({
      where: {
        AND: [
          accessibleBy(ability).BimbinganMagang,
          {
            dosenPembimbingMagang: {
              nip: {
                contains: query.nipDosen
              }
            },
            PesertaBimbinganMahasiswa: {
              some: {
                mahasiswa: {
                  nim: {
                    contains: query.nim
                  }
                }
              }
            },
            tanggal: query.tanggal.toString() === '' ? undefined : new Date(query.tanggal),
            status: {
              contains: query.status
            },
          },
          {
            PesertaBimbinganMahasiswa: {
              some: {
                mahasiswa: {
                  user: {
                    tahunAjaranId: year.tahunAjaranId
                  }
                }
              }
            }
          }
        ],
      },
      include: {
        PesertaBimbinganMahasiswa: {
          include: {
            mahasiswa: true
          }
        },
        dosenPembimbingMagang: true
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Data Bimbingan Magang Berhasil Diambil",
      data: listBimbinganMagang
    }
  }

  async update(bimbinganMagangId: number, updateBimbinganMagangDto: UpdateBimbinganMagangDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'BimbinganMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah bimbingan magang');
    }

    await this.prismaService.bimbinganMagang.findFirstOrThrow({
      where: {
        bimbinganId: bimbinganMagangId,
        AND: [accessibleBy(ability).BimbinganMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Bimbingan Magang tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const bimbinganMagang = await this.prismaService.bimbinganMagang.update({
      where: {
        bimbinganId: bimbinganMagangId
      },
      data: {
        tanggal: new Date(updateBimbinganMagangDto.tanggal),
        tempat: updateBimbinganMagangDto.tempat,
        deskripsi: updateBimbinganMagangDto.deskripsi
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Bimbingan Magang Berhasil Diubah",
      data: bimbinganMagang
    }
  }

  async confirm(bimbinganId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'BimbinganMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat bimbingan magang');
    }

    await this.prismaService.bimbinganMagang.findFirstOrThrow({
      where: {
        bimbinganId: bimbinganId,
        AND: [accessibleBy(ability).BimbinganMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Bimbingan Magang tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const bimbinganMagang = await this.prismaService.bimbinganMagang.update({
      where: {
        bimbinganId: bimbinganId
      },
      data: {
        status: "Disetujui",
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Bimbingan Magang Berhasil Disetujui",
      data: bimbinganMagang
    }
  }

  async finalize(bimbinganId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'BimbinganMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat bimbingan magang');
    }

    await this.prismaService.bimbinganMagang.findFirstOrThrow({
      where: {
        bimbinganId: bimbinganId,
        AND: [accessibleBy(ability).BimbinganMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Bimbingan Magang tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    })

    const bimbinganMagang = await this.prismaService.bimbinganMagang.update({
      where: {
        bimbinganId: bimbinganId
      },
      data: {
        status: "Selesai",
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Bimbingan Magang Berhasil Diselesaikan",
      data: bimbinganMagang
    }
  }

  async delete(bimbinganId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'BimbinganMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus bimbingan magang');
    }

    await this.prismaService.bimbinganMagang.findFirstOrThrow({
      where: {
        bimbinganId: bimbinganId,
        AND: [accessibleBy(ability).BimbinganMagang]
      }
    }).catch(() => {
      throw new ForbiddenException('Bimbingan Magang tidak ditemukan');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    await this.prismaService.bimbinganMagang.delete({
      where: {
        bimbinganId: bimbinganId
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Bimbingan Magang Berhasil Dihapus"
    }
  }
}
