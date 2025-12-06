import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Put } from '@nestjs/common';
import { KegiatanHarianService } from './kegiatan-harian.service';
import { CreateKegiatanHarianDto } from '../kegiatan-harian/dto/kegiatan-harian/create-kegiatanHarian.dto';
import { UpdateKegiatanHarianDto } from '../kegiatan-harian/dto/kegiatan-harian/update-kegiatanHarian.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTipeKegiatanDto } from '../kegiatan-harian/dto/tipe-kegiatan/create-tipeKegiatan.dto';
import { UpdateTipeKegiatanDto } from '../kegiatan-harian/dto/tipe-kegiatan/update-tipeKegiatan.dto';

@ApiTags('Kegiatan Harian')
@ApiBearerAuth()
@ApiTags('Bimbingan Magang')
@Controller('kegiatan-harian')
export class KegiatanHarianController {
  constructor(private readonly kegiatanHarianService: KegiatanHarianService) { }

  // TIPE KEGIATAN
  @Get('tipe-kegiatan')
  findAllTipeKegiatan(
    @Query() params: {
      nama: string
    }
  ) {
    return this.kegiatanHarianService.findAllTipeKegiatan(params);
  }

  @Post('tipe-kegiatan/:mahasiswaId')
  createTipeKegiatan(
    @Body() tipeKegiatan: CreateTipeKegiatanDto,
    @Param('mahasiswaId') mahasiswaId: number
  ) {
    return this.kegiatanHarianService.createTipeKegiatan(tipeKegiatan, +mahasiswaId);
  }

  @Put('tipe-kegiatan/:tipeKegiatanId')
  updateTipeKegiatan(
    @Param('tipeKegiatanId') tipeKegiatanId: number,
    @Body() tipeKegiatan: UpdateTipeKegiatanDto
  ) {
    return this.kegiatanHarianService.updateTipeKegiatan(+tipeKegiatanId, tipeKegiatan);
  }

  @Delete('tipe-kegiatan/:tipeKegiatanId')
  removeTipeKegiatan(@Param('tipeKegiatanId') tipeKegiatanId: number) {
    return this.kegiatanHarianService.removeTipeKegiatan(+tipeKegiatanId);
  }

  // CATATAN KEGIATAN HARIAN
  @Get()
  findAllKegiatanHarianMahasiswa(@Query() params: any) {
    // console.log("controller param:", params)
    return this.kegiatanHarianService.findAllKegiatanHarianBy(params);
  }

  @Put('konfirmasi')
  konfirmasiKegiatanHarian(
    @Body() kegiatanHarian: [
      {
        kegiatanHarianId: number,
      }
    ],
  ) {
    return this.kegiatanHarianService.konfirmasiKegiatanHarian(kegiatanHarian);
  }

  @Post(':mahasiswaId')
  createKegiatanHarian(
    @Body() createKegiatanHarianDto: CreateKegiatanHarianDto,
    @Param('mahasiswaId') mahasiswaId: number
  ) {
    // console.log(createKegiatanHarianDto);
    return this.kegiatanHarianService.createKegiatanHarian(createKegiatanHarianDto, +mahasiswaId);
  }

  @Put('/:kegiatanHarianId')
  updateKegiatanHarian(
    @Param('kegiatanHarianId') kegiatanHarianId: number,
    @Body() updateKegiatanHarianDto: UpdateKegiatanHarianDto
  ) {
    return this.kegiatanHarianService.updateKegiatanHarian(+kegiatanHarianId, updateKegiatanHarianDto);
  }

  @Delete(':kegiatanHarianId')
  remove(@Param('kegiatanHarianId') kegiatanHarianId: number) {
    return this.kegiatanHarianService.remove(+kegiatanHarianId);
  }
}
