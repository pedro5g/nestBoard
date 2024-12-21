import { Hasher } from '@/domain/forum/app/cryptography/hasher';

export class FakeHasher implements Hasher {
  async hash(value: string): Promise<string> {
    return value.concat('-hashed');
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return password.concat('-hashed') === hash;
  }
}
