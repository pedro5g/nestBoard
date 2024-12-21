import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Get Question Comments (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockQuestion: MockQuestion;

  let mockStudent: MockStudent;

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

  test('[GET] /question/:questionId/comment', async () => {
    const { student, accessToken } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });

    await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/comment`)
      .send({
        content: 'comment for test',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    let result = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/comment`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(200);
    expect(result.body.comments).toEqual(
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

    result = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/comment?page=1`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.status).toBe(200);
    expect(result.body.comments).toHaveLength(1);

    result = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/comment?page=2`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.status).toBe(200);
    expect(result.body.comments).toHaveLength(0);
  });
});
