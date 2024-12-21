import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Get Recent Answers On Question (e2e)', () => {
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

    mockQuestion = moduleRef.get(MockQuestion);
    mockStudent = moduleRef.get(MockStudent);

    await app.init();
  });

  test('[GET] /question/:questionId/recent-answers', async () => {
    const { accessToken, student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/answer`)
      .send({
        content: 'sorry, but i don"t know to answer your question',
        attachments: [],
      })
      .set('Authorization', `Bearer ${accessToken}`);

    let response = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/recent-answers`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.answers).toHaveLength(1);
    expect(response.body.answers).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        content: expect.any(String),
        author: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
        createdAt: expect.any(String),
      }),
    ]);

    response = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/recent-answers?page=1`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.answers).toHaveLength(1);

    response = await request(app.getHttpServer())
      .get(`/question/${question.id.toString()}/recent-answers?page=2`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.answers).toHaveLength(0);
  });
});
