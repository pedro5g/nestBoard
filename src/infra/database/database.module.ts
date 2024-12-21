import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/database.service';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository';
import { PrismaAnswerRepository } from './prisma/repositories/prisma-answers-repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository';
import { QuestionsRepository } from '@/domain/forum/app/repositories/questions-repository';
import { StudentRepository } from '@/domain/forum/app/repositories/student-repository';
import { PrismaStudentRepository } from './prisma/repositories/prisma-student-repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/app/repositories/question-attachments-repository';
import { AnswersRepository } from '@/domain/forum/app/repositories/answer-repository';
import { QuestionCommentsRepository } from '@/domain/forum/app/repositories/question-comments-repository';
import { AnswerCommentsRepository } from '@/domain/forum/app/repositories/answer-comments-repository';
import { AnswerAttachmentsRepository } from '@/domain/forum/app/repositories/answer-attachment-repository';
import { AttachmentRepository } from '@/domain/forum/app/repositories/attachment-repository';
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository';
import { NotificationsRepository } from '@/domain/notification/app/repositories/notification-repository';
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: StudentRepository,
      useClass: PrismaStudentRepository,
    },
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswerRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationRepository,
    },
    PrismaStudentRepository,
    PrismaStudentRepository,
    PrismaQuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAttachmentRepository,
    PrismaNotificationRepository,
  ],
  exports: [
    PrismaService,
    AttachmentRepository,
    QuestionsRepository,
    StudentRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
