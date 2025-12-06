import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
  Res,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './entity/auth.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
// import { CheckTokenExpiryGuard } from './guard/checkTokenExpiry.guard';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) { }
  
  // @Post('signup')
  // async signupUser(
  //   @Body() {
  //     email,
  //     password
  //   }: CreateUserDto,
  // ): Promise<UserModel> {
  //   return this.usersService.createUser({ email, password });
  // }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async loginUser(
    @Body() {
      email,
      password
    }: LoginDto,
    @Request() req: any
  ) {
    //check if there is no token in the header
    if (!req.headers['authorization']) {
      return this.authService.login(email, password, null);
    }

    //if there is a token in the header, pass it to the login method
    return this.authService.login(email, password, req.headers['authorization'].split(' ')[1].toString());
  }

  @Post('logout')
  async logoutUser(@Request() req) {
    return this.authService.logout(req.headers['authorization']);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser() {
    return this.authService.me();
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // googleLogin() { }

  // @Get('google/callback')
  // @UseGuards(AuthGuard('google'))
  // googleLoginCallback(@Request() req, @Res() res: Response) {
  //   const googleToken = req.user.accessToken;
  //   const googleRefreshToken = req.user.refreshToken;

  //   res.cookie('access_token', googleToken, { httpOnly: true });
  //   res.cookie('refresh_token', googleRefreshToken, {
  //     httpOnly: true,
  //   });


  //   res.redirect(process.env.BASE_URL+'/auth/google/create-jwt');
  // }

  // @UseGuards(CheckTokenExpiryGuard)
  // @Get('google/create-jwt')
  // async googleCreateJwt(@Request() req) {
  //   const accessToken = req.cookies['access_token'];
  //   if (accessToken) {
  //     return (await this.authService.googleCreateJwt(accessToken));
  //   }
  //   throw new UnauthorizedException('No access token');
  // }

  // @Get('google/logout')
  // logout(@Req() req, @Res() res: Response) {
  //   const refreshToken = req.cookies['refresh_token'];
  //   res.clearCookie('access_token');
  //   res.clearCookie('refresh_token');
  //   return this.authService.revokeGoogleToken(refreshToken);
  // }
}
