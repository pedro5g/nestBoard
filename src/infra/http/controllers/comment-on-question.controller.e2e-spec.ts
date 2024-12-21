import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Comment On Question (e2e)', () => {
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

  test('[POST] /question/:questionId/comment', async () => {
    const { student, accessToken } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });

    const response = await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/comment`)
      .send({
        content: 'comment for test',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    const comments = await prisma.comment.findMany();

    expect(response.statusCode).toBe(201);
    expect(comments).toHaveLength(1);
  });
});
