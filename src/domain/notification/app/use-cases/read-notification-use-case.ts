import { Either, left, right } from '@/core/__error/either';
import { NotificationsRepository } from '../repositories/notification-repository';
import { ResourceNotFoundError } from '@/core/__error/__errors/resource-not-found-error';
import { NotAllowedError } from '@/core/__error/__errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

export interface ReadNotificationUseCaseRequest {
  notificationId: string;
  recipientId: string;
}
export type ReadNotificationUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({});
  }
}
