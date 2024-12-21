import { NotificationsRepository } from '@/domain/notification/app/repositories/notification-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { PrismaService } from '../database.service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaNotificationRepository implements NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrismaFormat(notification);
    await this.prisma.notification.create({
      data,
    });
  }
  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) return null;

    return PrismaNotificationMapper.toDomainFormat(notification);
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrismaFormat(notification);
    await this.prisma.notification.update({
      where: { id: data.id },
      data,
    });
  }
}
