import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { CaslAbilityFactory } from "src/casl/casl-ability.factory";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private caslAbilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private request: Request
  ) { }

  async fetchAll () {
    const roles = await this.prisma.roles.findMany()
    return {
      data: roles
    }
  }
}