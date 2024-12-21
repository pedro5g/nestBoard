import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/app/use-cases/upload-end-create-attachment';
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

const filePipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
    new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
  ],
});

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private readonly uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(filePipe) file: Express.Multer.File) {
    const { originalname, mimetype, buffer } = file;

    const result = await this.uploadAndCreateAttachment.execute({
      fileName: originalname,
      fileType: mimetype,
      body: buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new BadRequestException(error.message);
    }

    const { attachment } = result.value;

    return { attachmentId: attachment.id.value };
  }
}
