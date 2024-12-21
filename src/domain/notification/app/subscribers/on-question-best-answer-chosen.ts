import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handle';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen';
import { AnswersRepository } from '@/domain/forum/app/repositories/answer-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      QuestionBestAnswerChosenEvent.name,
      this.sendNewNotification.bind(this),
    );
  }

  private async sendNewNotification({
    bestAnswerId,
    question,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await Promise.all([
        this.sendNotification.execute({
          recipientId: question.authorId,
          title: `Melhor resposta escolhida!`,
          content: 'você escolheu uma melhor resposta para a sua pergunta',
        }),
        this.sendNotification.execute({
          recipientId: answer.authorId,
          title: `Sua resposta foi escolhida como a melhor`,
          content: 'Parabéns sua resposta foi escolhida como a melhor!',
        }),
      ]);
    }
  }
}
