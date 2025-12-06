import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { TimMagangService } from './tim-magang.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Mahasiswa } from '../mahasiswa/dto/mahasiswa.entity';

@Controller('tim-magang')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Tim Magang')
export class TimMagangController {
  constructor(private readonly timMagangService: TimMagangService) { }

  @Put('/assign-mahasiswa/dosen/:dosenId')
  async assignMahasiswaToDosenPembimbingMagang(
    @Param('dosenId') dosenId: number,
    @Body() params: Mahasiswa[]
  ) {
    return this.timMagangService.assignMahasiswaToDosenPembimbing(+dosenId, params);
  }

  @Put('unassign-mahasiswa/dosen/:dosenId')
  async unassignMahasiswaToDosenPembimbingMagang(
    @Param('dosenId') dosenId: number,
    @Body() params: Mahasiswa[]
  ) {
    return this.timMagangService.unassignMahasiswaToDosenPembimbing(+dosenId, params);
  }

  @Put('konfirmasi-pilihan-satker-satu-provinsi/:pilihanId')
  async konfirmasiPilihanSatkerSatuProvinsi(
    @Param('pilihanId') pilihanId: number
  ) {
    return this.timMagangService.konfirmasiPilihanSatkerSatuProvinsi(+pilihanId);
  }
}
