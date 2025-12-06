import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwicm9sZUlkIjoxLCJpYXQiOjE3MTgwMzkyMTQsImV4cCI6MTcxODEyNTYxNH0.qO2_O1uZxXW66s4wv_CAksVWnGmXFUT8CuVxy2TGuU4';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        PrismaClient,
        AuthModule,
        UsersModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);

    await prismaClient.$executeRaw`TRUNCATE "public"."User" RESTART IDENTITY CASCADE;`;
  }, 30000);

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  // it('should login a user', async () => {
  //   const user = {
  //     email: 'admin@admin.com',
  //     password: 'makanenak',
  //     token: null
  //   };

  //   const response = await request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send(user)
  //     .expect(201);
    
  //   expect(response.body).toEqual({
  //     message: expect.any(String),
  //     token: expect.any(String)
  //   });
  // });

  it('should get all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    expect(response.body).toEqual({
      status: 'Success',
      message: 'User berhasil ditemukan',
      data: []
    });
  });
});
