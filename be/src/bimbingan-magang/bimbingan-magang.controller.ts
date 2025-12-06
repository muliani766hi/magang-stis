import { Controller, Get, Post, Body, Param, Req, Put, Query, UseGuards, Delete } from '@nestjs/common';
import { BimbinganMagangService } from './bimbingan-magang.service';
import { CreateBimbinganMagangDto } from '../bimbingan-magang/dto/bimbingan-magang/create-bimbinganMagang.dto';
import { UpdateBimbinganMagangDto } from '../bimbingan-magang/dto/bimbingan-magang/update-bimbinganMagang.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateBimbinganMagangDosenDto } from './dto/bimbingan-magang-dosen/create-bimbinganMagangDosen.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Bimbingan Magang')
@Controller('bimbingan-magang')
export class BimbinganMagangController {
  constructor(
    private readonly bimbinganMagangService: BimbinganMagangService,
  ) { }

  @Post('mahasiswa/:mahasiswaId')
  createByMahasiswa(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body() createBimbinganMagangDto: CreateBimbinganMagangDto
  ) {
    return this.bimbinganMagangService.createByMahasiswa(+mahasiswaId, createBimbinganMagangDto);
  }

  @Post('dosen-pembimbing/:dosenId')
  createByDosen(
    @Param('dosenId') dosenId: number,
    @Body() createBimbinganMagangDosenDto: CreateBimbinganMagangDosenDto
  ) {
    return this.bimbinganMagangService.createByDosenPembimbing(+dosenId, createBimbinganMagangDosenDto);
  }

  @Get()
  findAllBimbinganMagangBy(
    @Query() query: {
      nim: string;
      nipDosen: string;
      tanggal: Date;
      status: string;
    }
  ) {
    return this.bimbinganMagangService.findAllBimbinganMagangBy(query);
  }

  @Put(':bimbinganMagangId')
  update(
    @Param('bimbinganMagangId') bimbinganMagangId: number,
    @Body() updateBimbinganMagangDto: UpdateBimbinganMagangDto,
  ) {
    return this.bimbinganMagangService.update(+bimbinganMagangId, updateBimbinganMagangDto);
  }

  @Put('confirm/:bimbinganMagangId')
  confirm(
    @Param('bimbinganMagangId') bimbinganMagangId: number
  ) {
    return this.bimbinganMagangService.confirm(+bimbinganMagangId);
  }

  @Put('finalize/:bimbinganMagangId')
  finalize(
    @Param('bimbinganMagangId') bimbinganMagangId: number
  ) {
    return this.bimbinganMagangService.finalize(+bimbinganMagangId);
  }

  @Delete(':bimbinganMagangId')
  delete(
    @Param('bimbinganMagangId') bimbinganMagangId: number
  ) {
    return this.bimbinganMagangService.delete(+bimbinganMagangId);
  }
}
