import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Private API Magang Mahasiswa Politeknik Statistika STIS';
  }
}
