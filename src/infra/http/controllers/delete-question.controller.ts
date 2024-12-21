import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  MethodNotAllowedException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { TokenPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionUseCase } from '@/domain/forum/app/use-cases/delete-question';

@Controller('/question/:id')
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') questionId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestion.execute({
      questionId,
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
