import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Get recent questions (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockStudent: MockStudent;
  let mockQuestion: MockQuestion;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockQuestion, MockStudent],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    mockStudent = moduleRef.get(MockStudent);
    mockQuestion = moduleRef.get(MockQuestion);

    await app.init();
  });

  test('[GET] /question/get-recent', async () => {
    const { student, accessToken } = await mockStudent.createSession();
    await mockQuestion.insertQuestionOnDb({ authorId: student.id });

    let response = await request(app.getHttpServer())
      .get('/question/get-recent')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toHaveLength(1);

    response = await request(app.getHttpServer())
      .get('/question/get-recent?page=1')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toHaveLength(1);

    response = await request(app.getHttpServer())
      .get('/question/get-recent?page=2')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toHaveLength(0);
  });
});
