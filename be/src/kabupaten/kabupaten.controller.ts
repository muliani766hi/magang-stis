import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { KabupatenService } from './kabupaten.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProvinsiDto } from '../provinsi/dto/create-provinsi.dto';
import { UpdateProvinsiDto } from '../provinsi/dto/update-provinsi.dto';

@Controller('kabupaten')
@ApiBearerAuth()
@ApiTags('Kabupaten')
@UseGuards(JwtAuthGuard)
export class KabupatenController {
  constructor(private readonly kabupatenService: KabupatenService) { }

  @Post()
  create(
    @Body() createProvinsiDto: CreateProvinsiDto
  ) {
    return this.kabupatenService.create(createProvinsiDto);
  }

  @Get()
  async findAllProvinsiBy(
    @Query("provinsiId")  provinsiId: string
  ) {
    return await this.kabupatenService.findAllProvinsiBy(provinsiId);
  }

  @Get('/list')
  async findKabupaten() {
    return await this.kabupatenService.findAllKabupaten();
  }

  @Put(':provinsiId')
  update(
    @Param('provinsiId') provinsiId: string,
    @Body() updateProvinsiDto: UpdateProvinsiDto
  ) {
    return this.kabupatenService.update(+provinsiId, updateProvinsiDto);
  }

  @Delete(':provinsiId')
  remove(@Param('provinsiId') provinsiId: number) {
    return this.kabupatenService.remove(+provinsiId);
  }
}
