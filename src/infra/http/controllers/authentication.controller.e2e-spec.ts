import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';

describe('Authenticate (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  test('[POST] /account/session', async () => {
    await request(app.getHttpServer()).post('/account/register').send({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '123456',
    });

    const result = await request(app.getHttpServer())
      .post('/account/session')
      .send({
        email: 'johndoe@test.com',
        password: '123456',
      });

    expect(result.statusCode).toBe(201);
    expect(result.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
