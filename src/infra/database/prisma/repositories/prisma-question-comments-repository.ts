import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/app/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper';
import { PrismaService } from '../database.service';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper';

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(comment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrismaFormat(comment);

    await this.prisma.comment.create({ data });
  }
  async update(comment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrismaFormat(comment);
    await this.prisma.comment.update({
      where: { id: data.id },
      data,
    });
  }
  async delete(comment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }
  async findById(commentId: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) return null;

    return PrismaQuestionCommentMapper.toDomainFormat(comment);
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<QuestionComment[]> {
    // TO DO - convert to cursor pagination

    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map(PrismaQuestionCommentMapper.toDomainFormat);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map(PrismaCommentWithAuthorMapper.toDomainFormat);
  }
}
