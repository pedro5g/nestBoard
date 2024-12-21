import { Either, right } from '@/core/__error/either';
import { Notification } from '../../enterprise/entities/notification';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { NotificationsRepository } from '../repositories/notification-repository';
import { Injectable } from '@nestjs/common';

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}
export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({ notification: notification });
  }
}
