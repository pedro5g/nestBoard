import { Encrypter } from '@/domain/forum/app/cryptography/encrypter';
import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypter';
import { Hasher } from '@/domain/forum/app/cryptography/hasher';
import { BcryptHasher } from './bcrypt-hasher';

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    { provide: Hasher, useClass: BcryptHasher },
    BcryptHasher,
    JwtEncrypter,
  ],
  exports: [Encrypter, Hasher],
})
export class CryptographyModule {}
