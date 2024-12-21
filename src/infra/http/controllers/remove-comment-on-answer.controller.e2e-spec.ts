import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockAnswer } from 'test/mocks/mock-answer';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Remove Comment On Answer (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockQuestion: MockQuestion;
  let mockAnswer: MockAnswer;
  let mockStudent: MockStudent;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockQuestion, MockAnswer, MockStudent],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    mockStudent = moduleRef.get(MockStudent);
    mockQuestion = moduleRef.get(MockQuestion);
    mockAnswer = moduleRef.get(MockAnswer);

    await app.init();
  });

  test('[DELETE] /answer/:commentId/comment', async () => {
    const { accessToken, student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    const answer = await mockAnswer.insertAnswerOnDb({
      authorId: student.id,
      questionId: question.id,
    });

    await request(app.getHttpServer())
      .post(`/answer/${answer.id.toString()}/comment`)
      .send({
        content: 'comment for test',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    let comments = await prisma.comment.findMany();
    const commentId = comments[0].id;

    const response = await request(app.getHttpServer())
      .delete(`/answer/${commentId}/comment`)
      .send({
        content: 'comment for test',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    comments = await prisma.comment.findMany();

    expect(response.statusCode).toBe(200);
    expect(comments).toHaveLength(0);
  });
});
