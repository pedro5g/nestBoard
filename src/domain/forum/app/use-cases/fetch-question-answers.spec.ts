import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswersRepository } from 'test/repository/in-memory-answers-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repository/in-memory-answer-attachment-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

let fkAnswerAttachmentRepo: InMemoryAnswerAttachmentsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let fakeRepo: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Question Answers Use Case', () => {
  beforeEach(() => {
    fkStudentRepository = new InMemoryStudentRepository();
    fkAnswerAttachmentRepo = new InMemoryAnswerAttachmentsRepository();
    fakeRepo = new InMemoryAnswersRepository(
      fkAnswerAttachmentRepo,
      fkStudentRepository,
    );
    sut = new FetchQuestionAnswersUseCase(fakeRepo);
  });

  it('Should be able to return questions ordered to recent date', async () => {
    const student = makeStudent();
    await fkStudentRepository.create(student);
    const question = makeQuestion({ authorId: student.id });

    for (let i = 0; i < 41; i++) {
      await fakeRepo.create(
        makeAnswer({ questionId: question.id, authorId: student.id }),
      );
    }

    let result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(20);
    expect(result.value?.answers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          answerId: expect.any(UniqueEntityId),
          content: expect.any(String),
          author: expect.objectContaining({
            authorId: student.id,
            authorName: student.name,
          }),
          createdAt: expect.any(Date),
        }),
      ]),
    );

    result = await sut.execute({
      questionId: question.id.toString(),
      page: 3,
    });

    expect(result.value?.answers).toHaveLength(1);
  });
});
