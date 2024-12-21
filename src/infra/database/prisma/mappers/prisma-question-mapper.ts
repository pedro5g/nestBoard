import { Slug } from '@/core/domain/value-objects/slug';
import { UniqueEntityId } from '@/core/domain/value-objects/unique-entity-id';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Question as PrismaQuestion, Prisma } from '@prisma/client';

type PrismaQuestionDetails = {
  id: string;
  title: string;
  content: string;
  slug: string;
  bestAnswerId: string | null;
  author: {
    id: string;
    name: string;
  };
  attachments: {
    title: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date | null;
};

export class PrismaQuestionMapper {
  static toDomainFormat(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        slug: Slug.create(raw.slug),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityId(raw.bestAnswerId)
          : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaFormat(raw: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      title: raw.title,
      content: raw.content,
      slug: raw.slug.value,
      bestAnswerId: raw.bestAnswerId?.toString(),
      authorId: raw.authorId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  static toQuestionDetailsFormat(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      title: raw.title,
      content: raw.content,
      slug: Slug.create(raw.slug),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      author: {
        authorId: new UniqueEntityId(raw.author.id),
        authorName: raw.author.name,
      },
      attachments: raw.attachments.map((attachment) =>
        Attachment.create({ title: attachment.title, link: attachment.url }),
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
