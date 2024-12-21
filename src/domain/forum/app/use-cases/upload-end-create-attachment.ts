import { Either, left, right } from '@/core/__error/either';
import { Injectable } from '@nestjs/common';
import { InvalidAttachmentTypeError } from './__errors/invalid-attachment-type-error';
import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentRepository } from '../repositories/attachment-repository';
import { Uploader } from '../storage/uploader';

export interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

export type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;
@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly uploader: Uploader,
  ) {}
  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    if (!/^(image\/(jpeg|jpg|png)$|^application\/pdf$)/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      link: url,
    });

    await this.attachmentRepository.create(attachment);

    return right({ attachment });
  }
}
