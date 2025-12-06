import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { BimbinganSkripsiService } from './bimbingan-skripsi.service';
import { CreateIzinBimbinganSkripsiDto } from '../bimbingan-skripsi/dto/create-izinBimbinganSkripsi.dto';
import { UpdateIzinBimbinganSkripsiDto } from '../bimbingan-skripsi/dto/update-izinBimbinganSkripsi.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('bimbingan-skripsi')
@ApiTags('Bimbingan Skripsi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BimbinganSkripsiController {
  constructor(private readonly bimbinganSkripsiService: BimbinganSkripsiService) { }

  @Post(':mahasiswaId')
  create(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body() createBimbinganSkripsiDto: CreateIzinBimbinganSkripsiDto
  ) {
    return this.bimbinganSkripsiService.create(+mahasiswaId, createBimbinganSkripsiDto);
  }

  @Get()
  findAllIzinBy(
    @Query() param: {
      mahasiswaId: number;
      tanggal: string;
    }
  ) {
    return this.bimbinganSkripsiService.findAllIzinBy(param);
  }

  @Put(':izinBimbinganSkripsiId')
  update(
    @Param('izinBimbinganSkripsiId') izinBimbinganSkripsiId: number,
    @Body() updateBimbinganSkripsiDto: UpdateIzinBimbinganSkripsiDto
  ) {
    return this.bimbinganSkripsiService.update(+izinBimbinganSkripsiId, updateBimbinganSkripsiDto);
  }

  @Delete(':izinBimbinganSkripsiId')
  remove(@Param('izinBimbinganSkripsiId') izinBimbinganSkripsiId: number) {
    return this.bimbinganSkripsiService.remove(+izinBimbinganSkripsiId);
  }
}
