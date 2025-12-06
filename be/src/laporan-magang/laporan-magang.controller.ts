import { Controller, Get, Post, Body, Put, Param, Delete, UploadedFile, UseInterceptors, UseGuards, BadRequestException, Query, Res, Request, ForbiddenException } from '@nestjs/common';
import { LaporanMagangService } from './laporan-magang.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { join } from 'path';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Controller('laporan-magang')
@ApiTags('Laporan Magang')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LaporanMagangController {
  constructor(
    private readonly laporanMagangService: LaporanMagangService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory
  ) { }
  
  @Post(':mahasiswaId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file',
      {
        fileFilter: (req, file, cb) => {
          if (file.mimetype !== 'application/pdf') {
            return cb(new BadRequestException('File laporan magang harus berupa file PDF'), false);
          } else {
            cb(null, true);
          }
        },
        storage: diskStorage({
          destination: './public/file-laporan-magang-final',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `LAPORAN-${uniqueSuffix}-${file.originalname}`);
          },
        }),
        limits: {
          fileSize: 20 * 1024 * 1024
        }
      }
    )
  )
  create(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body('json') createLaporanMagangDto: string,
    @UploadedFile('file') file: Express.Multer.File
  ) {
    createLaporanMagangDto = JSON.parse(createLaporanMagangDto);

    return this.laporanMagangService.create(+mahasiswaId, createLaporanMagangDto, file.filename);
  }

  @Get()
  findLaporanBy(
    @Query() param: {
      mahasiswaId: number
    }
  ) {
    return this.laporanMagangService.findLaporanBy(param);
  }

  @Get('download/:fileLaporan')
  downloadFile(
    @Param('fileLaporan') fileLaporan: string,
    @Res() response: Response,
    @Request() request: Request
  ) {
    const injectedToken = request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'LaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat laporan magang');
    }

    return response.sendFile(join(process.cwd(), 'public/file-laporan-magang-final/' + fileLaporan));
  }

  @Put(':laporanId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file',
      {
        fileFilter: (req, file, cb) => {
          if (file.mimetype !== 'application/pdf') {
            return cb(new BadRequestException('File laporan magang harus berupa file PDF'), false);
          } else {
            cb(null, true);
          }
        },
        storage: diskStorage({
          destination: './public/file-laporan-magang-final',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `LAPORAN-${uniqueSuffix}-${file.originalname}`);
          },
        }),
        limits: {
          fileSize: 20 * 1024 * 1024
        }
      }
    )
    )
  update(
    @Param('laporanId') laporanId: string,
    @Body('json') updateLaporanMagangDto: string,
    @UploadedFile('file') file: Express.Multer.File
  ) {
    updateLaporanMagangDto = JSON.parse(updateLaporanMagangDto);

    return this.laporanMagangService.update(+laporanId, updateLaporanMagangDto, file.filename);
  }

  // @Put('approve/:laporanId')
  // approve(
  //   @Param('laporanId') laporanId: number
  // ) {
  //   return this.laporanMagangService.approve(+laporanId);
  // }

  // @Put('ulas/:laporanId')
  // ulas(
  //   @Param('laporanId') laporanId: number,
  //   @Body() body: {
  //     ulasan: string
  //   }
  // ) {
  //   return this.laporanMagangService.ulas(+laporanId, body);
  // }

  @Get('periode-pengumpulan-laporan-magang')
  getPeriodePengumpulanLaporanMagang(
    @Query() params: {
      tahunAjaranId: number
    }
  ) {
    return this.laporanMagangService.getPeriodePengumpulanLaporanMagang(params);
  }

  @Post('periode-pengumpulan-laporan-magang')
  createPeriodePengumpulanLaporanMagang(@Body() periode: {
    tanggalMulai: Date,
    tanggalAkhir: Date,
    tahunAjaranId: number
  }) {
    return this.laporanMagangService.createPeriodePengumpulanLaporanMagang(periode);
  }

  @Put('periode-pengumpulan-laporan-magang/:periodeId')
  updatePeriodePengumpulanLaporanMagang(
    @Param('periodeId') periodeId: number,
    @Body() periode: {
      tanggalMulai: Date,
      tanggalAkhir: Date
    }
  ) {
    return this.laporanMagangService.updatePeriodePengumpulanLaporanMagang(+periodeId, periode);
  }

  @Delete('periode-pengumpulan-laporan-magang/:periodeId')
  deletePeriodePengumpulanLaporanMagang(
    @Param('periodeId') periodeId: number
  ) {
    return this.laporanMagangService.deletePeriodePengumpulanLaporanMagang(+periodeId);
  }
}
