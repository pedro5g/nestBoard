import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/database.service';
import { makeQuestion } from 'test/factories/make-question';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper';
import { QuestionProps } from '@/domain/forum/enterprise/entities/question';
import { makeNotification } from 'test/factories/make-notification';
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper';
import { NotificationProps } from '@/domain/notification/enterprise/entities/notification';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

@Injectable()
export class MockNotification {
  constructor(private prisma: PrismaService) {}

  async insertNotificationOnDb({
    id,
    ...override
  }: Partial<NotificationProps & { id: string }> = {}) {
    const notification = makeNotification(override, new UniqueEntityId(id));
    const data = PrismaNotificationMapper.toPrismaFormat(notification);
    await this.prisma.notification.create({ data });

    return notification;
  }
}
