import {
  BadRequestException,
  Controller,
  Delete,
  MethodNotAllowedException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { TokenPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerUseCase } from '@/domain/forum/app/use-cases/delete-answer';

@Controller('/answer/:answerId')
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  async handler(
    @Param('answerId') answerId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswer.execute({
      answerId,
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
