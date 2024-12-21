import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockAnswer } from 'test/mocks/mock-answer';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Comment On Answer (e2e)', () => {
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

  test('[POST] /answer/:answerId/comment', async () => {
    const { student, accessToken } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    const answer = await mockAnswer.insertAnswerOnDb({
      authorId: student.id,
      questionId: question.id,
    });
    const response = await request(app.getHttpServer())
      .post(`/answer/${answer.id.toString()}/comment`)
      .send({
        content: 'comment for test',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    const comments = await prisma.comment.findMany();

    expect(response.statusCode).toBe(201);
    expect(comments).toHaveLength(1);
  });
});
