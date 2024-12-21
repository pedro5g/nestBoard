import { CommentOnAnswerUseCase } from '@/domain/forum/app/use-cases/comment-on-answer';
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

const commentOnAnswerBodySchema = z.object({
  content: z.string().trim(),
});

type CommentOnAnswerBody = z.infer<typeof commentOnAnswerBodySchema>;

@Controller('/answer/:answerId/comment')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema))
    body: CommentOnAnswerBody,
    @Param('answerId') answerId: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const userId = currentUser.sub;
    const { content } = body;

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
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
