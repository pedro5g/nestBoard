import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import { MockQuestion } from 'test/mocks/mock-question';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { MockQuestionAttachment } from 'test/mocks/mock-question-attachment';
import { CacheRepository } from '@/infra/cache/repository/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository';
import { makeQuestion } from 'test/factories/make-question';

describe('Prisma Question Repository (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockQuestion: MockQuestion;
  let mockQuestionAttachment: MockQuestionAttachment;
  let mockStudent: MockStudent;
  let cacheRepository: CacheRepository;
  let questionRepository: QuestionsRepository;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [MockQuestion, MockStudent, MockQuestionAttachment],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    mockStudent = moduleRef.get(MockStudent);
    mockQuestion = moduleRef.get(MockQuestion);
    mockQuestionAttachment = moduleRef.get(MockQuestionAttachment);
    questionRepository = moduleRef.get(QuestionsRepository);
    cacheRepository = moduleRef.get(CacheRepository);
    await app.init();
  });

  it('should cache question details', async () => {
    const { student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    await mockQuestionAttachment.insertAttachmentOnDb({ id: question.id });

    const questionDetails =
      await questionRepository.findQuestionWithDetailsBySlug(
        question.slug.value,
      );

    const cached = await cacheRepository.get(
      `question:details:${question.slug.value}`,
    );

    expect(cached).toBeTruthy();
    expect(JSON.parse(cached!)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    );
  });

  it('should return cached question on subsequent calls', async () => {
    const { student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });

    await mockQuestionAttachment.insertAttachmentOnDb({ id: question.id });

    let cached = await cacheRepository.get(
      `question:details:${question.slug.value}`,
    );

    expect(cached).toBeNull();

    const questionDetails =
      await questionRepository.findQuestionWithDetailsBySlug(
        question.slug.value,
      );

    cached = await cacheRepository.get(
      `question:details:${question.slug.value}`,
    );

    expect(cached).not.toBeNull();
    expect(JSON.parse(cached!)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    );
  });

  it('should reset question cache when saving the question', async () => {
    const { student } = await mockStudent.createSession();
    const question = await mockQuestion.insertQuestionOnDb({
      authorId: student.id,
    });
    await mockQuestionAttachment.insertAttachmentOnDb({ id: question.id });

    await questionRepository.update(question);

    const cache = await cacheRepository.get(
      `question:details:${question.slug.value}`,
    );

    expect(cache).toBeNull();
  });
});
