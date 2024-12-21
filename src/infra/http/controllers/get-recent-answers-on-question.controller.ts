import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/app/use-cases/fetch-question-answers';
import { AnswerWithAuthorPresenter } from '../presenters/answer-with-author-presenter';

const paginationSchema = z.coerce.number().default(1);

@Controller('question/:questionId/recent-answers')
export class GetRecentAnswersOnQuestionController {
  constructor(
    private readonly fetchRecentAnswers: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(paginationSchema)) page: number,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchRecentAnswers.execute({ page, questionId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      answers: result.value.answers.map(AnswerWithAuthorPresenter.toHTTP),
    };
  }
}
