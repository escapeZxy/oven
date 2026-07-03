import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const scryptAsync = promisify(scrypt);

/**
 * 负责口令哈希与比对。
 */
@Injectable()
export class PasswordHasherService {
  public async hash(password: string): Promise<string> {
    const salt = randomBytes(SALT_BYTES).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

    return `${salt}:${derivedKey.toString('hex')}`;
  }

  public async verify(password: string, storedHash: string): Promise<boolean> {
    const [salt, expectedHash] = this.parseStoredHash(storedHash);

    if (!salt || !expectedHash) {
      return false;
    }

    const actualHash = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

    return timingSafeEqual(actualHash, Buffer.from(expectedHash, 'hex'));
  }

  private parseStoredHash(storedHash: string): [string | undefined, string | undefined] {
    if (storedHash.includes('$')) {
      const [, salt, expectedHash] = storedHash.split('$');
      return [salt, expectedHash];
    }

    return storedHash.split(':', 2) as [string | undefined, string | undefined];
  }
}
