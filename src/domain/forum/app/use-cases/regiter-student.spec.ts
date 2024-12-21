import { InMemoryStudentRepository } from 'test/repository/in-memory-student-repository';
import { RegisterStudentUseCase } from './register-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { StudentAlreadyExistsError } from './__errors/student-already-exists-error';
import { Student } from '../../enterprise/entities/student';

let inMemoryStudentRepository: InMemoryStudentRepository;
let hasherStub: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository();
    hasherStub = new FakeHasher();
    sut = new RegisterStudentUseCase(inMemoryStudentRepository, hasherStub);
  });

  it('should be able to register a new student', async () => {
    const data = {
      name: 'jhon Doe',
      email: 'test@email.com',
      password: '1234556',
    };

    const result = await sut.execute(data);

    expect(result.isRight()).toBe(true);
    //@ts-ignore
    expect(result.value.student).toBeInstanceOf(Student);
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    });
    expect(inMemoryStudentRepository.items).toHaveLength(1);
  });

  it('should not be able to register a student with same email that already used to another student', async () => {
    const data: { name: string; email: string; password: string }[] = [
      { name: 'jhon Doe', email: 'test@email.com', password: '1234556' },
      { name: 'Stive Doe', email: 'test@email.com', password: '1234556' },
    ];

    await sut.execute(data[0]);
    const result = await sut.execute(data[1]);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(StudentAlreadyExistsError);
    expect(inMemoryStudentRepository.items).toHaveLength(1);
  });

  test('password must be salve encrypting', async () => {
    const spyHash = vitest.spyOn(hasherStub, 'hash');
    const data = {
      name: 'jhon Doe',
      email: 'test@email.com',
      password: '1234556',
    };

    const result = await sut.execute(data);

    expect(spyHash).toBeCalledTimes(1);
    //@ts-ignore
    expect(result.value.student.password).toBe(data.password.concat('-hashed'));
  });
});
