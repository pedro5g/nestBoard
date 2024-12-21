import { AnswerQuestionUseCase } from './answer-question';
import { InMemoryAnswersRepository } from 'test/repository/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repository/in-memory-answer-attachment-repository';

let fakeAnswersRepository: InMemoryAnswersRepository;
let fakeAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question', () => {
  beforeEach(() => {
    fakeAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    fakeAnswersRepository = new InMemoryAnswersRepository(
      fakeAnswersAttachmentsRepository,
    );
    sut = new AnswerQuestionUseCase(fakeAnswersRepository);
  });
  it('create an answer', async () => {
    const contentTest = {
      questionId: '1232',
      instructorId: '343',
      content: 'this is a test message',
      attachmentsIds: [],
    };

    const result = await sut.execute(contentTest);

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.answer.content).toEqual(contentTest.content);
  });

  it('should be able to create an answer with attachments', async () => {
    const contentTest = {
      questionId: '1232',
      instructorId: '343',
      content: 'this is a test message',
      attachmentsIds: ['1', '2'],
    };

    const result = await sut.execute(contentTest);

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.answer.content).toEqual(contentTest.content);
    expect(fakeAnswersRepository.items[0].attachment.getItems()).toHaveLength(
      2,
    );
  });

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      questionId: '1232',
      instructorId: '343',
      content: 'this is a test message',
      attachmentsIds: ['1', '2', '3'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fakeAnswersAttachmentsRepository.items).toHaveLength(3);
  });
});
