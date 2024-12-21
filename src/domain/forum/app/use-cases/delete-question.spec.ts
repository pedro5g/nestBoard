import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsRepository } from 'test/repository/in-memory-questions-repository';
import { DeleteQuestionUseCase } from './delete-question';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repository/in-memory-question-attachments-repository';
import { Question } from '../../enterprise/entities/question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { InMemoryAttachmentRepository } from 'test/repository/in-memory-attachment-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';

let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let fkAttachmentRepository: InMemoryAttachmentRepository;
let fkRepo: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;
let newQuestion: Question;
describe('Delete Question Use Case', () => {
  beforeEach(() => {
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    fkAttachmentRepository = new InMemoryAttachmentRepository();
    fkStudentRepository = new InMemoryStudentRepository();
    fkRepo = new InMemoryQuestionsRepository(
      fkQuestionAttachmentRepo,
      fkAttachmentRepository,
      fkStudentRepository,
    );
    sut = new DeleteQuestionUseCase(fkRepo);
    newQuestion = makeQuestion();
  });

  it('should be able to delete a question', async () => {
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.items).toHaveLength(0);
  });

  it('should be able to delete a question with its attachments', async () => {
    await fkRepo.create(newQuestion);

    const questionAttachments = [
      makeQuestionAttachment({
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
      }),
    ];

    questionAttachments.forEach(async (i) => {
      await fkQuestionAttachmentRepo.create(i);
    });

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkQuestionAttachmentRepo.items).toStrictEqual([]);
  });

  it('should be throw a Error when trying delete a question to pass invalid questionId', async () => {
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: 'laskldjslaslj',
      authorId: newQuestion.authorId,
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be throw a Error when trying delete a question from another user', async () => {
    await fkRepo.create(newQuestion);

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'kdajlklsahalfaskfla',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
