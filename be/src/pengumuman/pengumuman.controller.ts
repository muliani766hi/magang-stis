import { Controller, Get, Post, Body, Delete, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PengumumanService } from "./pengumuman.service";

@ApiTags('Pengumuman')
@ApiBearerAuth()
@Controller('pengumuman')
export class PengumumanController {
  constructor(private readonly pengumumanService: PengumumanService) { }

  @Get()
  async findPengumuman() {
    return this.pengumumanService.fetchAll();
  }

  @Post()
  async createPengumuman(
    @Body() payload: any
  ) {
    console.log(payload)
    return this.pengumumanService.create(payload);
  }

  @Delete(":groupId")
  async deletePengumuman(
    @Param('groupId') groupId: number
  ) {
    return this.pengumumanService.delete(groupId);
  }
}