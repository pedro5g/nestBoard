import { PaginationParams } from '@/core/domain/repository/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comments';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper';
import { PrismaService } from '../database.service';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(comment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrismaFormat(comment);

    await this.prisma.comment.create({ data });
  }
  async update(comment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrismaFormat(comment);
    await this.prisma.comment.update({
      where: { id: data.id },
      data,
    });
  }
  async delete(comment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    });
  }
  async findById(commentId: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) return null;

    return PrismaAnswerCommentMapper.toDomainFormat(comment);
  }
  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map(PrismaAnswerCommentMapper.toDomainFormat);
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
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
