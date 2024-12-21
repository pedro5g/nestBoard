import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repository/in-memory-question-comments-repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { makeQuestionComment } from 'test/factories/make-comment';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { Question } from '../../enterprise/entities/question';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';

let fkRepo: InMemoryQuestionCommentsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let sut: DeleteQuestionCommentUseCase;
let newQuestion: Question;
describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    fkStudentRepository = new InMemoryStudentRepository();
    fkRepo = new InMemoryQuestionCommentsRepository(fkStudentRepository);
    sut = new DeleteQuestionCommentUseCase(fkRepo);
    newQuestion = makeQuestion();
  });

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityId('test-author-id'),
      questionId: newQuestion.id,
      content: 'contente test',
    });

    await fkRepo.create(questionComment);

    await sut.execute({
      authorId: 'test-author-id',
      commentId: questionComment.id.toString(),
    });

    expect(fkRepo.items).toHaveLength(0);
  });
  it('should return an error when trying to delete a question comment that does not exist', async () => {
    const result = await sut.execute({
      authorId: 'test-author-id',
      commentId: 'fake_id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should return an error when trying to delete a question comment another user', async () => {
    const answerComment = makeQuestionComment({
      authorId: new UniqueEntityId(),
      questionId: newQuestion.id,
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
