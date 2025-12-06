import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { REQUEST } from '@nestjs/core';
import { accessibleBy } from '@casl/prisma';
import { IsEmail } from 'class-validator';
import { UpdateUserDto } from './dto/users/update-user.dto';

@Injectable()
export class UsersService{
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async user(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        mahasiswa: true,
        dosenPembimbingMagang: true,
        pembimbingLapangan: true,
        adminProvinsi: true,
        adminSatker: true,
        tahunAjaran: true,
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'Success',
      message: 'User berhasil ditemukan',
      data: user
    };
  }

  async users(params) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'User')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat user');
    }

    const users = await this.prisma.user.findMany({
      where: {
        userId: parseInt(params.userId) || undefined,
        email: {
          contains: params.email,
          mode: 'insensitive',
        },
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'Success',
      message: 'User berhasil ditemukan',
      data: users
    }
  }

  async updateUser(
    userId: number,
    updateUser: UpdateUserDto
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken) ;
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'User')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate user');
    }

    await this.prisma.user.findFirstOrThrow({
      where: {
        userId: parseInt(userId.toString()),
        AND: [accessibleBy(ability).User]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate user ini');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const hashedPassword = await bcrypt.hash(updateUser.password, 10);

    const user = await this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        email: updateUser.email,
        password: hashedPassword,
      },
    });

    return {
      status: 'Success',
      message: 'User berhasil diupdate',
      data : user
    };
  }

  async updatePassword(
    userId: number,
    updatePassword: {
      oldPassword: string,
      newPassword: string
    }
  ) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('update', 'User')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate password user');
    }

    await this.prisma.user.findFirstOrThrow({
      where: {
        userId: parseInt(userId.toString()),
        AND: [accessibleBy(ability).User]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengupdate password user ini');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    const user = await this.prisma.user.findFirst({
      where: {
        userId: userId,
      },
    });

    const isPasswordValid = await bcrypt.compare(updatePassword.oldPassword, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Password lama tidak sesuai');
    }

    const hashedPassword = await bcrypt.hash(updatePassword.newPassword, 10);

    await this.prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        password: hashedPassword,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'Success',
      message: 'Password berhasil diupdate',
    };
  }

  async deleteUser(userId: number) {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('delete', 'User')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus user');
    }

    await this.prisma.user.findFirstOrThrow({
      where: {
        userId: parseInt(userId.toString()),
        AND: [accessibleBy(ability).User]
      }
    }).catch(() => {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus user');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    await this.prisma.user.delete({
      where: {
        userId: userId,
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      status: 'Success',
      message: 'User berhasil dihapus',
    };
  }
}
