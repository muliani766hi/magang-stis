import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { ProvinsiService } from './provinsi.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProvinsiDto } from '../provinsi/dto/create-provinsi.dto';
import { UpdateProvinsiDto } from '../provinsi/dto/update-provinsi.dto';

@Controller('provinsi')
@ApiBearerAuth()
@ApiTags('Provinsi')
@UseGuards(JwtAuthGuard)
export class ProvinsiController {
  constructor(private readonly provinsiService: ProvinsiService) { }

  @Post()
  create(
    @Body() createProvinsiDto: CreateProvinsiDto
  ) {
    return this.provinsiService.create(createProvinsiDto);
  }

  @Get()
  async findAllProvinsiBy(
    @Query() params: {
      nama?: string;
      kodeProvinsi?: string;
    }
  ) {
    return await this.provinsiService.findAllProvinsiBy(params);
  }

  @Put(':provinsiId')
  update(
    @Param('provinsiId') provinsiId: string,
    @Body() updateProvinsiDto: UpdateProvinsiDto
  ) {
    return this.provinsiService.update(+provinsiId, updateProvinsiDto);
  }

  @Delete(':provinsiId')
  remove(@Param('provinsiId') provinsiId: number) {
    return this.provinsiService.remove(+provinsiId);
  }
}
