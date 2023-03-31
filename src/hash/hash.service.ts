import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
  private readonly algorithm: string;
  private readonly saltLength: number;

  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.saltLength = 16;
  }

  public generateHash(password: string): string {
    const salt = crypto.randomBytes(this.saltLength).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');

    return salt + '$' + hash;
  }

  public verifyHash(password: string, hash: string): boolean {
    const [salt, originalHash] = hash.split('$');
    const newHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');

    return originalHash === newHash;
  }
}
