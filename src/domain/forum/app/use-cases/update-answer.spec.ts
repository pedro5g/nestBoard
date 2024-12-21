import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repository/in-memory-answers-repository';
import { UpdateAnswerUseCase } from './update-answer';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repository/in-memory-answer-attachment-repository';
import { Answer } from '../../enterprise/entities/answer';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

let fkRepo: InMemoryAnswersRepository;
let fkAnswerAttachmentRepo: InMemoryAnswerAttachmentsRepository;
let sut: UpdateAnswerUseCase;
let newAnswer: Answer;
describe('Update Answer Use Case', () => {
  beforeEach(() => {
    fkAnswerAttachmentRepo = new InMemoryAnswerAttachmentsRepository();
    fkRepo = new InMemoryAnswersRepository(fkAnswerAttachmentRepo);
    sut = new UpdateAnswerUseCase(fkRepo, fkAnswerAttachmentRepo);

    newAnswer = makeAnswer();
  });

  it('should be able to update a answer', async () => {
    //@ts-ignored
    const spyTouch = vitest.spyOn(newAnswer, 'touch');
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      content: 'updated contente',
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId,
      attachmentsIds: [],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.items[0].content).toEqual('updated contente');
    expect(spyTouch).toBeCalledTimes(1);
  });

  it('should be able to update an answer with attachments', async () => {
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
      content: 'updated contente',
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId,
      attachmentsIds: ['1', '3', '4'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkRepo.items[0].attachment.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('4') }),
    ]);
  });

  it('should be throw a Error when trying update a answer from another user', async () => {
    await fkRepo.create(newAnswer);

    const result = await sut.execute({
      content: 'updated contente',
      answerId: newAnswer.id.toString(),
      authorId: 'fake-author-id-326378',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachments when editing a answer', async () => {
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

    let result = await sut.execute({
      content: 'updated contente',
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId,
      attachmentsIds: ['1', '3', '4'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkAnswerAttachmentRepo.items).toHaveLength(3);

    result = await sut.execute({
      content: 'updated contente',
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId,
      attachmentsIds: ['1', '4'],
    });

    expect(fkAnswerAttachmentRepo.items).toHaveLength(2);
    expect(fkAnswerAttachmentRepo.items).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('4') }),
    ]);
  });
});
