import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { PenilaianService } from './penilaian.service';
import { CreatePenilaianBimbinganDto } from './dto/penilaianBimbingan/create-penilaianBimbingan.dto';
import { UpdatePenilaianBimbinganDto } from './dto/penilaianBimbingan/update-penilaianBimbingan.dto';
import { CreatePenilaianLaporanDosenDto } from './dto/penilaianLaporanDosen/create-penilaianLaporanDosen.dto';
import { CreatePenilaianKinerjaDto } from './dto/penilaianKinerja/create-penilaianKinerja.dto';
import { UpdatePenilaianLaporanDosenDto } from './dto/penilaianLaporanDosen/update-penilaianLaporanDosen.dto';
import { CreatePenilaianLaporanPemlapDto } from './dto/penilaianLaporanPemlap/create-penilaianLaporanPemlap.dto';
import { UpdatePenilaianLaporanPemlapDto } from './dto/penilaianLaporanPemlap/update-penilaianLaporanPemlap.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('penilaian')
  @ApiTags('Penilaian')
@ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
export class PenilaianController {
  constructor(private readonly penilaianService: PenilaianService) { }

  //PENILAIAN BIMBINGAN
  @Post('bimbingan')
  createManyPenilaianBimbingan(@Body() body: {
    mahasiswaId: number;
    createPenilaianBimbinganDto: CreatePenilaianBimbinganDto;
  }[]) {
    return this.penilaianService.createManyPenilaianBimbingan(body);
  }

  @Post('bimbingan/:mahasiswaId')
  createBimbingan(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body() CreatePenilaianBimbinganDto: CreatePenilaianBimbinganDto
  ) {
    return this.penilaianService.createPenilaianBimbingan(+mahasiswaId, CreatePenilaianBimbinganDto);
  }

  @Get('bimbingan')
  findAllBimbingan(
    @Query() param: {
      nim: string;
    }
  ) {
    return this.penilaianService.findAllPenilaianBimbingan(param);
  }

  @Put('bimbingan')
  updateManyPenilaianBimbingan(@Body() body: {
    penilaianBimbinganId: number;
    updatePenilaianBimbinganDto: UpdatePenilaianBimbinganDto;
  }[]) {
    return this.penilaianService.updateManyPenilaianBimbingan(body);
  }

  @Put('bimbingan/:penilaianBimbinganId')
  updateBimbingan(
    @Param('penilaianBimbinganId') penilaianBimbinganId: number,
    @Body() updatePenilaianBimbinganDto: UpdatePenilaianBimbinganDto
  ) {
    return this.penilaianService.updatePenilaianBimbingan(+penilaianBimbinganId, updatePenilaianBimbinganDto);
  }

  //PENILAIAN LAPORAN DOSEN
  @Post('laporan-dosen')
  createManyLaporanDosen(@Body() body: {
    mahasiswaId: number;
    createPenilaianLaporanDosenDto: CreatePenilaianLaporanDosenDto;
  }[]) {
    return this.penilaianService.createManyPenilaianLaporanDosen(body);
  }

  @Post('laporan-dosen/:mahasiswaId')
  createLaporanDosen(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body() createPenilaianLaporanDosenDto: CreatePenilaianLaporanDosenDto
  ) {
    return this.penilaianService.createPenilaianLaporanDosen(+mahasiswaId, createPenilaianLaporanDosenDto);
  }

  @Get('laporan-dosen')
  findAllLaporanDosen(
    @Query() param: {
      nim: string;
    }
  ) {
    return this.penilaianService.findAllPenilaianLaporanDosen(param);
  }

  @Put('laporan-dosen')
  updateManyLaporanDosen(@Body() body: {
    penilaianLaporanDosenId: number;
    updatePenilaianLaporanDosenDto: UpdatePenilaianLaporanDosenDto;
  }[]) {
    return this.penilaianService.updateManyPenilaianLaporanDosen(body);
  }

  @Put('laporan-dosen/:penilaianLaporanDosenId')
  updateLaporanDosen(
    @Param('penilaianLaporanDosenId') penilaianLaporanDosenId: number,
    @Body() updatePenilaianLaporanDosenDto: UpdatePenilaianLaporanDosenDto
  ) {
    return this.penilaianService.updatePenilaianLaporanDosen(+penilaianLaporanDosenId, updatePenilaianLaporanDosenDto);
  }

  //PENILAIAN KINERJA
  @Post('kinerja')
  createManyKinerja(@Body() body: {
    mahasiswaId: number;
    createPenilaianKinerjaDto: CreatePenilaianKinerjaDto;
  }[]) {
    return this.penilaianService.createManyPenilaianKinerja(body);
  }

  @Post('kinerja/:mahasiswaId')
  createKinerja(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body() createPenilaianKinerjaDto: CreatePenilaianKinerjaDto
  ) {
    return this.penilaianService.createPenilaianKinerja(+mahasiswaId, createPenilaianKinerjaDto);
  }

  @Get('kinerja')
  findAllKinerja(
    @Query() param: {
      nim: string;
    }
  ) {
    return this.penilaianService.findAllPenilaianKinerja(param);
  }

  @Put('kinerja')
  updateManyKinerja(@Body() body: {
    penilaianKinerjaId: number;
    updatePenilaianKinerjaDto: CreatePenilaianKinerjaDto;
  }[]) {
    return this.penilaianService.updateManyPenilaianKinerja(body);
  }

  @Put('kinerja/:penilaianKinerjaId')
  updateKinerja(
    @Param('penilaianKinerjaId') penilaianKinerjaId: number,
    @Body() updatePenilaianKinerjaDto: CreatePenilaianKinerjaDto
  ) {
    return this.penilaianService.updatePenilaianKinerja(+penilaianKinerjaId, updatePenilaianKinerjaDto);
  }

  //PENILAIAN LAPOAN PEMLAP
  @Post('laporan-pemlap')
  createManyLaporanPemlap(@Body() body: {
    mahasiswaId: number;
    createPenilaianLaporanPemlapDto: CreatePenilaianLaporanPemlapDto;
  }[]) {
    return this.penilaianService.createManyPenilaianLaporanPemlap(body);
  }

  @Post('laporan-pemlap/:mahasiswaId')
  createLaporanPemlap(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body() createPenilaianLaporanPemlapDto: CreatePenilaianLaporanPemlapDto
  ) {
    return this.penilaianService.createPenilaianLaporanPemlap(+mahasiswaId, createPenilaianLaporanPemlapDto);
  }

  @Get('laporan-pemlap')
  findAllLaporanPemlap(
    @Query() param: {
      nim: string;
    }
  ) {
    return this.penilaianService.findAllPenilaianLaporanPemlap(param);
  }

  @Put('laporan-pemlap')
  updateManyLaporanPemlap(@Body() body: {
    penilaianLaporanPemlapId: number;
    updatePenilaianLaporanPemlapDto: UpdatePenilaianLaporanPemlapDto;
  }[]) {
    return this.penilaianService.updateManyPenilaianLaporanPemlap(body);
  }

  @Put('laporan-pemlap/:penilaianLaporanPemlapId')
  updateLaporanPemlap(
    @Param('penilaianLaporanPemlapId') penilaianLaporanPemlapId: number,
    @Body() updatePenilaianLaporanPemlapDto: UpdatePenilaianLaporanPemlapDto
  ) {
    return this.penilaianService.updatePenilaianLaporanPemlap(+penilaianLaporanPemlapId, updatePenilaianLaporanPemlapDto);
  }
}
