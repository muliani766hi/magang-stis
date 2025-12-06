import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, BadRequestException, UploadedFile, Query, Put, Res, Request, ForbiddenException } from '@nestjs/common';
import { PresentasiLaporanMagangService } from './presentasi-laporan-magang.service';
import { CreatePresentasiLaporanMagangDto } from './dto/create-presentasiLaporanMagang.dto';
import { UpdatePresentasiLaporanMagangDto } from './dto/update-presentasiLaporanMagang.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { join } from 'path';
import { Response } from 'express';

@Controller('presentasi-laporan-magang')
  @ApiTags('Presentasi Laporan Magang')
@UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
export class PresentasiLaporanMagangController {
  constructor(
    private readonly presentasiLaporanMagangService: PresentasiLaporanMagangService,
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
            return cb(new BadRequestException('File ddraft laporan magang harus berupa file PDF'), false);
          } else {
            cb(null, true);
          }
        },
        storage: diskStorage({
          destination: './public/file-draft-laporan-magang',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `PRESENTASI-${uniqueSuffix}-${file.originalname}`);
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
    @Body('json') createPresentasiLaporanMagang: string,
    @UploadedFile('file') file: Express.Multer.File
  ) {
    createPresentasiLaporanMagang = JSON.parse(createPresentasiLaporanMagang);

    return this.presentasiLaporanMagangService.create(+mahasiswaId, createPresentasiLaporanMagang, file.filename);
  }

  @Get()
  findAllBy(
    @Query() params: {
      mahasiswaId: number;
      tanggal: string;
      metodePresentasi: string;
    }
  ) {
    return this.presentasiLaporanMagangService.findAllBy(params);
  }

  @Put(':presentasiLaporanMagangId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file',
      {
        fileFilter: (req, file, cb) => {
          if (file.mimetype !== 'application/pdf') {
            cb(new BadRequestException('File ddraft laporan magang harus berupa file PDF'), false);
          } else {
            cb(null, true);
          }
        },
        storage: diskStorage({
          destination: './public/file-draft-laporan-magang',
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `PRESENTASI-${uniqueSuffix}-${file.originalname}`);
          },
        }),
        limits: {
          fileSize: 20 * 1024 * 1024
        }
      }
    )
  )
  update(
    @Param('presentasiLaporanMagangId') presentasiLaporanMagangId: string,
    @Body('json') updatePresentasiLaporanMagangDto: string,
    @UploadedFile('file') file: Express.Multer.File
  ) {
    updatePresentasiLaporanMagangDto = JSON.parse(updatePresentasiLaporanMagangDto);

    return this.presentasiLaporanMagangService.update(+presentasiLaporanMagangId, updatePresentasiLaporanMagangDto, file.filename);
  }

  @Get('download/:fileDraftLaporan')
  downloadFile(
    @Param('fileDraftLaporan') fileDraftLaporan: string,
    @Res() response: Response,
    @Request() request: Request
  ) {
    const injectedToken = request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PresentasiLaporanMagang')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat draft laporan magang untuk presentasi laporan magang');
    }

    return response.sendFile(join(process.cwd(), 'public/file-draft-laporan-magang/' + fileDraftLaporan));
  }
}
