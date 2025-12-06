import { Controller, Get, Post, Body, Put, Param, Delete, UploadedFile, UseInterceptors, UseGuards, BadRequestException, Query, Res, Request, ForbiddenException, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { DokumenTranslokService } from './dokumen-translok.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import * as path from 'path';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { existsSync } from 'fs';

@ApiTags('Dokumen Translok')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dokumen-translok')
export class DokumenTranslokController {
  constructor(
    private readonly dokumenTranslokService: DokumenTranslokService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory
  ) { }

  //buat download dokumen translok
  @Get('/download')
  downloadFile(
    @Query('fileLaporan') fileLaporan: string,
    @Res() res: Response,
  ) {
    const fileName = path.basename(fileLaporan); // 🛡️ aman dari path traversal
    const filePath = path.join(process.cwd(), 'public/file-dokumen-translok', fileName);
    console.log(filePath)
    if (!existsSync(filePath)) {
      throw new NotFoundException('File tidak ditemukan');
    }

    console.log(filePath)
    return res.sendFile(path.join(process.cwd(), 'public/file-dokumen-translok/' + fileLaporan));

  }

  @Get()
  findDokumen(@Query() query:any)  {
    return this.dokumenTranslokService.findAllDokumen(query);
  }

  @Get("status")
  findDokumenStatusBy(
    @Query() payload: any
  ) {
    return this.dokumenTranslokService.findDokumenStatusBy(Number(payload.mahasiswaId), payload.status);
  }

  @Get("statusRekening")
  findRekeningStatusBy(
    @Query() payload: any
  ) {
    return this.dokumenTranslokService.findRekeningStatusBy(Number(payload.mahasiswaId), payload.statusRek);
  }

  // @Get('/chart')
  // chartFetchings() {
  //   return this.dokumenTranslokService.chartFetching();
  // }

  @Get(":mahasiswaId")
  findDokumenBy(
    @Param("mahasiswaId", ParseIntPipe) mahasiswaId: number
  ) {
    return this.dokumenTranslokService.findDokumenBy(mahasiswaId);
  }



  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: './public/file-laporan-magang-final',
        destination: './public/file-dokumen-translok',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-');
          cb(null, `LAPORAN-${uniqueSuffix}-${sanitizedOriginalName}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('File laporan magang harus berupa file PDF'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        bulan: {
          type: 'string',
          example: '04-2025',
        },
        mahasiswaId: {
          type: 'string',
          example: '123',
        },
      },
    },
  })
  async create(
    @Body() payload: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.dokumenTranslokService.create(payload, file.filename);
  }

  // controller.ts
  @Put(":documentId")
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // destination: './public/file-laporan-magang-final',
        destination: './public/file-dokumen-translok',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-');
          cb(null, `LAPORAN-${uniqueSuffix}-${sanitizedOriginalName}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('File harus berupa PDF'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param("documentId", ParseIntPipe) documentId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {

    console.log(documentId)
    console.log(file.filename)
    return this.dokumenTranslokService.update(documentId, file.filename);
  }

  @Put("confirm/:mahasiswaId")
  async confirmDocument(
    @Param("mahasiswaId", ParseIntPipe) mahasiswaId: number,
    @Body() payload: any
  ) {
    console.log(payload)
    return this.dokumenTranslokService.confirmData(Number(mahasiswaId), payload);
  }

  @Put("confirm2/:mahasiswaId")
  async confirmDocument2(
    @Param("mahasiswaId", ParseIntPipe) mahasiswaId: number,
    @Body() payload: any
  ) {
    console.log(payload)
    return this.dokumenTranslokService.confirmDataRek(Number(mahasiswaId), payload);
  }

}
