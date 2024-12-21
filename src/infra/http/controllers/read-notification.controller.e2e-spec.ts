import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/database.service';
import request from 'supertest';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { MockNotification } from 'test/mocks/mock-notification';

describe('Read Notification (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let mockStudent: MockStudent;
  let mockNotification: MockNotification;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockStudent, MockNotification],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    mockStudent = moduleRef.get(MockStudent);
    mockNotification = moduleRef.get(MockNotification);
    await app.init();
  });

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const { accessToken, student } = await mockStudent.createSession();
    const notification = await mockNotification.insertNotificationOnDb({
      recipientId: student.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: { id: notification.id.toString() },
    });

    expect(notificationOnDatabase?.readAt).toBeTruthy();
  });
});
