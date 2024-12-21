import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { MockQuestionAttachment } from 'test/mocks/mock-question-attachment';

describe('Get Question By Slug (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockQuestion: MockQuestion;
  let mockQuestionAttachment: MockQuestionAttachment;
  let mockStudent: MockStudent;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockQuestion, MockStudent, MockQuestionAttachment],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    mockStudent = moduleRef.get(MockStudent);
    mockQuestion = moduleRef.get(MockQuestion);
    mockQuestionAttachment = moduleRef.get(MockQuestionAttachment);

    await app.init();
  });

  test('[GET] /question/:slug', async () => {
    const { student, accessToken } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    await mockQuestionAttachment.insertAttachmentOnDb({ id: question.id });

    let result = await request(app.getHttpServer())
      .get(`/question/${question.slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`);

    // console.log('question :', result.body.question);
    expect(result.statusCode).toBe(200);
    expect(result.body.question).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        slug: expect.any(String),
        author: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
        attachments: expect.arrayContaining([
          expect.objectContaining({
            title: expect.any(String),
            url: expect.any(String),
          }),
        ]),
      }),
    );
  });
});
