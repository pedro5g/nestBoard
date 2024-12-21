import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '@/infra/app.module';
import request from 'supertest';
import { MockStudent } from 'test/mocks/mock-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe.skip('Upload Attachment (e2e)', () => {
  let app: INestApplication;
  let mockStudent: MockStudent;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [MockStudent],
    }).compile();

    app = moduleRef.createNestApplication();
    mockStudent = moduleRef.get(MockStudent);

    await app.init();
  });

  test.skip('[POST] /attachments', async () => {
    const { accessToken } = await mockStudent.createSession();
    const response = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpg');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });
  });
});
