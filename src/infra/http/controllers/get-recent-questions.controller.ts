import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/app/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

const paginationSchema = z.coerce.number().default(1);

@Controller('question')
export class GetRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestionUseCase: FetchRecentQuestionsUseCase,
  ) {}

  @Get('get-recent')
  async handle(
    @Query('page', new ZodValidationPipe(paginationSchema)) page: number,
  ) {
    const result = await this.fetchRecentQuestionUseCase.execute({ page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      questions: result.value.questions.map(QuestionPresenter.toHTTP),
    };
  }
}
