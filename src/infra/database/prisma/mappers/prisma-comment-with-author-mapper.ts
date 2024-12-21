import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

interface PrismaCommentReturn {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  author: {
    id: string;
    name: string;
  };
}

export class PrismaCommentWithAuthorMapper {
  static toDomainFormat(raw: PrismaCommentReturn): CommentWithAuthor {
    if (!raw.id) throw new Error('something very wrong happened');
    return CommentWithAuthor.create({
      commentId: new UniqueEntityId(raw.id),
      content: raw.content,
      author: {
        authorId: new UniqueEntityId(raw.author.id),
        authorName: raw.author.name,
      },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
