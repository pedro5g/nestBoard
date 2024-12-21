import { InMemoryAnswersCommentsRepository } from 'test/repository/in-memory-answer-comments-repository';
import { AnswersRepository } from '../repositories/answer-repository';
import { CommentOnAnswerUseCase } from './comment-on-answer';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repository/in-memory-answers-repository';
import { AnswerComment } from '../../enterprise/entities/answer-comments';
import { InMemoryAnswerAttachmentsRepository } from 'test/repository/in-memory-answer-attachment-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';

let fkAnswerAttachmentRepo: InMemoryAnswerAttachmentsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let fakeAnswerRepo: AnswersRepository;
let fakeAnswerCommentsRepo: InMemoryAnswersCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('test Comment On Answer Use Case', () => {
  beforeEach(() => {
    fkStudentRepository = new InMemoryStudentRepository();
    fkAnswerAttachmentRepo = new InMemoryAnswerAttachmentsRepository();
    fakeAnswerRepo = new InMemoryAnswersRepository(fkAnswerAttachmentRepo);
    fakeAnswerCommentsRepo = new InMemoryAnswersCommentsRepository(
      fkStudentRepository,
    );

    sut = new CommentOnAnswerUseCase(fakeAnswerRepo, fakeAnswerCommentsRepo);
  });

  it('Should be able to comment in a answer', async () => {
    const newAnswer = makeAnswer();
    await fakeAnswerRepo.create(newAnswer);

    const result = await sut.execute({
      authorId: 'fake-author-id',
      answerId: newAnswer.id.toString(),
      content: 'this is a test content',
    });

    expect(result.isRight()).toBeTruthy();
    //@ts-ignore
    expect(result.value?.answerComment).toBeInstanceOf(AnswerComment);
    //@ts-ignore
    expect(result.value?.answerComment).toEqual(
      fakeAnswerCommentsRepo.items[0],
    );
  });
});
