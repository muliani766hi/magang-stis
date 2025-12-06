import { Controller, Get, Post, Body, Param, Delete, Query, Put, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { SatkerService } from './satker.service';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateSatkerDto } from '../satker/dto/satker/create-satker.dto';
import { UpdateSatkerDto } from '../satker/dto/satker/update-satker.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { UpdateKapasitasSatkerTahunAjaranDto } from './dto/kapasitas-satker-tahun-ajaran/update-kapasitasSatkerTahunAjaran.dto';

@ApiTags('Satker')
@ApiBearerAuth()
@Controller('satker')
export class SatkerController {
  constructor(private readonly satkerService: SatkerService) { }

  @Get()
  async findAllSatkerBy(
    @Query() params: {
      satkerId?: number;
      kodeSatker?: string;
      namaProvinsi?: string;
      kodeProvinsi?: string;
      namaKabupatenKota?: string;
      kodeKabupatenKota?: string;
      alamat?: string;
      internalBps?: string;
      searchSatker?: string;
      searchProvinsi?: string;
      page?: number;
      pageSize?: number;
    }
  ) {
    return this.satkerService.findAllSatkerBy(params);
  }

  @Post('bulk')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createBulk(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      throw new BadRequestException('File harus berformat xlsx');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return this.satkerService.createBulk(data);
  }

  @Post()
  create(
    @Body() satker: CreateSatkerDto
  ) {
    return this.satkerService.create(satker);
  }

  @Get('kapasitas-satker')
  async findAllKapasitasSatkerBy(
    @Query() params: {
      kodeSatker: string;
      namaProvinsi: string;
      kodeProvinsi: string;
      namaKabupatenKota: string;
      kodeKabupatenKota: string;
      tahunAjaran: string;
    }
  ) {
    return this.satkerService.findAllKapasitasSatkerBy(params);
  }

  @Put(':satkerId')
  update(
    @Param('satkerId') satkerId: number,
    @Body() satker: UpdateSatkerDto
  ) {
    return this.satkerService.update(satkerId, satker);
  }

  @Put('add-latlong/:satkerId')
  updateDataLatlongSatker(
    @Param('satkerId') satkerId: number,
    @Body() satker: UpdateSatkerDto
  ) {
    return this.satkerService.updateDataLatLongSatker(satkerId, satker);
  }

  @Put('kapasitas-satker/:kapasitasSatkerId')
  updateKapasitasSatker(
    @Param('kapasitasSatkerId') kapasitasSatkerId: number,
    @Body() kapasitasSatker: UpdateKapasitasSatkerTahunAjaranDto
  ) {
    return this.satkerService.updateKapasitasSatker(+kapasitasSatkerId, kapasitasSatker);
  }

  @Delete(':satkerId')
  remove(
    @Param('satkerId') satkerId: number
  ) {
    return this.satkerService.remove(+satkerId);
  }
}
