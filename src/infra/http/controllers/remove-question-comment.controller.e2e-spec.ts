import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Remove Comment On Question (e2e)', () => {
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

  test('[DELETE] /question/:commentId/comment', async () => {
    const { accessToken, student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/comment`)
      .send({
        content: 'comment for test',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    let comments = await prisma.comment.findMany();
    const commentId = comments[0].id;

    const response = await request(app.getHttpServer())
      .delete(`/question/${commentId}/comment`)
      .send({
        content: 'comment for test',
      })
      .set('Authorization', `Bearer ${accessToken}`);

    comments = await prisma.comment.findMany();

    expect(response.statusCode).toBe(200);
    expect(comments).toHaveLength(0);
  });
});
