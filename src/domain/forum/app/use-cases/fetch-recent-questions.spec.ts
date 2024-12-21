import { FetchRecentQuestionsUseCase } from './fetch-recent-questions';
import { Question } from '../../enterprise/entities/question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repository/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repository/in-memory-questions-repository';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAttachmentRepository } from 'test/repository/in-memory-attachment-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';

let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let fkAttachmentRepository: InMemoryAttachmentRepository;
let fakeRepo: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    fkStudentRepository = new InMemoryStudentRepository();
    fkAttachmentRepository = new InMemoryAttachmentRepository();
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    fakeRepo = new InMemoryQuestionsRepository(
      fkQuestionAttachmentRepo,
      fkAttachmentRepository,
      fkStudentRepository,
    );
    sut = new FetchRecentQuestionsUseCase(fakeRepo);
  });

  it('Should be able to return questions ordered to recent date', async () => {
    const testDatas: Question[] = [
      makeQuestion({ createdAt: new Date(2024, 8, 20) }),
      makeQuestion({ createdAt: new Date(2024, 8, 21) }),
      makeQuestion({ createdAt: new Date(2024, 8, 22) }),
    ];

    testDatas.forEach(async (i) => {
      await fakeRepo.create(i);
    });

    const result = await sut.execute({ page: 1 });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.questions).toHaveLength(3);
    expect(result.value?.questions).toEqual([
      testDatas[2],
      testDatas[1],
      testDatas[0],
    ]);
  });

  it('Should be able to paginate the recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await fakeRepo.create(makeQuestion());
    }

    const result = await sut.execute({ page: 2 });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.questions).toHaveLength(2);
  });
});
