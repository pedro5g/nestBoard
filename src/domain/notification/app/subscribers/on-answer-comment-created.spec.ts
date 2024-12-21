import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repository/in-memory-answers-repository';
import { InMemoryAnswerAttachmentsRepository } from 'test/repository/in-memory-answer-attachment-repository';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { InMemoryNotificationsRepository } from 'test/repository/in-memory-notification-repository';
import { OnAnswerCommentCreated } from './on-answer-comment-created';
import { makeAnswerComment } from 'test/factories/make-comment';
import { InMemoryAnswersCommentsRepository } from 'test/repository/in-memory-answer-comments-repository';

let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswersCommentsRepository;
let sendNotification: SendNotificationUseCase;

let sut: OnAnswerCommentCreated;

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswersCommentsRepository();
    inMemoryAnswersAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentsRepository,
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sut = new OnAnswerCommentCreated(
      inMemoryAnswersRepository,
      sendNotification,
    );
  });
  it('should send a notification when to create a new answer comment', async () => {
    const spySendNotification = vi.spyOn(sendNotification, 'execute');
    const answer = makeAnswer();
    await inMemoryAnswersRepository.create(answer);
    const answerComment = makeAnswerComment({ answerId: answer.id });
    await inMemoryAnswerCommentsRepository.create(answerComment);

    expect(spySendNotification).toHaveBeenCalledTimes(1);
  });
});
