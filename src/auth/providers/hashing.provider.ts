import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
  abstract hash(password: string): Promise<string>;

  abstract compare(password: string, hashedPass: string): Promise<boolean>;
}
