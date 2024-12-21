import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handle';
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { Injectable } from '@nestjs/common';
@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      AnswerCreatedEvent.name,
      this.sendNewAnswerNotification.bind(this),
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(answer.questionId);

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId,
        title: `Nova resposta "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.shortContent,
      });
    }
  }
}
