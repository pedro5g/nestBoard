import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockAnswer } from 'test/mocks/mock-answer';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Get Answer Comments (e2e)', () => {
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

  test('[GET] /answer/:answerId/comment', async () => {
    const { student, accessToken } = await mockStudent.createSession();
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

    let response = await request(app.getHttpServer())
      .get(`/answer/${answer.id.toString()}/comment`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          comment: 'comment for test',
          author: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
          createdAt: expect.any(String),
        }),
      ]),
    );

    response = await request(app.getHttpServer())
      .get(`/answer/${answer.id.toString()}/comment?page=1`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.comments).toHaveLength(1);

    response = await request(app.getHttpServer())
      .get(`/answer/${answer.id.toString()}/comment?page=2`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.comments).toHaveLength(0);
  });
});
