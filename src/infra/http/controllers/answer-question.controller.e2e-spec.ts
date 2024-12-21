import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockStudent } from 'test/mocks/mock-student';
import { MockQuestion } from 'test/mocks/mock-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { MockAttachment } from 'test/mocks/mock-attachment';

describe('Answer Question (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockStudent: MockStudent;
  let mockQuestion: MockQuestion;
  let mockAttachment: MockAttachment;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockAttachment, MockStudent, MockQuestion],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    mockStudent = moduleRef.get(MockStudent);
    mockQuestion = moduleRef.get(MockQuestion);
    mockAttachment = moduleRef.get(MockAttachment);
    await app.init();
  });

  test('[POST] /question/:questionId/answer', async () => {
    const { accessToken, student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    const attachment1 = await mockAttachment.insertAttachmentOnDb();
    const attachment2 = await mockAttachment.insertAttachmentOnDb();

    const result = await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/answer`)
      .send({
        content: 'sorry, but i don"t know to answer your question',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(result.statusCode).toBe(201);
    const answerOnDatabase = await prisma.answer.findMany();
    expect(answerOnDatabase).toHaveLength(1);

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { answerId: answerOnDatabase[0].id },
    });
    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});
