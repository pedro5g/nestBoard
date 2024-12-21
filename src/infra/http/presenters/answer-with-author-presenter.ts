import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';

export class AnswerWithAuthorPresenter {
  static toHTTP(answer: AnswerWithAuthor) {
    return {
      id: answer.answerId.toString(),
      content: answer.content,
      author: {
        id: answer.author.authorId.toString(),
        name: answer.author.authorName,
      },
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    };
  }
}
