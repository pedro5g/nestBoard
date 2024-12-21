import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Delete Answer (e2e)', () => {
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

  test('[DELETE] /answer/:answerId', async () => {
    const { accessToken, student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    // create answer for delete after
    await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/answer`)
      .send({
        content: 'sorry, but i don"t know to answer your question',
        attachments: [],
      })
      .set('Authorization', `Bearer ${accessToken}`);

    let answerOnDatabase = await prisma.answer.findMany();

    const answerId = answerOnDatabase[0].id;

    const result = await request(app.getHttpServer())
      .delete(`/answer/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    answerOnDatabase = await prisma.answer.findMany();
    expect(result.statusCode).toBe(200);
    expect(answerOnDatabase).toHaveLength(0);
  });
});
