import {
  Put,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseFilePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { ApiConsumes, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMahasiswaDto } from '../mahasiswa/dto/update-mahasiswa.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import * as XLSX from 'xlsx';

@ApiTags('mahasiswa')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mahasiswa')
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) { }

  @Get()
  async getMahasiswa(@Query() params: any) {
    return await this.mahasiswaService.findAll(params);
  }


  @Get("/chart/jmlh-mhs")
  async chartJumlahMhs() {
    return await this.mahasiswaService.chartJumlahMhs();
  }

  @Post('excel')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
  ) {
    // cek mime type
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      throw new BadRequestException('File harus berformat xlsx');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return this.mahasiswaService.importExcel(data);
  }

  @Put('set-tempat-magang-batch')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          return cb(new BadRequestException('File harus berformat xlsx'), false);
        } else {
          cb(null, true);
        }
      },
    })
  )
  async setTempatMagangBatch(
    @UploadedFile('file') file: Express.Multer.File
  ) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return await this.mahasiswaService.setTempatMagangBatch(data);
  }

  @Get()
  async getMahasiswaId(
    @Param('mahasiswaId') mahasiswaId: number
  ) {
    return await this.mahasiswaService.findOne(mahasiswaId);
  }

  @Put(':mahasiswaId')
  update(
    @Param('mahasiswaId', ParseIntPipe) mahasiswaId: number,
    @Body() updateMahasiswaDto: any
  ) {
    return this.mahasiswaService.update(mahasiswaId, updateMahasiswaDto);
  }
}
