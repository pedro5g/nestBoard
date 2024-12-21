import { InMemoryQuestionsRepository } from 'test/repository/in-memory-questions-repository';

let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
import { CreateQuestionUseCase } from './create-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repository/in-memory-question-attachments-repository';
import { InMemoryAttachmentRepository } from 'test/repository/in-memory-attachment-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';

let fakeQuestionsRepository: InMemoryQuestionsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let fkAttachmentRepository: InMemoryAttachmentRepository;
let sut: CreateQuestionUseCase;
describe('Create Question Use Case', () => {
  beforeEach(() => {
    fkStudentRepository = new InMemoryStudentRepository();
    fkAttachmentRepository = new InMemoryAttachmentRepository();
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    fakeQuestionsRepository = new InMemoryQuestionsRepository(
      fkQuestionAttachmentRepo,
      fkAttachmentRepository,
      fkStudentRepository,
    );
    sut = new CreateQuestionUseCase(fakeQuestionsRepository);
  });
  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '123456',
      content: 'content test',
      title: 'test',
      attachmentsIds: ['1', '2', '3'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.question.content).toEqual('content test');
    expect(result.value?.question.title).toEqual('test');
    expect(result.value?.question.authorId).toEqual('123456');
    expect(
      fakeQuestionsRepository.items[0].attachments.getItems(),
    ).toHaveLength(3);
  });

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '123456',
      content: 'content test',
      title: 'test',
      attachmentsIds: ['1', '2', '3'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkQuestionAttachmentRepo.items).toHaveLength(3);
  });
});
