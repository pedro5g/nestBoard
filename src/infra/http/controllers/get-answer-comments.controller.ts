import { GetAnswerCommentsUseCase } from '@/domain/forum/app/use-cases/get-answer-comments';
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
@Controller('/answer/:answerId/comment')
export class GetAnswerCommentsController {
  constructor(private getAnswerComments: GetAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', new ZodValidationPipe(paginationSchema)) page: number,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.getAnswerComments.execute({ page, answerId });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) };
  }
}
