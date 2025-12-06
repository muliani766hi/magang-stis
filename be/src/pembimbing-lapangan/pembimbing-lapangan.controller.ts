import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PembimbingLapanganService } from './pembimbing-lapangan.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreatePembimbingLapanganDto } from '../pembimbing-lapangan/dto/create-pembimbingLapangan.dto';
import { UpdatePembimbingLapanganDto } from './dto/update-pembimbingLapangan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

@ApiTags('Pembimbing Lapangan')
@ApiBearerAuth()
@ApiTags('Bimbingan Magang')
@Controller('pembimbing-lapangan')
export class PembimbingLapanganController {
  constructor(private readonly pembimbingLapanganService: PembimbingLapanganService) { }

  @Get()
  findAll(
    @Query() params: { 
      searchNama?: string;
      searchNIP?: string;
      searchSatker?: string;
      searchMahasiswa?: string;
      page?: string;
      pageSize?: string;
      // tahunAjaran: string,
    }
  ) {
    return this.pembimbingLapanganService.findAllPemlapBy(params);
  }

  @Get("with-mhs")
  findAllWithMhs() {
    return this.pembimbingLapanganService.findAllWithMhs();
  }

  @Post()
  create(@Body() createPembimbingLapangan: CreatePembimbingLapanganDto) {
    return this.pembimbingLapanganService.create(createPembimbingLapangan);
  }

  @Get('mahasiswa-bimbingan')
  findAllMahasiswaBimbingan(
    @Query() params: {
      pemlapId: number,
    }
  ) {
    return this.pembimbingLapanganService.findAllMahasiswaBimbingan(params);
  }

  @Post('bulk')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  createBulk(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      throw new Error('File harus berformat xlsx');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return this.pembimbingLapanganService.createBulk(data);
  }

  @Put('assign-mahasiswa/bulk')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  assignMahasiswaBulk(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      throw new Error('File harus berformat xlsx');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return this.pembimbingLapanganService.assignMahasiswaBulk(data);
  }

  @Put(':pemlapId')
  update(
    @Param('pemlapId') pemlapId: number,
    @Body() updatePembimbingLapangan: UpdatePembimbingLapanganDto
  ) {
    return this.pembimbingLapanganService.update(+pemlapId, updatePembimbingLapangan);
  }

  @Delete(':pemlapId')
  remove(
    @Param('pemlapId') pemlapId: number
  ) {
    return this.pembimbingLapanganService.remove(+pemlapId);
  }
}
