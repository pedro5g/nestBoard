import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateAccountController } from './controllers/create-account.controller';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthenticationController } from './controllers/authentication.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { GetRecentQuestionsController } from './controllers/get-recent-questions.controller';
import { DatabaseModule } from './prisma/database.module';
import { CryptService } from './cryptography/crypt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        return envSchema.parse(env);
      },
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticationController,
    CreateQuestionController,
    GetRecentQuestionsController,
  ],
  providers: [CryptService],
})
export class AppModule {}
