import { Controller, Get, Post, Body, Param, Delete, UseGuards, UploadedFile, UseInterceptors, BadRequestException, Query, Put, Res, Request, ForbiddenException, UseFilters } from '@nestjs/common';
import { PresensiManualService } from './presensi-manual.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { join } from 'path';
import { Response } from 'express';
import { MulterErrorFilter } from 'src/filters/multer-error.filter';
import { escape } from 'querystring';

@Controller('presensi-manual')
@ApiTags('Presensi Manual')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PresensiManualController {
  constructor(
    private readonly presensiManualService: PresensiManualService,
    private readonly jwtService: JwtService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          if (file.mimetype !== 'image/jpeg') {
            if (file.mimetype !== 'image/png') {
              if (file.mimetype !== 'image/jpg') {
                return cb(new BadRequestException('File presensi manual harus berupa file PDF, JPEG, JPG, atau PNG'), false);
              } else {
                cb(null, true);
              }
            } else {
              cb(null, true);
            }
          } else {
            cb(null, true);
          }
        } else {
          cb(null, true);
        }
      },
      storage: diskStorage({
        destination: './public/file-bukti-presensi-manual',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `BUKTI MANUAL-${uniqueSuffix}-${file.originalname}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
    )
  @UseFilters(MulterErrorFilter)
  create(
    @Body('json') createPresensiManualDto: string,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    try {
      createPresensiManualDto = JSON.parse(createPresensiManualDto);
  
      return this.presensiManualService.create(createPresensiManualDto, file.filename);
    } catch (error) {
      if (error instanceof MulterError) {
        throw new BadRequestException('File presensi manual tidak boleh lebih dari 2MB');
      }
    }
  }

  @Get()
  findAll(
    @Query() params: {
      presensiManualId?: string;
    },
  ) {
    return this.presensiManualService.findAllBy(params);
  }

  @Get('download/:buktiPresensiManual')
  downloadFile(
    @Param('buktiPresensiManual') buktiPresensiManual: string,
    @Res() response: Response,
    @Request() request: Request
  ) {
    const injectedToken = request.headers['authorization'].split(' ')[1];
    const payload = this.jwtService.decode(injectedToken);
    const ability = this.caslAbilityFactory.createForUser(payload);

    if (!ability.can('read', 'PresensiManual')) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk melihat bukti presensi manual');
    }

    return response.sendFile(join(process.cwd(), 'public/file-bukti-presensi-manual/' + buktiPresensiManual));
  }

  @Delete(':presensiManualId')
  remove(@Param('presensiManualId') presensiManualId: number) {
    return this.presensiManualService.remove(+presensiManualId);
  }

  // @Put(':presensiManualId')
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     fileFilter: (req, file, cb) => {
  //       if (file.mimetype !== 'application/pdf') {
  //         if (file.mimetype !== 'image/jpeg') {
  //           if (file.mimetype !== 'image/png') {
  //             if (file.mimetype !== 'image/jpg') {
  //               return cb(new BadRequestException('File presensi manual harus berupa file PDF, JPEG, JPG, atau PNG'), false);
  //             }
  //           }
  //         }
  //       }
  //       if (file.size > 10 * 1024 * 1024) {
  //         return cb(new BadRequestException('File presensi manual tidak boleh lebih dari 5MB'), false);
  //       }
  //       cb(null, true);
  //     },
  //     storage: diskStorage({
  //       destination: './public/file-bukti-presensi-manual',
  //       filename: (req, file, cb) => {
  //         cb(null, file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // update(
  //   @Param('presensiManualId') presensiManualId: number,
  //   @Body('json') updatePresensiManualDto: string,
  //   @UploadedFile('file') file: Express.Multer.File,
  // ) {
  //   updatePresensiManualDto = JSON.parse(updatePresensiManualDto);

  //   return this.presensiManualService.update(+presensiManualId, updatePresensiManualDto, file.filename);
  // }

  @Put('setujui/:presensiManualId')
  setujuiPresensiManual(
    @Param('presensiManualId') presensiManualId: string,
  ) {
    return this.presensiManualService.setujuiPresensiManual(+presensiManualId);
  }

  @Put('tolak/:presensiManualId')
  tolakPresensiManual(
    @Param('presensiManualId') presensiManualId: string,
  ) {
    return this.presensiManualService.tolakPresensiManual(+presensiManualId);
  }
}
