import { CommentOnQuestionUseCase } from '@/domain/forum/app/use-cases/comment-on-question';
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { TokenPayload } from '@/infra/auth/jwt.strategy';

const commentOnQuestionBodySchema = z.object({
  content: z.string().trim(),
});

type CommentOnQuestionBody = z.infer<typeof commentOnQuestionBodySchema>;

@Controller('/question/:questionId/comment')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema))
    body: CommentOnQuestionBody,
    @Param('questionId') questionId: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const userId = currentUser.sub;
    const { content } = body;

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor.name) {
        case 'ResourceNotFoundError':
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
