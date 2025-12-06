import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DosenPembimbingMagangService } from './dosen-pembimbing-magang.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CreateDosenPembimbingMagangDto } from '../dosen-pembimbing-magang/dto/create-dosenPembimbingMagang.dto';
import { UpdateDosenPembimbingMagangDto } from '../dosen-pembimbing-magang/dto/update-dosenPembimbingMagang.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

@ApiTags('Dosen Pembimbing Magang')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dosen-pembimbing')
export class DosenPembimbingMagangController {
  constructor(
    private readonly dosenPembimbingMagangService: DosenPembimbingMagangService,
    private jwtService: JwtService
  ) { }

  @Get()
  async findAllDosenBy(
    @Query() params: {
      nip?: string;
      nama?: string;
      prodi?: string;
      email?: string;
      tahunAjaran?: string;
      searchNama?: string;
      searchNIP?: string;
      page?: string;
      pageSize?: string;
    }
  ) {
    return this.dosenPembimbingMagangService.findAllDosenBy(params);
  }

  @Post()
  async addDosenPembimbingMagang(
    @Body() createDosenPembimbingMagang: CreateDosenPembimbingMagangDto
  ) {
    return this.dosenPembimbingMagangService.create(createDosenPembimbingMagang);
  }

  @Post('bulk')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  createBulk(
    @UploadedFile('file') file: Express.Multer.File
  ) {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      throw new Error('File harus berformat xlsx');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return this.dosenPembimbingMagangService.createBulk(data);
  }

  @Put(':dosenId')
  async update(
    @Param('dosenId') dosenId: number,
    @Body() updateDosenPembimbingMagang: UpdateDosenPembimbingMagangDto
  ) {
    return this.dosenPembimbingMagangService.update(+dosenId, updateDosenPembimbingMagang);
  }
}
