import { Controller, Get, Post, Body, Delete, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PemberkasanService } from "./pemberkasan.service";

@ApiTags('Pengumuman')
@ApiBearerAuth()
@Controller('pemberkasan')
export class PemberkasanController {
  constructor(private readonly pemberkasanService: PemberkasanService) { }

  @Get()
  async findPengumuman() {
    return this.pemberkasanService.fetchAll();
  }

  // @Post()
  // async createPengumuman(
  //   @Body() payload: any
  // ) {
  //   console.log(payload)
  //   return this.pemberkasanService.create(payload);
  // }

  // @Delete(":groupId")
  // async deletePengumuman(
  //   @Param('groupId') groupId: number
  // ) {
  //   return this.pemberkasanService.delete(groupId);
  // }
}