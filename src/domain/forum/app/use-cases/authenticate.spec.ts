import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';
import { RegisterStudentUseCase } from './register-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './__errors/invalid-credentials-error';

let inMemoryStudentRepository: InMemoryStudentRepository;
let hasherStub: FakeHasher;
let encrypterStub: FakeEncrypter;
let registerStudent: RegisterStudentUseCase;
let sut: AuthenticateUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    hasherStub = new FakeHasher();
    encrypterStub = new FakeEncrypter();
    sut = new AuthenticateUseCase(
      inMemoryStudentRepository,
      hasherStub,
      encrypterStub,
    );
    registerStudent = new RegisterStudentUseCase(
      inMemoryStudentRepository,
      hasherStub,
    );
  });

  it('should be able authentication a user with correctly credential', async () => {
    const data = {
      name: 'jhon Doe',
      email: 'test@email.com',
      password: '1234556',
    };

    await registerStudent.execute(data);

    const result = await sut.execute({
      email: data.email,
      password: data.password,
    });

    expect(result.isRight()).toBe(true);
    //@ts-ignore
    expect(result.value.accessToken).toBeTruthy();
    //@ts-ignore
    expect(JSON.parse(result.value.accessToken)).toStrictEqual({
      sub: expect.any(String),
    });
  });

  it('should not able to authentication a user with invalid email', async () => {
    const data = {
      name: 'jhon Doe',
      email: 'test@email.com',
      password: '1234556',
    };

    const result = await sut.execute({
      email: data.email,
      password: data.password,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not able to authentication a user with invalid password', async () => {
    const data = {
      name: 'jhon Doe',
      email: 'test@email.com',
      password: '1234556',
    };

    const result = await sut.execute({
      email: data.email,
      password: 'invalidPassword',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
