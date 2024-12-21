import { GetQuestionCommentsUseCase } from '@/domain/forum/app/use-cases/get-question-comments';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

const paginationSchema = z.coerce.number().default(1);
@Controller('/question/:questionId/comment')
export class GetQuestionCommentsController {
  constructor(private getQuestionComments: GetQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(paginationSchema)) page: number,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.getQuestionComments.execute({ page, questionId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
  }
}
