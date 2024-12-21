import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { TokenPayload } from '@/infra/auth/jwt.strategy';
import { UpdateAnswerUseCase } from '@/domain/forum/app/use-cases/update-answer';

const editAnswerSchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type EditAnswerSchema = z.infer<typeof editAnswerSchema>;

@Controller('/question/:answerId/answer')
export class EditAnswerController {
  constructor(private readonly editAnswer: UpdateAnswerUseCase) {}

  @HttpCode(204)
  @Put()
  async handler(
    @Body(new ZodValidationPipe(editAnswerSchema)) body: EditAnswerSchema,
    @Param('answerId') answerId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      answerId,
      authorId: userId,
      content,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor.name) {
        case 'ResourceNotFoundError':
          throw new NotFoundException(error.message);
        case 'NotAllowedError':
          throw new MethodNotAllowedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
