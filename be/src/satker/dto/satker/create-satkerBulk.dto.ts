import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSatkerBulkDto {
  @IsNotEmpty()
  @IsString()
  nama: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsString()
  kodeSatker: string;

  kabupatenKota: {
      create: {
      nama: string;
      kodeKabupatenKota: string;
      provinsi: {
        connect: {
          kodeProvinsi: string;
        }
      }
    }
  };

  provinsi: {
    connect: {
      kodeProvinsi: string;
    }
  };

  // adminProvinsi: {
  //   connect: {
  //     provinsiId: number;
  //   },
  // };

  // adminSatker: {
  //   create: {
  //     user: {
  //       create: {
  //         email: string;
  //         password: string;
  //         tahunAjaran: {
  //           connect: {
  //             tahunAjaranId: number;
  //           }
  //         }
  //         userRoles: {
  //           create: {
  //             roleId: number;
  //           }
  //         }
  //       },
  //     }
  //   }
  // };

  kapasitasSatkerTahunAjaran: {
    create: {
      tahunAjaran: {
        connect: {
          tahunAjaranId: number;
        }
      }
    }
  };

  @IsNotEmpty()
  @IsBoolean()
  internalBPS: boolean;
}
