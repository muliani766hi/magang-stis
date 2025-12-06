import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, UseInterceptors, UploadedFile, UseFilters } from '@nestjs/common';
import { AccessAlokasiService } from './access-alokasi.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateAdminProvinsiDto } from '../admin-provinsi/dto/create-adminProvinsi.dto';
import { UpdateAdminProvinsiDto } from '../admin-provinsi/dto/update-adminProvinsi.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { MulterError } from 'multer';

@ApiBearerAuth()
@ApiTags('Access Alokasi magang')
@UseGuards(JwtAuthGuard)
@Controller('access-alocation-magang')
export class AccessAlocationController {
  constructor(private readonly accessAlokasiService: AccessAlokasiService) { }

  @Get()
  findAllAdminProvinsiBy() {
    return this.accessAlokasiService.findAccessAlokasi();
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() payload: any
  ) {
    return this.accessAlokasiService.update(Number(id), payload.status);
  }

  // @Post()
  // create(
  //   @Body() createAdminProvinsiDto: CreateAdminProvinsiDto
  // ) {
  //   return this.accessAlokasiService.create(createAdminProvinsiDto);
  // }

  // @Delete(':adminProvinsiId')
  // remove(@Param('adminProvinsiId') adminProvinsiId: number) {
  //   return this.accessAlokasiService.remove(+adminProvinsiId);
  // }
}
