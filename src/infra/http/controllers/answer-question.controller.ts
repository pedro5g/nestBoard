import { AnswerQuestionUseCase } from '@/domain/forum/app/use-cases/answer-question';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { TokenPayload } from '@/infra/auth/jwt.strategy';

const createAnswerSchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type CreateAnswerSchema = z.infer<typeof createAnswerSchema>;

@Controller('/question/:questionId/answer')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handler(
    @Body(new ZodValidationPipe(createAnswerSchema)) body: CreateAnswerSchema,
    @Param('questionId') questionId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      instructorId: userId,
      content,
      attachmentsIds: attachments,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
