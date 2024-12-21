import { InMemoryQuestionsRepository } from 'test/repository/in-memory-questions-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { makeQuestion } from 'test/factories/make-question';
import { ResourceNotFoundError } from '../../../../core/__error/__errors/resource-not-found-error';
import { InMemoryQuestionAttachmentsRepository } from 'test/repository/in-memory-question-attachments-repository';
import { InMemoryAttachmentRepository } from 'test/repository/in-memory-attachment-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { makeStudent } from 'test/factories/make-student';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let inMemoryStudentRepository: InMemoryStudentRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentRepository,
      inMemoryStudentRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
  });

  it('Should be able to get a question by it slug', async () => {
    const author = makeStudent();
    const newQuestion = makeQuestion({ authorId: author.id });
    const attachment = makeAttachment();
    const questionAttachment = makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: newQuestion.id,
    });
    await inMemoryStudentRepository.create(author);
    await inMemoryAttachmentRepository.create(attachment);
    await inMemoryQuestionAttachmentRepository.create(questionAttachment);
    await inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      slug: newQuestion.slug.value,
    });

    expect(result.isRight()).toBe(true);
    //@ts-ignore
    expect(result.value?.question).toBeInstanceOf(QuestionDetails);
  });

  it('Should be throw a Error when trying get a question with a invalid slug', async () => {
    const author = makeStudent();
    const newQuestion = makeQuestion({ authorId: author.id });
    const attachment = makeAttachment({ link: 'link-test', title: 'test' });
    const questionAttachment = makeQuestionAttachment({
      attachmentId: attachment.id,
      questionId: newQuestion.id,
    });
    await inMemoryStudentRepository.create(author);
    await inMemoryAttachmentRepository.create(attachment);
    await inMemoryQuestionAttachmentRepository.create(questionAttachment);
    await inMemoryQuestionRepository.create(newQuestion);

    const result = await sut.execute({
      slug: 'fake-slug',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
