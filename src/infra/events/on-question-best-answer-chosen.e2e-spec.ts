import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockAnswer } from 'test/mocks/mock-answer';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { waitFor } from 'test/utils/wait-for';
import { DomainEvents } from '@/core/events/domain-events';

describe('On Question Best Answer Chosen (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockQuestion: MockQuestion;
  let mockAnswer: MockAnswer;
  let mockStudent: MockStudent;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockAnswer, MockQuestion, MockStudent],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    mockStudent = moduleRef.get(MockStudent);
    mockAnswer = moduleRef.get(MockAnswer);
    mockQuestion = moduleRef.get(MockQuestion);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it('should send a notification when chosen best answer', async () => {
    const { student, accessToken } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    const answer = await mockAnswer.insertAnswerOnDb({
      authorId: student.id,
      questionId: question.id,
    });

    await request(app.getHttpServer())
      .patch(`/question/${answer.id.toString()}/choose`)
      .set('Authorization', `Bearer ${accessToken}`);

    await waitFor(async () => {
      const notification = await prisma.notification.findFirst({
        where: { recipientId: student.id.toString() },
      });

      expect(notification).toBeTruthy();
    });
  });
});
