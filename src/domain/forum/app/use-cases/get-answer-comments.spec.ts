import { makeAnswer } from 'test/factories/make-answer';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-comment';
import { GetAnswerCommentsUseCase } from './get-answer-comments';
import { InMemoryAnswersCommentsRepository } from 'test/repository/in-memory-answer-comments-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryAnswersCommentsRepository: InMemoryAnswersCommentsRepository;
let sut: GetAnswerCommentsUseCase;
describe('Get Answer Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryAnswersCommentsRepository = new InMemoryAnswersCommentsRepository(
      inMemoryStudentRepository,
    );
    sut = new GetAnswerCommentsUseCase(inMemoryAnswersCommentsRepository);
  });

  it('should be able to list comments of an answer with author info', async () => {
    const student = makeStudent();
    await inMemoryStudentRepository.create(student);
    const newAnswer = makeAnswer({ authorId: student.id });

    for (let i = 0; i < 21; i++) {
      const questionComment = makeAnswerComment({
        authorId: student.id,
        answerId: newAnswer.id,
        content: 'contente test',
      });

      await inMemoryAnswersCommentsRepository.create(questionComment);
    }

    const result = await sut.execute({
      page: 1,
      answerId: newAnswer.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.comments).toHaveLength(20);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: expect.any(UniqueEntityId),
          content: expect.any(String),
          author: expect.objectContaining({
            authorId: expect.any(UniqueEntityId),
            authorName: expect.any(String),
          }),
          createdAt: expect.any(Date),
        }),
      ]),
    );
  });
  it('should be able to paginate comments of question', async () => {
    const student = makeStudent();
    await inMemoryStudentRepository.create(student);
    const newAnswer = makeAnswer({ authorId: student.id });

    for (let i = 0; i < 21; i++) {
      const questionComment = makeAnswerComment({
        authorId: student.id,
        answerId: newAnswer.id,
        content: 'contente test',
      });

      await inMemoryAnswersCommentsRepository.create(questionComment);
    }

    const result = await sut.execute({
      page: 2,
      answerId: newAnswer.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.comments).toHaveLength(1);
  });
});
