import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PengumumanService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async fetchAll() {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payloadJwt = this.jwtService.decode(injectedToken);
    
    let result;
    if (payloadJwt.role === 'admin') {
      const pengumuman = await this.prisma.pengumuman.findMany({
        include: {
          role: true
        },
        orderBy: { createdAt: 'desc' },
      })
      const groupedMap = new Map<number, {
        judul: string;
        deskripsi: string;
        groupId: number;
        tanggal: Date;
        role: string[];
      }>();

      pengumuman.forEach(item => {
        if (!groupedMap.has(item.groupId)) {
          groupedMap.set(item.groupId, {
            judul: item.judul,
            deskripsi: item.deskripsi,
            groupId: item.groupId,
            tanggal: item.createdAt,
            role: [item.role.roleName],
          });
        } else {
          const existing = groupedMap.get(item.groupId)!;
          existing.role.push(item.role.roleName);
        }
      });
      result = Array.from(groupedMap.values());
    }else {
      const pengumuman = await this.prisma.pengumuman.findMany({
        where:{
          roleId: payloadJwt.roleId
        },
        include: {
          role: true
        },
        orderBy: { createdAt: 'desc' },
      })
      const groupedMap = new Map<number, {
        judul: string;
        deskripsi: string;
        groupId: number;
        tanggal: Date;
        role: string[];
      }>();

      pengumuman.forEach(item => {
        if (!groupedMap.has(item.groupId)) {
          groupedMap.set(item.groupId, {
            judul: item.judul,
            deskripsi: item.deskripsi,
            groupId: item.groupId,
            tanggal: item.createdAt,
            role: [item.role.roleName],
          });
        } else {
          const existing = groupedMap.get(item.groupId)!;
          existing.role.push(item.role.roleName);
        }
      });
      result = Array.from(groupedMap.values());
    }



    return {
      data: result
    }
  }

  async create(payload: any) {
    const groupId = Math.floor(1000 + Math.random() * 9000);
    Promise.all(payload.roleIds.map(async (value) => {
      await this.prisma.pengumuman.create({
        data: {
          roleId: Number(value),
          judul: payload.judul,
          deskripsi: payload.isi,
          groupId: groupId
        }
      })
    }))


    return {
      status: "Sukses",
      message: "Berhasil membuat pengumuman"
    }
  }

  async delete(groupId: any) {
    const pengumuman = await this.prisma.pengumuman.findMany({
      where: {
        groupId: Number(groupId)
      }
    })

    await this.prisma.pengumuman.deleteMany({
      where: {
        id: {
          in: pengumuman.map(value => value.id)
        }
      }
    })


    return {
      status: "Sukses",
      message: "Berhasil menghapus pengumuman"
    }
  }
}