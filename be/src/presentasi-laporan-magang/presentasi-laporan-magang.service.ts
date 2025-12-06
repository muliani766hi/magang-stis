import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class PresentasiLaporanMagangService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }
  
  async create(mahasiswaId: number, createPresentasiLaporanMagangDto, file: string) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PresentasiLaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat presentasi laporan magang');
    }

    const presentasi = await this.prismaService.presentasiLaporanMagang.create({
      data: {
        fileDraftLaporanMagang: file,
        tanggal: new Date(createPresentasiLaporanMagangDto.tanggal),
        jumlahPenonton: createPresentasiLaporanMagangDto.jumlahPenonton,
        lokasiPresentasi: createPresentasiLaporanMagangDto.lokasiPresentasi,
        metodePresentasi: createPresentasiLaporanMagangDto.metodePresentasi,
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
      status: 'success',
      message: 'Laporan magang berhasil dibuat',
      data: presentasi
    }
  }

  async findAllBy(params: {
    mahasiswaId: number;
    tanggal: string;
    metodePresentasi: string;
  }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PresentasiLaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat presentasi laporan magang');
    }

    const presentasi = await this.prismaService.presentasiLaporanMagang.findMany({
      where: {
        AND: [accessibleBy(ability).PresentasiLaporanMagang],
        mahasiswaId: parseInt(params.mahasiswaId.toString()) || undefined,
        tanggal: (params.tanggal) ? new Date(params.tanggal) : undefined,
        metodePresentasi: params.metodePresentasi || undefined,
      },
      select: {
        presentasiId: true,
        fileDraftLaporanMagang: true,
        tanggal: true,
        jumlahPenonton: true,
        lokasiPresentasi: true,
        metodePresentasi: true,
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
          }
        }
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Berhasil menemukan data presentasi laporan magang',
      data: presentasi
    }
  }

  async update(presentasiLaporanMagangId: number, updatePresentasiLaporanMagangDto, file: string) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PresentasiLaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah presentasi laporan magang');
    }

    const presentasi = await this.prismaService.presentasiLaporanMagang.update({
      where: {
        presentasiId: parseInt(presentasiLaporanMagangId.toString())
      },
      data: {
        fileDraftLaporanMagang: file || undefined,
        tanggal: (updatePresentasiLaporanMagangDto.tanggal) ? new Date(updatePresentasiLaporanMagangDto.tanggal) : undefined,
        jumlahPenonton: updatePresentasiLaporanMagangDto.jumlahPenonton || undefined,
        lokasiPresentasi: updatePresentasiLaporanMagangDto.lokasiPresentasi || undefined,
        metodePresentasi: updatePresentasiLaporanMagangDto.metodePresentasi || undefined
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Laporan magang berhasil diubah',
      data: presentasi
    }
  }
}
