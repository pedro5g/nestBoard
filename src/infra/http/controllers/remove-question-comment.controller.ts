import { DeleteQuestionCommentUseCase } from '@/domain/forum/app/use-cases/delete-question-comment';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { TokenPayload } from '@/infra/auth/jwt.strategy';
import {
  BadRequestException,
  Controller,
  Delete,
  MethodNotAllowedException,
  NotFoundException,
  Param,
} from '@nestjs/common';

@Controller('/question/:commentId/comment')
export class RemoveQuestionCommentController {
  constructor(
    private readonly removeQuestionComment: DeleteQuestionCommentUseCase,
  ) {}
  @Delete()
  async handler(
    @Param('commentId') commentId: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const userId = currentUser.sub;

    const result = await this.removeQuestionComment.execute({
      commentId,
      authorId: userId,
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
