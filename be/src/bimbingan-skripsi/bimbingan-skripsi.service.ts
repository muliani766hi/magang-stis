import { accessibleBy } from '@casl/prisma';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CreateIzinBimbinganSkripsiDto } from '../bimbingan-skripsi/dto/create-izinBimbinganSkripsi.dto';
import { UpdateIzinBimbinganSkripsiDto } from '../bimbingan-skripsi/dto/update-izinBimbinganSkripsi.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BimbinganSkripsiService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private readonly request: Request,
  ) { }

  async create(
    mahasiswaId: number,
    createIzinBimbinganSkripsi: CreateIzinBimbinganSkripsiDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'IzinBimbinganSkripsi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat izin bimbingan skripsi');
    }

    const izinBimbinganSkripsi = await this.prismaService.izinBimbinganSkripsi.create({
      data: {
        tanggal: new Date(createIzinBimbinganSkripsi.tanggal),
        keterangan: createIzinBimbinganSkripsi.keterangan,
        jamMulai: new Date(createIzinBimbinganSkripsi.jamMulai),
        jamSelesai: new Date(createIzinBimbinganSkripsi.jamSelesai),
        mahasiswa: {
          connect: {
            mahasiswaId: mahasiswaId
          }
        }
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Izin bimbingan skripsi berhasil dibuat",
      data: izinBimbinganSkripsi
    }
  }

  async findAllIzinBy(
    param: {
      mahasiswaId: number;
      tanggal: string;
    }
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'IzinBimbinganSkripsi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat izin bimbingan skripsi');
    }

    const izinBimbinganSkripsi = await this.prismaService.izinBimbinganSkripsi.findMany({
      where: {
        mahasiswaId: param.mahasiswaId.toString() == '' ? undefined : parseInt(param.mahasiswaId.toString()),
        tanggal: param.tanggal == '' ? undefined : new Date(param.tanggal),
        AND: [accessibleBy(ability).IzinBimbinganSkripsi],
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Izin bimbingan skripsi berhasil ditemukan",
      data: izinBimbinganSkripsi
    }
  }

  async update(izinBimbinganSkripsiId: number, updateIzinBimbinganSkripsi: UpdateIzinBimbinganSkripsiDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'IzinBimbinganSkripsi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate izin bimbingan skripsi');
    }

    await this.prismaService.izinBimbinganSkripsi.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).IzinBimbinganSkripsi],
        izinBimbinganId: parseInt(izinBimbinganSkripsiId.toString())
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate izin bimbingan skripsi');
    }).finally(() => {
      this.prismaService.$disconnect();
    });


    const izinBimbinganSkripsi = await this.prismaService.izinBimbinganSkripsi.update({
      where: {
        izinBimbinganId: parseInt(izinBimbinganSkripsiId.toString())
      },
      data: {
        tanggal: updateIzinBimbinganSkripsi.tanggal == '' ? undefined : new Date(updateIzinBimbinganSkripsi.tanggal),
        keterangan: updateIzinBimbinganSkripsi.keterangan == '' ? undefined : updateIzinBimbinganSkripsi.keterangan,
        jamMulai: updateIzinBimbinganSkripsi.jamMulai == '' ? undefined : new Date(updateIzinBimbinganSkripsi.jamMulai),
        jamSelesai: updateIzinBimbinganSkripsi.jamSelesai == '' ? undefined : new Date(updateIzinBimbinganSkripsi.jamSelesai)
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Izin bimbingan skripsi berhasil diupdate",
      data: izinBimbinganSkripsi
    }
  }

  async remove(izinBimbinganSkripsiId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'IzinBimbinganSkripsi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus izin bimbingan skripsi');
    }

    await this.prismaService.izinBimbinganSkripsi.findFirstOrThrow({
      where: {
        AND: [accessibleBy(ability).IzinBimbinganSkripsi],
        izinBimbinganId: parseInt(izinBimbinganSkripsiId.toString())
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus izin bimbingan skripsi');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const izinBimbinganSkripsi = await this.prismaService.izinBimbinganSkripsi.delete({
      where: {
        izinBimbinganId: parseInt(izinBimbinganSkripsiId.toString())
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: "success",
      message: "Izin bimbingan skripsi berhasil dihapus",
      data: izinBimbinganSkripsi
    }
  }
}
