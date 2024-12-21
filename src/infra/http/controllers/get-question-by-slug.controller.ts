import { GetQuestionBySlugUseCase } from '@/domain/forum/app/use-cases/get-question-by-slug';
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { QuestionDetailsPresenter } from '../presenters/question-details-presenter';

@Controller('/question/:slug')
export class GetQuestionBySlugController {
  constructor(
    private readonly getQuestionBySlugUseCase: GetQuestionBySlugUseCase,
  ) {}

  @Get()
  async handler(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlugUseCase.execute({ slug });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor.name) {
        case 'ResourceNotFoundError':
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return { question: QuestionDetailsPresenter.toHTTP(result.value.question) };
  }
}
