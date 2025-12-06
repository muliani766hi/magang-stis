// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-google-oauth20';
// import { PrismaService } from '../../prisma/prisma.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     private readonly prismaService: PrismaService,
//   ) {
//     super({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.BASE_URL+'/auth/google/callback',
//       scope: ['email', 'profile'],
//     });
//   }

//   // make sure to add this or else you won't get the refresh token
//   authorizationParams(): { [key: string]: string } {
//     return {
//       access_type: 'offline',
//       prompt: 'consent',
//     };
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ) {
//     const { name, emails, photos } = profile;

//     const user = {
//       email: emails[0].value,
//       firstName: name.givenName,
//       lastName: name.familyName,
//       picture: photos[0].value,
//       accessToken,
//       refreshToken,
//     };

//     if (user.email.split('@')[1] !== 'stis.ac.id') {
//       throw new NotFoundException('Invalid email');
//     }

//     await this.prismaService.user.findFirstOrThrow({
//       where: {
//         email: user.email,
//         tahunAjaran: {
//           isActive: true,
//         },
//       },
//       select: {
//         userId: true,
//         email: true,
//         userRoles: {
//           select: {
//             roleId: true,
//             role: {
//               select: {
//                 roleName: true,
//               },
//             },
//           },
//         },
//       },
//     }).catch(() => {
//       throw new NotFoundException('User not found')
//     });

//     done(null, user);
//   }
// }