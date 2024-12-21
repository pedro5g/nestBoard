import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repository/in-memory-answers-repository';
import { InMemoryQuestionsRepository } from 'test/repository/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer';
import { Question } from '../../enterprise/entities/question';
import { makeQuestion } from 'test/factories/make-question';
import { NotAllowedError } from '../../../../core/__error/__errors/not-allowed-error';
import { InMemoryAnswerAttachmentsRepository } from 'test/repository/in-memory-answer-attachment-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repository/in-memory-question-attachments-repository';
import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';
import { InMemoryAttachmentRepository } from 'test/repository/in-memory-attachment-repository';

let fkStudentStudentRepository: InMemoryStudentRepository;
let fkAttachmentRepository: InMemoryAttachmentRepository;
let fkAnswerAttachmentRepo: InMemoryAnswerAttachmentsRepository;
let fkQuestionAttachmentRepo: InMemoryQuestionAttachmentsRepository;
let fkAnswersRepository: InMemoryAnswersRepository;
let fkQuestionsRepository: InMemoryQuestionsRepository;
let question: Question;
let sut: ChooseQuestionBestAnswerUseCase;
describe('Choose Question Best Answer Use Case', () => {
  beforeEach(async () => {
    fkStudentStudentRepository = new InMemoryStudentRepository();
    fkAttachmentRepository = new InMemoryAttachmentRepository();
    fkAnswerAttachmentRepo = new InMemoryAnswerAttachmentsRepository();
    fkQuestionAttachmentRepo = new InMemoryQuestionAttachmentsRepository();
    fkAnswersRepository = new InMemoryAnswersRepository(fkAnswerAttachmentRepo);
    fkQuestionsRepository = new InMemoryQuestionsRepository(
      fkQuestionAttachmentRepo,
      fkAttachmentRepository,
      fkStudentStudentRepository,
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      fkAnswersRepository,
      fkQuestionsRepository,
    );

    question = makeQuestion();
    await fkQuestionsRepository.create(question);
  });

  it('should be able to set a best answer in a question', async () => {
    const newAnswer = makeAnswer({
      questionId: question.id,
    });

    await fkAnswersRepository.create(newAnswer);

    expect(question.bestAnswerId).toBeUndefined();
    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: question.authorId,
    });

    const item = fkQuestionsRepository.items[0];

    expect(result.isRight()).toBeTruthy();
    expect(item.bestAnswerId).not.toBeUndefined();
    expect(item.bestAnswerId).toEqual(newAnswer.id);
  });

  it('should be not able to set a best answer in a question from another user', async () => {
    const newAnswer = makeAnswer({
      questionId: question.id,
    });

    await fkAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'fake-id',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
