import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { InMemoryAnswersCommentsRepository } from 'test/repository/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment';
import { makeAnswer } from 'test/factories/make-answer';
import { makeAnswerComment } from 'test/factories/make-comment';
import { Answer } from '../../enterprise/entities/answer';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';

let fkRepo: InMemoryAnswersCommentsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let sut: DeleteAnswerCommentUseCase;
let newAnswer: Answer;
describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    fkStudentRepository = new InMemoryStudentRepository();
    fkRepo = new InMemoryAnswersCommentsRepository(fkStudentRepository);
    sut = new DeleteAnswerCommentUseCase(fkRepo);
    newAnswer = makeAnswer();
  });

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId('test-author-id'),
      answerId: newAnswer.id,
      content: 'contente test',
    });

    await fkRepo.create(answerComment);

    const result = await sut.execute({
      authorId: 'test-author-id',
      commentId: answerComment.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({});
    expect(fkRepo.items).toHaveLength(0);
  });

  it('should return an error when trying to delete a answer comment that does not exist', async () => {
    const result = await sut.execute({
      authorId: 'test-author-id',
      commentId: 'fake_id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should return an error when trying to delete a answer comment another user', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId(),
      answerId: newAnswer.id,
      content: 'contente test',
    });

    await fkRepo.create(answerComment);

    const result = await sut.execute({
      authorId: 'test-author-id',
      commentId: answerComment.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
