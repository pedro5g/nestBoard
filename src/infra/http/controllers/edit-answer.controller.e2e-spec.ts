import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockStudent } from 'test/mocks/mock-student';
import { MockAttachment } from 'test/mocks/mock-attachment';
import { DatabaseModule } from '@/infra/database/database.module';
import { MockQuestion } from 'test/mocks/mock-question';

describe('Edit answer (e2e)', () => {
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
    mockAttachment = moduleRef.get(MockAttachment);
    mockQuestion = moduleRef.get(MockQuestion);

    await app.init();
  });

  test('[PUT] /question/:answerId/answer', async () => {
    const { accessToken, student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });

    const attachment1 = await mockAttachment.insertAttachmentOnDb();
    const attachment2 = await mockAttachment.insertAttachmentOnDb();

    await request(app.getHttpServer())
      .post(`/question/${question.id.toString()}/answer`)
      .send({
        content: 'sorry, but i don"t know to answer your question',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })
      .set('Authorization', `Bearer ${accessToken}`);

    const answer = await prisma.answer.findFirst({
      where: { questionId: question.id.toString() },
    });

    const attachment3 = await mockAttachment.insertAttachmentOnDb({
      title: 'attachment3',
    });

    const res = await request(app.getHttpServer())
      .put(`/question/${answer?.id}/answer`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'i fund the solution!!!',
        attachments: [attachment3.id.toString()],
      });

    expect(res.statusCode).toBe(204);

    const updatedAttachment = await prisma.attachment.findFirst({
      where: { answerId: answer?.id },
    });
    expect(updatedAttachment).toBeTruthy();
    expect(updatedAttachment).toEqual(
      expect.objectContaining({ title: 'attachment3' }),
    );
  });
});
