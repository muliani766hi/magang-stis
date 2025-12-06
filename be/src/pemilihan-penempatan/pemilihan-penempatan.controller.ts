import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PemilihanPenempatanService } from './pemilihan-penempatan.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Satker } from '../satker/dto/satker/satker.entity';

@ApiTags('Pemilihan Penempatan')
@ApiBearerAuth()
@ApiTags('Bimbingan Magang')
@Controller('pemilihan-penempatan')
export class PemilihanPenempatanController {
  constructor(private pemilihanPenempatanService: PemilihanPenempatanService) { }

  @Get()
  async findAllPemilihanPenempatanBy(
    @Query() params: {
      satkerId: number,
      mahasiswaId: number
    }
  ) {
    return this.pemilihanPenempatanService.findAllPemilihanPenempatanBy(params);
  }

  @Get('list')
  async findAllPemilihanPenempatan(@Query() params: any) {
    return this.pemilihanPenempatanService.findPilihanPenempatan(params);
  }

  @Get('/jarak/:mahasiswaId')
  async hitungJarakPenempatanByMahasiswa(
    @Param('mahasiswaId', ParseIntPipe) mahasiswaId: number
  ) {
    return this.pemilihanPenempatanService.hitungJarakPenempatanByMahasiswa(Number(mahasiswaId));
  }
  

  @Get("/test/:mahasiswaId")
  async findPilihanPenempatanByMahasiswaId(
    @Param() params: {
      mahasiswaId: number
    }
  ) {
    return this.pemilihanPenempatanService.findPilihanPenempatanByMahasiswaId(params);
  }

  @Put('confirm/:mahasiswaId')
  async confirmPenempatan(
    @Param('mahasiswaId', ParseIntPipe) mahasiswaId: number,
    @Body() payload: any
  ) {
    // console.info('Received mahasiswaId:', mahasiswaId);  // Log mahasiswaId
    // console.info('Received payload:', payload);  // Log payload untuk debugging
    return this.pemilihanPenempatanService.confirmPenempatan(Number(mahasiswaId), payload);
  }

  @Put('konfirmasi/:pilihanId')
  async confirmPemilihanPenempatan(
    @Param('pilihanId') pilihanId: number
  ) {
    return this.pemilihanPenempatanService.confirmPemilihanPenempatan(+pilihanId);
  }

  @Put('batal-konfirmasi/:pilihanId')
  async cancelConfirmPemilihanPenempatan(
    @Param('pilihanId') pilihanId: number
  ) {
    return this.pemilihanPenempatanService.cancelConfirmPemilihanPenempatan(+pilihanId);
  }

  @Post('/bulk')
  async createConfirmBulk(
    @Body() payload: any
  ) {
    return this.pemilihanPenempatanService.bulkConfirmPenempatan(payload);
  }
  
  @Post(':mahasiswaId')
  async createPemilihanPenempatan(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body() pilihan: Satker[]
  ) {
    return this.pemilihanPenempatanService.createPemilihanPenempatan(+mahasiswaId, pilihan);
  }

  @Put('e/:pilihanId')
  async pindahPemilihanPenempatan(
    @Param('pilihanId') pilihanId: number,
    @Body() pilihan: Satker
  ) {
    return this.pemilihanPenempatanService.pindahPemilihanPenempatan(+pilihanId, pilihan);
  }

  @Delete(':pilihanId')
  async deletePemilihanPenempatan(
    @Param('pilihanId') pilihanId: number
  ) {
    return this.pemilihanPenempatanService.deletePemilihanPenempatan(+pilihanId);
  }

  @Get('periode-pemilihan-tempat-magang')
  async getPeriode(
    @Query() params: {
      tahunAjaranId: number
    }
  ) {
    return this.pemilihanPenempatanService.getPeriodePemilihanTempatMagang(params);
  }

  @Post('periode-pemilihan-tempat-magang')
  async createPeriode(@Body() periode: {
    tanggalMulai: Date,
    tanggalAkhir: Date,
    tahunAjaranId: number
  }) {
    return this.pemilihanPenempatanService.createPeriodePemilihanTempatMagang(periode);
  }

  @Put('periode-pemilihan-tempat-magang/:periodeId')
  async updatePeriode(
    @Param('periodeId') periodeId: number,
    @Body() periode: {
      tanggalMulai: Date,
      tanggalAkhir: Date
    }
  ) {
    return this.pemilihanPenempatanService.updatePeriodePemilihanTempatMagang(+periodeId, periode);
  }

  @Delete('periode-pemilihan-tempat-magang/:periodeId')
  async deletePeriode(
    @Param('periodeId') periodeId: number
  ) {
    return this.pemilihanPenempatanService.deletePeriodePemilihanTempatMagang(+periodeId);
  }

  @Get('periode-konfirmasi-pemilihan-satker')
  async getPeriodeKonfirmasi(
    @Query() params: {
      tahunAjaranId: number
    }
  ) {
    return this.pemilihanPenempatanService.getPeriodeKonfirmasiPemilihanSatker(params);
  }

  @Post('periode-konfirmasi-pemilihan-satker')
  async createPeriodeKonfirmasi(@Body() periode: {
    tanggalMulai: Date,
    tanggalAkhir: Date,
    tahunAjaranId: number
  }) {
    return this.pemilihanPenempatanService.createPeriodeKonfirmasiPemilihanSatker(periode);
  }

  @Put('periode-konfirmasi-pemilihan-satker/:periodeId')
  async updatePeriodeKonfirmasi(
    @Param('periodeId') periodeId: number,
    @Body() periode: {
      tanggalMulai: Date,
      tanggalAkhir: Date,
      tahunAjaranId: number
    }
  ) {
    return this.pemilihanPenempatanService.updatePeriodeKonfirmasiPemilihanSatker(+periodeId, periode);
  }

  @Delete('periode-konfirmasi-pemilihan-satker/:periodeId')
  async deletePeriodeKonfirmasi(
    @Param('periodeId') periodeId: number
  ) {
    return this.pemilihanPenempatanService.deletePeriodeKonfirmasiPemilihanSatker(+periodeId);
  }


}
