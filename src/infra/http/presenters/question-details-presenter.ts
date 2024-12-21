import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class QuestionDetailsPresenter {
  static toHTTP(data: QuestionDetails) {
    return {
      id: data.questionId.toString(),
      title: data.title,
      content: data.content,
      slug: data.slug.value,
      bestAnswerId: data.bestAnswerId?.toString(),
      author: {
        id: data.author.authorId.toString(),
        name: data.author.authorName,
      },
      attachments: data.attachments.map((attachment) => ({
        title: attachment.title,
        url: attachment.link,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
