import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockStudent } from 'test/mocks/mock-student';
import { MockQuestion } from 'test/mocks/mock-question';
import { DatabaseModule } from '@/infra/database/database.module';
import { waitFor } from 'test/utils/wait-for';
import { DomainEvents } from '@/core/events/domain-events';

describe('Answer Created (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockStudent: MockStudent;
  let mockQuestion: MockQuestion;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockStudent, MockQuestion],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    mockStudent = moduleRef.get(MockStudent);
    mockQuestion = moduleRef.get(MockQuestion);

    DomainEvents.shouldRun = true;
    await app.init();
  });

  it('should send a notification when answer is created', async () => {
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

    await waitFor(async () => {
      const notification = await prisma.notification.findFirst({
        where: { recipientId: student.id.toString() },
      });

      expect(notification).toBeTruthy();
    });
  });
});
