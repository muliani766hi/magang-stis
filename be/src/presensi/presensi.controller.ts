import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query, UseInterceptors, BadRequestException, UploadedFile, Res, Request, ForbiddenException } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { CreatePresensiDto } from '../presensi/dto/create-presensi.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { join } from 'path';
import e, { Response } from 'express';
import { CreateIzinPresensiDto } from './dto/create-izinPresensi.dto';

@Controller('presensi')
@ApiTags('presensi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PresensiController {
  constructor(
    private readonly presensiService: PresensiService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory
  ) { }

  
 

  //Izin Presensi
  @Get('izin-presensi')
  findAllIzinPresensi() {
    return this.presensiService.findAllIzinPresensi();
  }
  
  @Post('izin-presensi')
  createIzinPresensi(
    @Body() createIzinPresensiDto: CreateIzinPresensiDto
  ) {
    return this.presensiService.createIzinPresensi(createIzinPresensiDto);
  }

  @Put('izin-presensi/:izinId')
  updateIzinPresensi(
    @Param('izinId') izinId: number,
    @Body() updateIzinPresensiDto: CreateIzinPresensiDto
  ) {
    return this.presensiService.updateIzinPresensi(+izinId, updateIzinPresensiDto);
  }

  @Put('izin-presensi/bukti/:izinId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
  
        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new BadRequestException('File harus berupa PDF atau JPG'), false);
        } else {
          cb(null, true);
        }
      },
      storage: diskStorage({
        destination: './public/file-bukti-izin-presensi',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_'); // Optional: hilangkan spasi
          cb(null, `BUKTI-${uniqueSuffix}-${sanitizedOriginalName}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    })
  )  
  uploadBuktiPendukung(
    @UploadedFile('file') file: Express.Multer.File,
    @Param('izinId') izinId: number
  ) {
    return this.presensiService.uploadBuktiPendukung(izinId, file.filename);
  }

  @Get('izin-presensi/download/:fileBuktiIzinPresensi')
  downloadFile(
    @Param('fileBuktiIzinPresensi') fileBukti: string,
    @Res() response: Response,
    @Request() request: Request
  ) {
    const injectedToken = request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'IzinPresensi')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat laporan magang');
    }

    return response.sendFile(join(process.cwd(), 'public/file-bukti-izin-presensi/' + fileBukti));
  }

  @Put('izin-presensi/:izinId/approve')
  approveIzinPresensi(
    @Param('izinId') izinId: number
  ) {
    return this.presensiService.approveIzinPresensi(+izinId);
  }

  @Put('izin-presensi/:izinId/reject')
  rejectIzinPresensi(
    @Param('izinId') izinId: number
  ) {
    return this.presensiService.rejectIzinPresensi(+izinId);
  }

  //Presensi
  @Get()
  findAllPresensiBy(
    @Query() params: {
      tanggal: string,
      mahasiswaId: number,
    },
  ) {
    return this.presensiService.findAllPresensiBy(params);
  }

  @Get('/grouping')
  findAllPresensi() {
    return this.presensiService.findAllPresensiByMahasiswa();
  }

  @Get('/chart/:mahasiswaId')
  findAllPresensiById(
    @Param('mahasiswaId') mahasiswaId: number
  ) {
    return this.presensiService.findAllPresensiByMahasiswaId(Number(mahasiswaId));
  }

  @Get('/presensi/chart/izin-presensi')
  chartPerizinan() {
    return this.presensiService.chartPerizinan();
  }

  @Post()
  create(
    @Body() createPresensiDto: CreatePresensiDto
  ) {
    return this.presensiService.create(createPresensiDto);
  }


  @Delete(':presensiId')
  remove(@Param('presensiId') presensiId: number) {
    return this.presensiService.remove(+presensiId);
  }
}
