import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthenticationController } from './controllers/authentication.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { GetRecentQuestionsController } from './controllers/get-recent-questions.controller';
import { DatabaseModule } from '../database/database.module';
import { CreateQuestionUseCase } from '@/domain/forum/app/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/app/use-cases/fetch-recent-questions';
import { RegisterStudentUseCase } from '@/domain/forum/app/use-cases/register-student';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateUseCase } from '@/domain/forum/app/use-cases/authenticate';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { DeleteQuestionUseCase } from '@/domain/forum/app/use-cases/delete-question';
import { UpdateQuestionUseCase } from '@/domain/forum/app/use-cases/update-question';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { UpdateAnswerUseCase } from '@/domain/forum/app/use-cases/update-answer';
import { AnswerQuestionUseCase } from '@/domain/forum/app/use-cases/answer-question';
import { DeleteAnswerUseCase } from '@/domain/forum/app/use-cases/delete-answer';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/app/use-cases/fetch-question-answers';
import { GetRecentAnswersOnQuestionController } from './controllers/get-recent-answers-on-question.controller';
import { CommentOnAnswerUseCase } from '@/domain/forum/app/use-cases/comment-on-answer';
import { CommentOnQuestionUseCase } from '@/domain/forum/app/use-cases/comment-on-question';
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller';
import { CommentOnQuestionController } from './controllers/comment-on-question.controller';
import { RemoveQuestionCommentController } from './controllers/remove-question-comment.controller';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/app/use-cases/delete-question-comment';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/app/use-cases/delete-answer-comment';
import { RemoveAnswerCommentController } from './controllers/remove-comment-on-answer.controller';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/app/use-cases/choose-question-best-answer';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';
import { StorageModule } from '../storage/storage.module';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/app/use-cases/upload-end-create-attachment';
import { GetQuestionCommentsController } from './controllers/get-question-comments.controller';
import { GetQuestionCommentsUseCase } from '@/domain/forum/app/use-cases/get-question-comments';
import { GetAnswerCommentsUseCase } from '@/domain/forum/app/use-cases/get-answer-comments';
import { GetAnswerCommentsController } from './controllers/get-answer-comments.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { GetQuestionBySlugUseCase } from '@/domain/forum/app/use-cases/get-question-by-slug';
import { ReadNotificationController } from './controllers/read-notification.controller';
import { ReadNotificationUseCase } from '@/domain/notification/app/use-cases/read-notification-use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    UploadAttachmentController,
    ChooseQuestionBestAnswerController,
    RemoveAnswerCommentController,
    RemoveQuestionCommentController,
    CommentOnQuestionController,
    CommentOnAnswerController,
    EditQuestionController,
    DeleteQuestionController,
    CreateAccountController,
    AuthenticationController,
    CreateQuestionController,
    GetRecentQuestionsController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    GetRecentAnswersOnQuestionController,
    GetQuestionBySlugController,
    GetQuestionCommentsController,
    GetAnswerCommentsController,
    ReadNotificationController,
  ],
  providers: [
    GetQuestionBySlugUseCase,
    GetAnswerCommentsUseCase,
    GetQuestionCommentsUseCase,
    ChooseQuestionBestAnswerUseCase,
    DeleteAnswerCommentUseCase,
    DeleteQuestionCommentUseCase,
    CommentOnAnswerUseCase,
    CommentOnQuestionUseCase,
    DeleteAnswerUseCase,
    AnswerQuestionUseCase,
    UpdateAnswerUseCase,
    UpdateQuestionUseCase,
    DeleteQuestionUseCase,
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateUseCase,
    FetchQuestionAnswersUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
