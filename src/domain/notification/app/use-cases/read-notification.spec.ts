import { InMemoryNotificationsRepository } from 'test/repository/in-memory-notification-repository';
import { ReadNotificationUseCase } from './read-notification-use-case';
import { Notification } from '../../enterprise/entities/notification';
import { makeNotification } from 'test/factories/make-notification';
import { NotAllowedError } from '@/core/__error/__errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/__error/__errors/resource-not-found-error';

let testNotification: Notification;
let fakeNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification Use Case Test', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(fakeNotificationsRepository);
    testNotification = makeNotification();
  });
  it('should be able to read a new Notification', async () => {
    await fakeNotificationsRepository.create(testNotification);
    const spyRead = vitest.spyOn(testNotification, 'read');

    const result = await sut.execute({
      recipientId: testNotification.recipientId.toString(),
      notificationId: testNotification.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(spyRead).toBeCalledTimes(1);
    expect(fakeNotificationsRepository.items[0].readAt).not.toBeUndefined();
  });

  it("should not be able to read a notification that don't exists", async () => {
    const result = await sut.execute({
      recipientId: testNotification.recipientId.toString(),
      notificationId: testNotification.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to read a notification another user', async () => {
    await fakeNotificationsRepository.create(testNotification);

    const result = await sut.execute({
      recipientId: 'fake-recipient-id',
      notificationId: testNotification.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
