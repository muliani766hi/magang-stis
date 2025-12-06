import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put, UseInterceptors, UploadedFile, UseFilters } from '@nestjs/common';
import { AdminProvinsiService } from './admin-provinsi.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateAdminProvinsiDto } from '../admin-provinsi/dto/create-adminProvinsi.dto';
import { UpdateAdminProvinsiDto } from '../admin-provinsi/dto/update-adminProvinsi.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { MulterError } from 'multer';
import { MulterErrorFilter } from 'src/filters/multer-error.filter';

@ApiBearerAuth()
@ApiTags('Admin Provinsi')
@UseGuards(JwtAuthGuard)
@Controller('admin-provinsi')
export class AdminProvinsiController {
  constructor(private readonly adminProvinsiService: AdminProvinsiService) { }

  @Post()
  create(
    @Body() createAdminProvinsiDto: CreateAdminProvinsiDto
  ) {
    return this.adminProvinsiService.create(createAdminProvinsiDto);
  }

  @Post('bulk')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor(
    'file', {
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          cb(new Error('File harus berformat xlsx'), false);
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024
      }
    }
  ))
  // @UseFilters(MulterError)
  @UseFilters(new MulterErrorFilter()) 
  createBulk(
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
  
      return this.adminProvinsiService.createBulk(data);
    } catch (error) {
      if (error instanceof MulterError) {
        throw new Error('File harus berformat xlsx');
      }
    }
  }

  @Get()
  findAllAdminProvinsiBy(
    @Query() params: {
      email: string;
      namaProvinsi: string;
      kodeProvinsi: string;
      searchNama?: string;
      searchNIP?: string;
      page?: string;
      pageSize?: string;
    }
  ) {
    return this.adminProvinsiService.findAllAdminProvinsiBy(params);
  }
  //test docker

  @Get('chart')
  fetchChartPengalokasian( ) {
    return this.adminProvinsiService.fetchChartPengalokasian();
  }


  @Put(':adminProvinsiId')
  update(
    @Param('adminProvinsiId') adminProvinsiId: string,
    @Body() updateAdminProvinsiDto: UpdateAdminProvinsiDto
  ) {
    return this.adminProvinsiService.update(+adminProvinsiId, updateAdminProvinsiDto);
  }

  @Delete(':adminProvinsiId')
  remove(@Param('adminProvinsiId') adminProvinsiId: number) {
    return this.adminProvinsiService.remove(+adminProvinsiId);
  }
}
