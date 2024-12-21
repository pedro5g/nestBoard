import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handle';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository';
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      QuestionCommentCreatedEvent.name,
      this.sendNewNotification.bind(this),
    );
  }

  private async sendNewNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId,
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId,
        title: `Nove comentário na sua pergunta`,
        content: questionComment.content,
      });
    }
  }
}
