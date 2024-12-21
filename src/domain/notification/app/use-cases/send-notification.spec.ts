import { InMemoryNotificationsRepository } from 'test/repository/in-memory-notification-repository';
import { SendNotificationUseCase } from './send-notification';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';

let fakeNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;
describe('Send Notification Use Case Test', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(fakeNotificationsRepository);
  });

  it('should be able to create a new Notification', async () => {
    const testId = new UniqueEntityId();
    const result = await sut.execute({
      recipientId: testId.toString(),
      title: 'title test',
      content: 'content test',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.isLeft()).toBeFalsy();

    expect(fakeNotificationsRepository.items[0].recipientId.toString()).toEqual(
      testId.toString(),
    );
  });
});
