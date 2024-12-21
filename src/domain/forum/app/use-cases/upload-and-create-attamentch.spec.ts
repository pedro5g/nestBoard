import { InMemoryAttachmentRepository } from 'test/repository/in-memory-attachment-repository';
import { UploadAndCreateAttachmentUseCase } from './upload-end-create-attachment';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeError } from './__errors/invalid-attachment-type-error';

let inMemoryAttachmentRepository: InMemoryAttachmentRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakeUploader,
    );
  });

  it('should be able to upload a file', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to upload files within invalid type', async () => {
    const invalidFiles = [
      {
        fileName: 'profile.,mpeg',
        fileType: 'audio/mpeg',
        body: Buffer.from(''),
      },
      {
        fileName: 'profile.text',
        fileType: 'text',
        body: Buffer.from(''),
      },
    ];

    let result = await sut.execute(invalidFiles[0]);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);

    result = await sut.execute(invalidFiles[1]);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
