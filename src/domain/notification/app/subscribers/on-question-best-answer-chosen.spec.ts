import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repository/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repository/in-memory-answer-attachment-repository';
import { InMemoryQuestionsRepository } from 'test/repository/in-memory-questions-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { InMemoryNotificationsRepository } from 'test/repository/in-memory-notification-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repository/in-memory-question-attachments-repository';
import { makeQuestion } from 'test/factories/make-question';
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotification: SendNotificationUseCase;

let sut: OnQuestionBestAnswerChosen;

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sut = new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotification,
    );
  });
  it('should send a notification when chosen an best answer', async () => {
    const spySendNotification = vi.spyOn(sendNotification, 'execute');
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);
    const answer = makeAnswer({ questionId: question.id });
    await inMemoryAnswersRepository.create(answer);

    question.setBeastAnswerId(answer.id);
    await inMemoryQuestionsRepository.update(question);

    expect(spySendNotification).toHaveBeenCalledTimes(2);
    expect(inMemoryNotificationsRepository.items).toHaveLength(2);
  });
});
