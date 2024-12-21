import { InMemoryQuestionCommentsRepository } from 'test/repository/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'test/repository/in-memory-questions-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';
import { makeQuestion } from 'test/factories/make-question';
import { QuestionComment } from '../../enterprise/entities/question-comments';
import { InMemoryQuestionAttachmentsRepository } from 'test/repository/in-memory-question-attachments-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';
import { InMemoryAttachmentRepository } from 'test/repository/in-memory-attachment-repository';

let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
let fkStudentRepository: InMemoryStudentRepository;
let fkAttachmentRepository: InMemoryAttachmentRepository;
let fakeQuestionRepo: InMemoryQuestionsRepository;
let fakeQuestionCommentsRepo: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe('test Comment On Question Use Case', () => {
  beforeEach(() => {
    fkStudentRepository = new InMemoryStudentRepository();
    fkAttachmentRepository = new InMemoryAttachmentRepository();
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();

    fakeQuestionCommentsRepo = new InMemoryQuestionCommentsRepository(
      fkStudentRepository,
    );
    fakeQuestionRepo = new InMemoryQuestionsRepository(
      fkQuestionAttachmentRepo,
      fkAttachmentRepository,
      fkStudentRepository,
    );

    sut = new CommentOnQuestionUseCase(
      fakeQuestionRepo,
      fakeQuestionCommentsRepo,
    );
  });

  it('Should be able to comment in a question', async () => {
    const newQuestion = makeQuestion();
    await fakeQuestionRepo.create(newQuestion);

    const result = await sut.execute({
      authorId: 'fake-author-id',
      questionId: newQuestion.id.toString(),
      content: 'this is a test content',
    });
    expect(result.isRight()).toBeTruthy();
    //@ts-ignore
    expect(result.value?.questionComment).toBeInstanceOf(QuestionComment);
    //@ts-ignore
    expect(result.value?.questionComment).toEqual(
      fakeQuestionCommentsRepo.items[0],
    );
  });
});
