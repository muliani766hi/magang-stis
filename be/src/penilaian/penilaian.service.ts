import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenilaianBimbinganDto } from './dto/penilaianBimbingan/create-penilaianBimbingan.dto';
import { accessibleBy } from '@casl/prisma';
import { UpdatePenilaianBimbinganDto } from './dto/penilaianBimbingan/update-penilaianBimbingan.dto';
import { CreatePenilaianLaporanDosenDto } from './dto/penilaianLaporanDosen/create-penilaianLaporanDosen.dto';
import { CreatePenilaianKinerjaDto } from './dto/penilaianKinerja/create-penilaianKinerja.dto';
import { UpdatePenilaianLaporanDosenDto } from './dto/penilaianLaporanDosen/update-penilaianLaporanDosen.dto';
import { UpdatePenilaianKinerjaDto } from './dto/penilaianKinerja/update-penilaianKinerja.dto';
import { CreatePenilaianLaporanPemlapDto } from './dto/penilaianLaporanPemlap/create-penilaianLaporanPemlap.dto';
import { UpdatePenilaianLaporanPemlapDto } from './dto/penilaianLaporanPemlap/update-penilaianLaporanPemlap.dto';
@Injectable()
export class PenilaianService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request,
  ) { }
  
  //PENILAIAN BIMBINGAN
  async createManyPenilaianBimbingan(body: { mahasiswaId: number; createPenilaianBimbinganDto: CreatePenilaianBimbinganDto; }[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    
    if (!ability.can('create', 'PenilaianBimbingan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat penilaian');
    }
    
    let data = [];

    for (const item of body) {
      const cekPenilaian = await this.prismaService.penilaian.findUnique({
        where: {
          mahasiswaId: item.mahasiswaId,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });
      
      if (!cekPenilaian) {
        await this.prismaService.penilaian.create({
          data: {
            mahasiswa: {
              connect: {
                mahasiswaId: item.mahasiswaId,
              },
            },
          },
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      }
      
      const penilaian = await this.prismaService.penilaianBimbingan.create({
        data: {
          disiplin: item.createPenilaianBimbinganDto.disiplin,
          inisiatif: item.createPenilaianBimbinganDto.inisiatif,
          kemampuanBerfikir: item.createPenilaianBimbinganDto.kemampuanBerfikir,
          ketekunan: item.createPenilaianBimbinganDto.ketekunan,
          komunikasi: item.createPenilaianBimbinganDto.komunikasi,
          penilaian: {
            connect: {
              mahasiswaId: item.mahasiswaId,
            },
          },
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      data.push(penilaian);
    }
    
    return {
      status: 'success',
      message: 'Penilaian berhasil dibuat',
      data: data,
    }
  }

  async createPenilaianBimbingan(mahasiswaId: number, createPenilaianBimbinganDto : CreatePenilaianBimbinganDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PenilaianBimbingan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat penilaian');
    }

    const cekPenilaian = await this.prismaService.penilaian.findUnique({
      where: {
        mahasiswaId: mahasiswaId,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (!cekPenilaian) {
      await this.prismaService.penilaian.create({
        data: {
          mahasiswa: {
            connect: {
              mahasiswaId: mahasiswaId,
            },
          },
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });
    }

    const penilaianBimbingan = await this.prismaService.penilaianBimbingan.create({
      data: {
        disiplin: createPenilaianBimbinganDto.disiplin,
        inisiatif: createPenilaianBimbinganDto.inisiatif,
        kemampuanBerfikir: createPenilaianBimbinganDto.kemampuanBerfikir,
        ketekunan: createPenilaianBimbinganDto.ketekunan,
        komunikasi: createPenilaianBimbinganDto.komunikasi,
        penilaian: {
          connect: {
            mahasiswaId: mahasiswaId,
          },
        },
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil dibuat',
      data: penilaianBimbingan,
    }
  }

  async findAllPenilaianBimbingan(param: { nim: string }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PenilaianBimbingan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat penilaian');
    }

    const penilaianBimbingan = await this.prismaService.penilaianBimbingan.findMany({
      where: {
        AND: [accessibleBy(ability).PenilaianBimbingan],
        penilaian: {
          mahasiswa: {
            nim: {
              contains: param.nim
            },
          },
        },
      },
      include: {
        penilaian: {
          include: {
            mahasiswa: true,
          },
        },
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil ditemukan',
      data: penilaianBimbingan,
    }
  }

  async updateManyPenilaianBimbingan(body: { penilaianBimbinganId: number; updatePenilaianBimbinganDto: UpdatePenilaianBimbinganDto; }[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    
    if (!ability.can('update', 'PenilaianBimbingan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }
    
    let data = [];

    for (const item of body) {
      await this.prismaService.penilaianBimbingan.findFirstOrThrow({
        where: {
          penilaianBimbinganId: item.penilaianBimbinganId,
          AND: [accessibleBy(ability).PenilaianBimbingan],
        }
      }).catch(() => {
        throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      const penilaianBimbingan = await this.prismaService.penilaianBimbingan.update({
        where: {
          penilaianBimbinganId: item.penilaianBimbinganId,
        },
        data: {
          disiplin: item.updatePenilaianBimbinganDto.disiplin,
          inisiatif: item.updatePenilaianBimbinganDto.inisiatif,
          kemampuanBerfikir: item.updatePenilaianBimbinganDto.kemampuanBerfikir,
          ketekunan: item.updatePenilaianBimbinganDto.ketekunan,
          komunikasi: item.updatePenilaianBimbinganDto.komunikasi,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      data.push(penilaianBimbingan);
    }
    
    return {
      status: 'success',
      message: 'Penilaian berhasil diubah',
      data: data,
    }
  }

  async updatePenilaianBimbingan(penilaianBimbinganId: number, updatePenilaianBimbinganDto: UpdatePenilaianBimbinganDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PenilaianBimbingan')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }

    await this.prismaService.penilaianBimbingan.findFirstOrThrow({
      where: {
        penilaianBimbinganId: penilaianBimbinganId,
        AND: [accessibleBy(ability).PenilaianBimbingan],
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const penilaianBimbingan = await this.prismaService.penilaianBimbingan.update({
      where: {
        penilaianBimbinganId: penilaianBimbinganId,
      },
      data: {
        disiplin: updatePenilaianBimbinganDto.disiplin,
        inisiatif: updatePenilaianBimbinganDto.inisiatif,
        kemampuanBerfikir: updatePenilaianBimbinganDto.kemampuanBerfikir,
        ketekunan: updatePenilaianBimbinganDto.ketekunan,
        komunikasi: updatePenilaianBimbinganDto.komunikasi,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil diubah',
      data: penilaianBimbingan,
    }
  }

  //PENILAIAN LAPORAN DOSEN
  async createManyPenilaianLaporanDosen(body: { mahasiswaId: number; createPenilaianLaporanDosenDto: CreatePenilaianLaporanDosenDto; }[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    
    if (!ability.can('create', 'PenilaianLaporanDosen')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat penilaian');
    }
    
    let data = [];

    for (const item of body) {
      const cekPenilaian = await this.prismaService.penilaian.findUnique({
        where: {
          mahasiswaId: item.mahasiswaId,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });
      
      if (!cekPenilaian) {
        await this.prismaService.penilaian.create({
          data: {
            mahasiswa: {
              connect: {
                mahasiswaId: item.mahasiswaId,
              },
            },
          },
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      }
      
      const penilaianLaporanDosen = await this.prismaService.penilaianLaporanDosen.create({
        data: {
          penilaian: {
            connect: {
              mahasiswaId: item.mahasiswaId,
            },
          },
          var1: item.createPenilaianLaporanDosenDto.var1,
          var2: item.createPenilaianLaporanDosenDto.var2,
          var3: item.createPenilaianLaporanDosenDto.var3,
          var4: item.createPenilaianLaporanDosenDto.var4,
          var5: item.createPenilaianLaporanDosenDto.var5,
          var6: item.createPenilaianLaporanDosenDto.var6,
          var7: item.createPenilaianLaporanDosenDto.var7,
          var8: item.createPenilaianLaporanDosenDto.var8,
          var9: item.createPenilaianLaporanDosenDto.var9,
          var10: item.createPenilaianLaporanDosenDto.var10,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      data.push(penilaianLaporanDosen);
    }
    
    return {
      status: 'success',
      message: 'Penilaian berhasil dibuat',
      data: data,
    }
  }

  async createPenilaianLaporanDosen(mahasiswaId: number, createPenilaianLaporanDosenDto: CreatePenilaianLaporanDosenDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PenilaianLaporanDosen')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat penilaian');
    }

    const cekPenilaian = await this.prismaService.penilaian.findUnique({
      where: {
        mahasiswaId: mahasiswaId,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (!cekPenilaian) {
      await this.prismaService.penilaian.create({
        data: {
          mahasiswa: {
            connect: {
              mahasiswaId: mahasiswaId,
            },
          },
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });
    }

    const penilaianLaporanDosen = await this.prismaService.penilaianLaporanDosen.create({
      data: {
        penilaian: {
          connect: {
            mahasiswaId: mahasiswaId,
          },
        },
        var1: createPenilaianLaporanDosenDto.var1,
        var2: createPenilaianLaporanDosenDto.var2,
        var3: createPenilaianLaporanDosenDto.var3,
        var4: createPenilaianLaporanDosenDto.var4,
        var5: createPenilaianLaporanDosenDto.var5,
        var6: createPenilaianLaporanDosenDto.var6,
        var7: createPenilaianLaporanDosenDto.var7,
        var8: createPenilaianLaporanDosenDto.var8,
        var9: createPenilaianLaporanDosenDto.var9,
        var10: createPenilaianLaporanDosenDto.var10,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil dibuat',
      data: penilaianLaporanDosen,
    }
  }

  async findAllPenilaianLaporanDosen(param: { nim: string }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PenilaianLaporanDosen')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat penilaian');
    }

    const penilaianLaporanDosen = await this.prismaService.penilaianLaporanDosen.findMany({
      where: {
        AND: [accessibleBy(ability).PenilaianLaporanDosen],
        penilaian: {
          mahasiswa: {
            nim: {
              contains: param.nim
            },
          },
        },
      },
      include: {
        penilaian: {
          include: {
            mahasiswa: true,
          },
        },
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil ditemukan',
      data: penilaianLaporanDosen,
    }
  }

  async updateManyPenilaianLaporanDosen(body: { penilaianLaporanDosenId: number; updatePenilaianLaporanDosenDto: UpdatePenilaianLaporanDosenDto; }[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    
    if (!ability.can('update', 'PenilaianLaporanDosen')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }
    
    let data = [];

    for (const item of body) {
      await this.prismaService.penilaianLaporanDosen.findFirstOrThrow({
        where: {
          penilaianLaporanDosenId: item.penilaianLaporanDosenId,
          AND: [accessibleBy(ability).PenilaianLaporanDosen],
        }
      }).catch(() => {
        throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      const penilaianLaporanDosen = await this.prismaService.penilaianLaporanDosen.update({
        where: {
          penilaianLaporanDosenId: item.penilaianLaporanDosenId,
        },
        data: {
          var1: item.updatePenilaianLaporanDosenDto.var1,
          var2: item.updatePenilaianLaporanDosenDto.var2,
          var3: item.updatePenilaianLaporanDosenDto.var3,
          var4: item.updatePenilaianLaporanDosenDto.var4,
          var5: item.updatePenilaianLaporanDosenDto.var5,
          var6: item.updatePenilaianLaporanDosenDto.var6,
          var7: item.updatePenilaianLaporanDosenDto.var7,
          var8: item.updatePenilaianLaporanDosenDto.var8,
          var9: item.updatePenilaianLaporanDosenDto.var9,
          var10: item.updatePenilaianLaporanDosenDto.var10,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      data.push(penilaianLaporanDosen);
    }
    
    return {
      status: 'success',
      message: 'Penilaian berhasil diubah',
      data: data,
    }
  }

  async updatePenilaianLaporanDosen(penilaianLaporanDosenId: number, updatePenilaianLaporanDosenDto: UpdatePenilaianLaporanDosenDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PenilaianLaporanDosen')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }

    await this.prismaService.penilaianLaporanDosen.findFirstOrThrow({
      where: {
        penilaianLaporanDosenId: penilaianLaporanDosenId,
        AND: [accessibleBy(ability).PenilaianLaporanDosen],
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const penilaianLaporanDosen = await this.prismaService.penilaianLaporanDosen.update({
      where: {
        penilaianLaporanDosenId: penilaianLaporanDosenId,
      },
      data: {
        var1: updatePenilaianLaporanDosenDto.var1,
        var2: updatePenilaianLaporanDosenDto.var2,
        var3: updatePenilaianLaporanDosenDto.var3,
        var4: updatePenilaianLaporanDosenDto.var4,
        var5: updatePenilaianLaporanDosenDto.var5,
        var6: updatePenilaianLaporanDosenDto.var6,
        var7: updatePenilaianLaporanDosenDto.var7,
        var8: updatePenilaianLaporanDosenDto.var8,
        var9: updatePenilaianLaporanDosenDto.var9,
        var10: updatePenilaianLaporanDosenDto.var10,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil diubah',
      data: penilaianLaporanDosen,
    }
  }

  //PENILAIAN KINERJA
  async createManyPenilaianKinerja(body: { mahasiswaId: number; createPenilaianKinerjaDto: CreatePenilaianKinerjaDto; }[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    
    if (!ability.can('create', 'PenilaianKinerja')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat penilaian');
    }
    
    let data = [];

    for (const item of body) {
      const cekPenilaian = await this.prismaService.penilaian.findUnique({
        where: {
          mahasiswaId: item.mahasiswaId,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });
      
      if (!cekPenilaian) {
        await this.prismaService.penilaian.create({
          data: {
            mahasiswa: {
              connect: {
                mahasiswaId: item.mahasiswaId,
              },
            },
          },
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      }
      
      const penilaianKinerja = await this.prismaService.penilaianKinerja.create({
        data: {
          penilaian: {
            connect: {
              mahasiswaId: item.mahasiswaId,
            },
          },
          disiplin: item.createPenilaianKinerjaDto.disiplin,
          hasil: item.createPenilaianKinerjaDto.hasil,
          initiatif: item.createPenilaianKinerjaDto.initiatif,
          kemampuanBeradaptasi: item.createPenilaianKinerjaDto.kemampuanBeradaptasi,
          kemampuanBerfikir: item.createPenilaianKinerjaDto.kemampuanBerfikir,
          kerjasama: item.createPenilaianKinerjaDto.kerjasama,
          ketekunan: item.createPenilaianKinerjaDto.ketekunan,
          komunikasi: item.createPenilaianKinerjaDto.komunikasi,
          penampilan: item.createPenilaianKinerjaDto.penampilan,
          teknikal: item.createPenilaianKinerjaDto.teknikal,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      data.push(penilaianKinerja);
    }
    
    return {
      status: 'success',
      message: 'Penilaian berhasil dibuat',
      data: data,
    }
  }

  async createPenilaianKinerja(mahasiswaId: number, createPenilaianKinerjaDto: CreatePenilaianKinerjaDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PenilaianKinerja')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat penilaian');
    }

    const cekPenilaian = await this.prismaService.penilaian.findUnique({
      where: {
        mahasiswaId: mahasiswaId,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (!cekPenilaian) {
      await this.prismaService.penilaian.create({
        data: {
          mahasiswa: {
            connect: {
              mahasiswaId: mahasiswaId,
            },
          },
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });
    }

    const penilaianKinerja = await this.prismaService.penilaianKinerja.create({
      data: {
        penilaian: {
          connect: {
            mahasiswaId: mahasiswaId,
          },
        },
        disiplin: createPenilaianKinerjaDto.disiplin,
        hasil: createPenilaianKinerjaDto.hasil,
        initiatif: createPenilaianKinerjaDto.initiatif,
        kemampuanBeradaptasi: createPenilaianKinerjaDto.kemampuanBeradaptasi,
        kemampuanBerfikir: createPenilaianKinerjaDto.kemampuanBerfikir,
        kerjasama: createPenilaianKinerjaDto.kerjasama,
        ketekunan: createPenilaianKinerjaDto.ketekunan,
        komunikasi: createPenilaianKinerjaDto.komunikasi,
        penampilan: createPenilaianKinerjaDto.penampilan,
        teknikal: createPenilaianKinerjaDto.teknikal,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil dibuat',
      data: penilaianKinerja,
    }
  }

  async findAllPenilaianKinerja(param: { nim: string }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PenilaianKinerja')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat penilaian');
    }

    const penilaianKinerja = await this.prismaService.penilaianKinerja.findMany({
      where: {
        AND: [accessibleBy(ability).PenilaianKinerja],
        penilaian: {
          mahasiswa: {
            nim: {
              contains: param.nim
            },
          },
        },
      },
      include: {
        penilaian: {
          include: {
            mahasiswa: true,
          },
        },
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil ditemukan',
      data: penilaianKinerja,
    }
  }

  async updateManyPenilaianKinerja(body: { penilaianKinerjaId: number; updatePenilaianKinerjaDto: UpdatePenilaianKinerjaDto; }[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    
    if (!ability.can('update', 'PenilaianKinerja')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }
    
    let data = [];

    for (const item of body) {
      await this.prismaService.penilaianKinerja.findFirstOrThrow({
        where: {
          penilaianKinerjaId: item.penilaianKinerjaId,
          AND: [accessibleBy(ability).PenilaianKinerja],
        }
      }).catch(() => {
        throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      const penilaianKinerja = await this.prismaService.penilaianKinerja.update({
        where: {
          penilaianKinerjaId: item.penilaianKinerjaId,
        },
        data: {
          disiplin: item.updatePenilaianKinerjaDto.disiplin,
          hasil: item.updatePenilaianKinerjaDto.hasil,
          initiatif: item.updatePenilaianKinerjaDto.initiatif,
          kemampuanBeradaptasi: item.updatePenilaianKinerjaDto.kemampuanBeradaptasi,
          kemampuanBerfikir: item.updatePenilaianKinerjaDto.kemampuanBerfikir,
          kerjasama: item.updatePenilaianKinerjaDto.kerjasama,
          ketekunan: item.updatePenilaianKinerjaDto.ketekunan,
          komunikasi: item.updatePenilaianKinerjaDto.komunikasi,
          penampilan: item.updatePenilaianKinerjaDto.penampilan,
          teknikal: item.updatePenilaianKinerjaDto.teknikal,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      data.push(penilaianKinerja);
    }
    
    return {
      status: 'success',
      message: 'Penilaian berhasil diubah',
      data: data,
    }
  }

  async updatePenilaianKinerja(penilaianKinerjaId: number, createPenilaianKinerjaDto: UpdatePenilaianKinerjaDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PenilaianKinerja')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }

    await this.prismaService.penilaianKinerja.findFirstOrThrow({
      where: {
        penilaianKinerjaId: penilaianKinerjaId,
        AND: [accessibleBy(ability).PenilaianKinerja],
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const penilaianKinerja = await this.prismaService.penilaianKinerja.update({
      where: {
        penilaianKinerjaId: penilaianKinerjaId,
      },
      data: {
        disiplin: createPenilaianKinerjaDto.disiplin,
        hasil: createPenilaianKinerjaDto.hasil,
        initiatif: createPenilaianKinerjaDto.initiatif,
        kemampuanBeradaptasi: createPenilaianKinerjaDto.kemampuanBeradaptasi,
        kemampuanBerfikir: createPenilaianKinerjaDto.kemampuanBerfikir,
        kerjasama: createPenilaianKinerjaDto.kerjasama,
        ketekunan: createPenilaianKinerjaDto.ketekunan,
        komunikasi: createPenilaianKinerjaDto.komunikasi,
        penampilan: createPenilaianKinerjaDto.penampilan,
        teknikal: createPenilaianKinerjaDto.teknikal,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil diubah',
      data: penilaianKinerja,
    }
  }

  //PENILAIAN LAPOAN PEMLAP
  async createManyPenilaianLaporanPemlap(body: { mahasiswaId: number; createPenilaianLaporanPemlapDto: CreatePenilaianLaporanPemlapDto; }[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    
    if (!ability.can('create', 'PenilaianLaporanPemlap')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat penilaian');
    }
    
    let data = [];

    for (const item of body) {
      const cekPenilaian = await this.prismaService.penilaian.findUnique({
        where: {
          mahasiswaId: item.mahasiswaId,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });
      
      if (!cekPenilaian) {
        await this.prismaService.penilaian.create({
          data: {
            mahasiswa: {
              connect: {
                mahasiswaId: item.mahasiswaId,
              },
            },
          },
        }).finally(() => {
          this.prismaService.$disconnect();
        });
      }
      
      const penilaianLaporanPemlap = await this.prismaService.penilaianLaporanPemlap.create({
        data: {
          penilaian: {
            connect: {
              mahasiswaId: item.mahasiswaId,
            },
          },
          var1: item.createPenilaianLaporanPemlapDto.var1,
          var2: item.createPenilaianLaporanPemlapDto.var2,
          var3: item.createPenilaianLaporanPemlapDto.var3,
          var4: item.createPenilaianLaporanPemlapDto.var4,
          var5: item.createPenilaianLaporanPemlapDto.var5,
          var6: item.createPenilaianLaporanPemlapDto.var6,
          var7: item.createPenilaianLaporanPemlapDto.var7,
          var8: item.createPenilaianLaporanPemlapDto.var8,
          var9: item.createPenilaianLaporanPemlapDto.var9,
          var10: item.createPenilaianLaporanPemlapDto.var10,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      data.push(penilaianLaporanPemlap);
    }
    
    return {
      status: 'success',
      message: 'Penilaian berhasil dibuat',
      data: data,
    }
  }

  async createPenilaianLaporanPemlap(mahasiswaId: number, createPenilaianLaporanPemlapDto: CreatePenilaianLaporanPemlapDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('create', 'PenilaianLaporanPemlap')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk membuat penilaian');
    }

    const cekPenilaian = await this.prismaService.penilaian.findUnique({
      where: {
        mahasiswaId: mahasiswaId,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    if (!cekPenilaian) {
      await this.prismaService.penilaian.create({
        data: {
          mahasiswa: {
            connect: {
              mahasiswaId: mahasiswaId,
            },
          },
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });
    }

    const penilaianLaporanPemlap = await this.prismaService.penilaianLaporanPemlap.create({
      data: {
        penilaian: {
          connect: {
            mahasiswaId: mahasiswaId,
          },
        },
        var1: createPenilaianLaporanPemlapDto.var1,
        var2: createPenilaianLaporanPemlapDto.var2,
        var3: createPenilaianLaporanPemlapDto.var3,
        var4: createPenilaianLaporanPemlapDto.var4,
        var5: createPenilaianLaporanPemlapDto.var5,
        var6: createPenilaianLaporanPemlapDto.var6,
        var7: createPenilaianLaporanPemlapDto.var7,
        var8: createPenilaianLaporanPemlapDto.var8,
        var9: createPenilaianLaporanPemlapDto.var9,
        var10: createPenilaianLaporanPemlapDto.var10,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil dibuat',
      data: penilaianLaporanPemlap,
    }
  }

  async findAllPenilaianLaporanPemlap(param: { nim: string }) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PenilaianLaporanPemlap')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat penilaian');
    }

    const penilaianLaporanPemlap = await this.prismaService.penilaianLaporanPemlap.findMany({
      where: {
        AND: [accessibleBy(ability).PenilaianLaporanPemlap],
        penilaian: {
          mahasiswa: {
            nim: {
              contains: param.nim
            },
          },
        },
      },
      include: {
        penilaian: {
          include: {
            mahasiswa: true,
          },
        },
      }
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil ditemukan',
      data: penilaianLaporanPemlap,
    }
  }

  async updateManyPenilaianLaporanPemlap(body: { penilaianLaporanPemlapId: number; updatePenilaianLaporanPemlapDto: UpdatePenilaianLaporanPemlapDto; }[]) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);
    
    if (!ability.can('update', 'PenilaianLaporanPemlap')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }
    
    let data = [];

    for (const item of body) {
      await this.prismaService.penilaianLaporanPemlap.findFirstOrThrow({
        where: {
          penilaianLaporanPemlapId: item.penilaianLaporanPemlapId,
          AND: [accessibleBy(ability).PenilaianLaporanPemlap],
        }
      }).catch(() => {
        throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      const penilaianLaporanPemlap = await this.prismaService.penilaianLaporanPemlap.update({
        where: {
          penilaianLaporanPemlapId: item.penilaianLaporanPemlapId,
        },
        data: {
          var1: item.updatePenilaianLaporanPemlapDto.var1,
          var2: item.updatePenilaianLaporanPemlapDto.var2,
          var3: item.updatePenilaianLaporanPemlapDto.var3,
          var4: item.updatePenilaianLaporanPemlapDto.var4,
          var5: item.updatePenilaianLaporanPemlapDto.var5,
          var6: item.updatePenilaianLaporanPemlapDto.var6,
          var7: item.updatePenilaianLaporanPemlapDto.var7,
          var8: item.updatePenilaianLaporanPemlapDto.var8,
          var9: item.updatePenilaianLaporanPemlapDto.var9,
          var10: item.updatePenilaianLaporanPemlapDto.var10,
        },
      }).finally(() => {
        this.prismaService.$disconnect();
      });

      data.push(penilaianLaporanPemlap);
    }

    return {
      status: 'success',
      message: 'Penilaian berhasil diubah',
      data: data,
    }
  }

  async updatePenilaianLaporanPemlap(penilaianLaporanPemlapId: number, updatePenilaianLaporanPemlapDto: UpdatePenilaianLaporanPemlapDto) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'PenilaianLaporanPemlap')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }

    await this.prismaService.penilaianLaporanPemlap.findFirstOrThrow({
      where: {
        penilaianLaporanPemlapId: penilaianLaporanPemlapId,
        AND: [accessibleBy(ability).PenilaianLaporanPemlap],
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengubah penilaian');
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    const penilaianLaporanPemlap = await this.prismaService.penilaianLaporanPemlap.update({
      where: {
        penilaianLaporanPemlapId: penilaianLaporanPemlapId,
      },
      data: {
        var1: updatePenilaianLaporanPemlapDto.var1,
        var2: updatePenilaianLaporanPemlapDto.var2,
        var3: updatePenilaianLaporanPemlapDto.var3,
        var4: updatePenilaianLaporanPemlapDto.var4,
        var5: updatePenilaianLaporanPemlapDto.var5,
        var6: updatePenilaianLaporanPemlapDto.var6,
        var7: updatePenilaianLaporanPemlapDto.var7,
        var8: updatePenilaianLaporanPemlapDto.var8,
        var9: updatePenilaianLaporanPemlapDto.var9,
        var10: updatePenilaianLaporanPemlapDto.var10,
      },
    }).finally(() => {
      this.prismaService.$disconnect();
    });

    return {
      status: 'success',
      message: 'Penilaian berhasil diubah',
      data: penilaianLaporanPemlap,
    }
  }
}
