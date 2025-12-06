import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AdminSatkerService } from './admin-satker.service';
import { Mahasiswa } from 'src/mahasiswa/dto/mahasiswa.entity';
import { CreateAdminSatkerDto } from './dto/admin-satker/create-adminSatker.dto';
import { UpdateAdminSatkerDto } from './dto/admin-satker/update-adminSatker.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';

@Controller('admin-satker')
@ApiTags('Admin Satker')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminSatkerController {
  constructor(private readonly adminSatkerService: AdminSatkerService) {}

  @Get()
  async findAllAdminSatkerBy(
    @Query() params: {
      email?: string;
      namaSatker?: string;
      searchSatker?: string;
      page?: number;
      pageSize?: number;
    }
  ) {
    return this.adminSatkerService.findAllAdminSatkerBy(params);
  }

  @Put('/assign-mahasiswa/pemlap/:pemlapId')
  async assignMahasiswaToDosenPembimbingMagang(
    @Param('pemlapId') pemlapId: number,
    @Body() params: Mahasiswa[]
  ) {
    return this.adminSatkerService.assignMahasiswaToPembimbingLapangan(+pemlapId, params);
  }

  @Put('unassign-mahasiswa/pemlap/:pemlapId')
  async unassignMahasiswaToDosenPembimbingMagang(
    @Param('pemlapId') pemlapId: number,
    @Body() params: Mahasiswa[]
  ) {
    return this.adminSatkerService.unassignMahasiswaToPembimbingLapangan(+pemlapId, params);
  }

  @Post('bulk')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  createBulk(
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      throw new Error('File harus berformat xlsx');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    return this.adminSatkerService.createBulk(data);
  }

  @Post(':satkerId')
  async create(
    @Param('satkerId') satkerId: number,
    @Body() createAdminSatker: CreateAdminSatkerDto
  ) {
    return this.adminSatkerService.create(+satkerId, createAdminSatker);
  }

  @Put(':adminSatkerId')
  async update(
    @Param('adminSatkerId') adminSatkerId: string,
    @Body() updateAdminSatkerDto: UpdateAdminSatkerDto
  ) {
    return this.adminSatkerService.update(+adminSatkerId, updateAdminSatkerDto);
  }
}
