import { UpdateQuestionUseCase } from '@/domain/forum/app/use-cases/update-question';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { TokenPayload } from '@/infra/auth/jwt.strategy';

const editQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type EditQuestionSchema = z.infer<typeof editQuestionSchema>;

@Controller('/question/:questionId')
export class EditQuestionController {
  constructor(private readonly editQuestion: UpdateQuestionUseCase) {}
  @HttpCode(204)
  @Put()
  async handle(
    @Body(new ZodValidationPipe(editQuestionSchema)) body: EditQuestionSchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      attachmentsIds: attachments,
      authorId: userId,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
