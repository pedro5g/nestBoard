import { DeleteAnswerCommentUseCase } from '@/domain/forum/app/use-cases/delete-answer-comment';
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

@Controller('/answer/:commentId/comment')
export class RemoveAnswerCommentController {
  constructor(
    private readonly removeAnswerComment: DeleteAnswerCommentUseCase,
  ) {}
  @Delete()
  async handler(
    @Param('commentId') commentId: string,
    @CurrentUser() currentUser: TokenPayload,
  ) {
    const userId = currentUser.sub;

    const result = await this.removeAnswerComment.execute({
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
