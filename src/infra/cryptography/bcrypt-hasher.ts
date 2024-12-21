import { Hasher } from '@/domain/forum/app/cryptography/hasher';
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class BcryptHasher extends Hasher {
  private SALT = 8;

  async hash(value: string): Promise<string> {
    return await hash(value, this.SALT);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
