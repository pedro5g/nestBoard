import {
  BadRequestException,
  Controller,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { TokenPayload } from '@/infra/auth/jwt.strategy';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/app/use-cases/choose-question-best-answer';

@Controller('/question/:answerId/choose')
export class ChooseQuestionBestAnswerController {
  constructor(
    private readonly chooseBestAnswer: ChooseQuestionBestAnswerUseCase,
  ) {}

  @Patch()
  async handler(
    @Param('answerId') answerId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    const userId = user.sub;
    const result = await this.chooseBestAnswer.execute({
      authorId: userId,
      answerId,
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
