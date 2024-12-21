import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockStudent } from 'test/mocks/mock-student';
import { MockAttachment } from 'test/mocks/mock-attachment';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Edit question (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockStudent: MockStudent;
  let mockAttachment: MockAttachment;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockAttachment, MockStudent],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    mockStudent = moduleRef.get(MockStudent);
    mockAttachment = moduleRef.get(MockAttachment);

    await app.init();
  });

  test('[PUT] /question/:questionId', async () => {
    const { accessToken } = await mockStudent.createSession();

    const attachment1 = await mockAttachment.insertAttachmentOnDb();
    const attachment2 = await mockAttachment.insertAttachmentOnDb();

    const response = await request(app.getHttpServer())
      .post('/question/create')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'new question',
        content: 'new question content',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'new question' },
    });

    const attachment3 = await mockAttachment.insertAttachmentOnDb({
      title: 'attachment3',
    });

    const res = await request(app.getHttpServer())
      .put(`/question/${questionOnDatabase?.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'new question',
        content: 'new question content',
        attachments: [attachment3.id.toString()],
      });

    expect(res.statusCode).toBe(204);

    const updatedAttachment = await prisma.attachment.findFirst({
      where: { questionId: questionOnDatabase?.id },
    });
    expect(updatedAttachment).toBeTruthy();
    expect(updatedAttachment).toEqual(
      expect.objectContaining({ title: 'attachment3' }),
    );
  });
});
