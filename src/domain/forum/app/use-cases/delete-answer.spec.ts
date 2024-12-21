import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repository/in-memory-answers-repository';
import { DeleteAnswerUseCase } from './delete-answer';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repository/in-memory-answer-attachment-repository';
import { Answer } from '../../enterprise/entities/answer';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

let fkRepo: InMemoryAnswersRepository;
let fkAnswerAttachmentRepo: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;
let newAnswer: Answer;
describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    fkAnswerAttachmentRepo = new InMemoryAnswerAttachmentsRepository();
    fkRepo = new InMemoryAnswersRepository(fkAnswerAttachmentRepo);
    sut = new DeleteAnswerUseCase(fkRepo);
    newAnswer = makeAnswer();
  });

  it('should be able to delete a answer', async () => {
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.items).toHaveLength(0);
  });

  it('should be able to delete a answer with its attachments', async () => {
    await fkRepo.create(newAnswer);

    const answerAttachments = [
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('3'),
      }),
    ];

    answerAttachments.forEach(async (i) => {
      await fkAnswerAttachmentRepo.create(i);
    });

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId,
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkAnswerAttachmentRepo.items).toStrictEqual([]);
  });

  it('should be throw a Error when trying delete a answer to pass invalid questionId', async () => {
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      answerId: 'akdjlassjlfajfl',
      authorId: newAnswer.authorId,
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be throw a Error when trying delete a answer from another user', async () => {
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'kajdlkajsljladjd',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
