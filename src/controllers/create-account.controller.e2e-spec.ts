import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import request from 'supertest';

let app: INestApplication;
let prisma: PrismaService;

describe('Create account (e2e)', () => {
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });
  test('[POST] /account/register', async () => {
    const result = await request(app.getHttpServer())
      .post('/account/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@test.com',
        password: '123456',
      });

    expect(result.statusCode).toBe(201);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@test.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
