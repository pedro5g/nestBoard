import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsRepository } from 'test/repository/in-memory-questions-repository';
import { UpdateQuestionUseCase } from './update-question';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repository/in-memory-question-attachments-repository';
import { Question } from '../../enterprise/entities/question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { InMemoryAttachmentRepository } from 'test/repository/in-memory-attachment-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';

let fkQuestionRepo: InMemoryQuestionsRepository;
let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let fkAttachmentRepository: InMemoryAttachmentRepository;

let sut: UpdateQuestionUseCase;

let newQuestion: Question;

describe('Update Question Use Case', () => {
  beforeEach(() => {
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    fkStudentRepository = new InMemoryStudentRepository();
    fkAttachmentRepository = new InMemoryAttachmentRepository();
    fkQuestionRepo = new InMemoryQuestionsRepository(
      fkQuestionAttachmentRepo,
      fkAttachmentRepository,
      fkStudentRepository,
    );
    sut = new UpdateQuestionUseCase(fkQuestionRepo, fkQuestionAttachmentRepo);

    newQuestion = makeQuestion();
  });

  it('should be able to update a question', async () => {
    //@ts-ignored
    const spyTouch = vitest.spyOn(newQuestion, 'touch');
    await fkQuestionRepo.create(newQuestion);

    const result = await sut.execute({
      title: 'updated title',
      content: 'updated contente',
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
      attachmentsIds: [],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkQuestionRepo.items[0].content).toEqual('updated contente');
    expect(fkQuestionRepo.items[0].title).toEqual('updated title');
    expect(fkQuestionRepo.items[0].attachments.getItems()).toEqual([]);
    expect(spyTouch).toBeCalledTimes(2);
  });

  it('should be able to update attachments in an question', async () => {
    await fkQuestionRepo.create(newQuestion);

    const questionAttachments = [
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('3'),
      }),
    ];

    questionAttachments.forEach(async (i) => {
      await fkQuestionAttachmentRepo.create(i);
    });

    const result = await sut.execute({
      title: 'updated title',
      content: 'updated contente',
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
      attachmentsIds: ['1', '3', '4'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(fkQuestionRepo.items[0].attachments.getItems()).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('4') }),
    ]);
  });

  it('should be throw a Error when trying update a question from another user', async () => {
    await fkQuestionRepo.create(newQuestion);

    const result = await sut.execute({
      title: 'updated title',
      content: 'updated contente',
      questionId: newQuestion.id.toString(),
      authorId: 'fake-author-id-326378',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should sync new and removed attachments when editing a question', async () => {
    await fkQuestionRepo.create(newQuestion);

    const questionAttachments = [
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('3'),
      }),
    ];

    questionAttachments.forEach(async (i) => {
      await fkQuestionAttachmentRepo.create(i);
    });

    let result = await sut.execute({
      title: 'updated title',
      content: 'updated contente',
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
      attachmentsIds: ['1', '3', '4'],
    });

    expect(result.isRight()).toBe(true);
    expect(fkQuestionAttachmentRepo.items).toHaveLength(3);

    result = await sut.execute({
      title: 'updated title',
      content: 'updated contente',
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId,
      attachmentsIds: ['1', '3'],
    });

    expect(fkQuestionAttachmentRepo.items).toHaveLength(2);
    expect(fkQuestionAttachmentRepo.items).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ]);
  });
});
