import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionCommentsRepository } from 'test/repository/in-memory-question-comments-repository';
import { makeQuestionComment } from 'test/factories/make-comment';
import { GetQuestionCommentsUseCase } from './get-question-comments';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: GetQuestionCommentsUseCase;
describe('Get Question Comments Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentRepository,
    );
    sut = new GetQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to list comments with author infos', async () => {
    const student = makeStudent();
    await inMemoryStudentRepository.create(student);
    const newQuestion = makeQuestion({ authorId: student.id });

    for (let i = 0; i < 21; i++) {
      const questionComment = makeQuestionComment({
        authorId: student.id,
        questionId: newQuestion.id,
        content: 'contente test',
      });

      await inMemoryQuestionCommentsRepository.create(questionComment);
    }

    const result = await sut.execute({
      page: 1,
      questionId: newQuestion.id.toString(),
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
    const newQuestion = makeQuestion({ authorId: student.id });

    for (let i = 0; i < 21; i++) {
      const questionComment = makeQuestionComment({
        authorId: student.id,
        questionId: newQuestion.id,
        content: 'contente test',
      });

      await inMemoryQuestionCommentsRepository.create(questionComment);
    }

    const result = await sut.execute({
      page: 2,
      questionId: newQuestion.id.toString(),
    });
    expect(result.isRight()).toBeTruthy();
    expect(result.value?.comments).toHaveLength(1);
  });
});
