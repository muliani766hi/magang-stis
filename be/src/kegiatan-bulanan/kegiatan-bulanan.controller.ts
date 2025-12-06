import { KegiatanBulananService } from './kegiatan-bulanan.service';
import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  Query,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateRekapKegiatanBulananDto } from '../kegiatan-bulanan/dto/rekap-kegiatan-bulanan/create-rekapKegiatanBulanan.dto';
import { UpdateRekapKegiatanBulananDto } from '../kegiatan-bulanan/dto/rekap-kegiatan-bulanan/update-rekapKegiatanBulanan.dto';
import { UpdateRekapKegiatanBulananTipeKegiatan } from '../kegiatan-bulanan/dto/rekap-kegiatan-bulanan-tipe-kegiatan/update-rekapKegiatanBulananTipeKegiatan.dto';

@ApiBearerAuth()
@ApiTags('Kegiatan Bulanan')
@Controller('kegiatan-bulanan')
export class KegiatanBulananController {
  constructor(private readonly kegiatanBulananService: KegiatanBulananService) { }

  
  @Post('create-periode-rekap')
  createPeriodeRekap(
    @Body() createRekapKegiatanBulananDto: CreateRekapKegiatanBulananDto
  ) {
    return this.kegiatanBulananService.createRekap(createRekapKegiatanBulananDto);
  }
  
  @Post(':mahasiswaId')
  create(
    @Param('mahasiswaId') mahasiswaId: number,
    @Body() createRekapKegiatanBulananDto: CreateRekapKegiatanBulananDto
  ) {
    return this.kegiatanBulananService.create(+mahasiswaId, createRekapKegiatanBulananDto);
  }

  @Get('periode-rekap')
  findPeriodeRekap(
     @Query() query: {
      mahasiswaId?: number;
      }
  ) {
    return this.kegiatanBulananService.getPeriodeRekapKegiatanBulanan(query);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.kegiatanBulananService.findAllRekapKegiatanBulananBy(query);
  }

  @Put('update-kualitas')
  updateKualitasRekapTipeKegiatanBulanan(
    @Body() data : UpdateRekapKegiatanBulananTipeKegiatan[]
  ) {
    return this.kegiatanBulananService.updateKualitasRekapKegiatan(data);
  }

  @Put('update-status/:rekapId')
  updateStatusRekapKegiatanBulanan(
    @Param('rekapId') rekapId: number,
    @Body() updateRekapKegiatanBulananDto: UpdateRekapKegiatanBulananDto
  ) {
    return this.kegiatanBulananService.updateStatusRekapKegiatanBulanan(+rekapId, updateRekapKegiatanBulananDto);
  }

  @Put('edit-detail/:rekapTipeKegiatanId')
  updateDetailRekapKegiatan(
    @Param('rekapTipeKegiatanId') rekapTipeKegiatanId: number,
    @Body() updateRekapKegiatanBulananTipeKegiatan: UpdateRekapKegiatanBulananTipeKegiatan
  ) {
    return this.kegiatanBulananService.updateDetailRekapKegiatan(+rekapTipeKegiatanId, updateRekapKegiatanBulananTipeKegiatan);
  }

  @Delete(':rekapId')
  remove(@Param('rekapId') rekapId: number) {
    return this.kegiatanBulananService.remove(+rekapId);
  }
}
