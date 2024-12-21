import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockStudent } from 'test/mocks/mock-student';
import { MockQuestion } from 'test/mocks/mock-question';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Delete question (e2e)', () => {
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

  test('[DELETE] /question/:questionId', async () => {
    const { student, accessToken } = await mockStudent.createSession();
    await mockQuestion.insertQuestionOnDb({ authorId: student.id });

    // get all questions recent created
    const data = await request(app.getHttpServer())
      .get('/question/get-recent')
      .set('Authorization', `Bearer ${accessToken}`);

    const questionId = data.body.questions[0].id;

    const response = await request(app.getHttpServer())
      .delete(`/question/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const questions = await prisma.question.findMany();

    expect(questions).toHaveLength(0);
  });
});
