import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import request from 'supertest';

describe('Create question (e2e)', () => {
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

  test('[POST] /question/create', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/question/create')
      .set('Authorization', `Bearer ${result.body.access_token}`)
      .send({
        title: 'new question',
        content: 'new question content',
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'new question' },
    });

    expect(questionOnDatabase).toBeTruthy();
  });
});
