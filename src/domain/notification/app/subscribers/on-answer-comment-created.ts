import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handle';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event';
import { AnswersRepository } from '@/domain/forum/app/repositories/answer-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      AnswerCommentCreatedEvent.name,
      this.sendNewNotification.bind(this),
    );
  }

  private async sendNewNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId,
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId,
        title: `Nove comentário em sua resposta`,
        content: answerComment.content,
      });
    }
  }
}
