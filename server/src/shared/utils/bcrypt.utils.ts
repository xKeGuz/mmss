import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptUtils {
  public matches(incomingPassword: string, hashedPassword: string): boolean {
    try {
      const matches = bcrypt.compareSync(incomingPassword, hashedPassword);
      return matches;
    } catch (error) {
      console.log('🚀 ~ BcryptUtils ~ matches ~ error:', error);
      return false;
    }
  }

  public encode(incomingPassword: string): string {
    const salt = bcrypt.genSaltSync(8);
    return bcrypt.hashSync(incomingPassword, salt);
  }
}
