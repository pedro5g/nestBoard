import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockAnswer } from 'test/mocks/mock-answer';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Choose Question Best Answer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockQuestion: MockQuestion;
  let mockAnswer: MockAnswer;
  let mockStudent: MockStudent;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockAnswer, MockQuestion, MockStudent],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    mockStudent = moduleRef.get(MockStudent);
    mockAnswer = moduleRef.get(MockAnswer);
    mockQuestion = moduleRef.get(MockQuestion);

    await app.init();
  });

  test('[PATCH] /question/:answerId/choose', async () => {
    const { student, accessToken } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    const answer = await mockAnswer.insertAnswerOnDb({
      authorId: student.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/question/${answer.id.toString()}/choose`)
      .set('Authorization', `Bearer ${accessToken}`);

    const __question = await prisma.question.findUnique({
      where: { id: question.id.toString() },
    });

    expect(response.statusCode).toBe(200);
    expect(__question?.bestAnswerId).toBe(answer.id.toString());
  });
});
