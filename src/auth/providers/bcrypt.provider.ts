import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

export class BcryptProvider extends HashingProvider {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hashedPass: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPass);
  }
}
