import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import request from 'supertest';

describe('Get recent questions (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[GET] /question/get-recent', async () => {
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

    await request(app.getHttpServer())
      .post('/question/create')
      .set('Authorization', `Bearer ${result.body.access_token}`)
      .send({
        title: 'new question',
        content: 'new question content',
      });

    let response = await request(app.getHttpServer())
      .get('/question/get-recent')
      .set('Authorization', `Bearer ${result.body.access_token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toHaveLength(1);

    response = await request(app.getHttpServer())
      .get('/question/get-recent?page=1')
      .set('Authorization', `Bearer ${result.body.access_token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toHaveLength(1);

    response = await request(app.getHttpServer())
      .get('/question/get-recent?page=2')
      .set('Authorization', `Bearer ${result.body.access_token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toHaveLength(0);
  });
});
