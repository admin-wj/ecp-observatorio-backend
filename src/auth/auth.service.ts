import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  validatePasswordAndIssueToken(password: string): { access_token: string } {
    const expectedPassword = this.configService.get<string>('internalSecret');

    if (!expectedPassword || password !== expectedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const jwtSecret = this.configService.get<string>('jwt.secret');
    if (!jwtSecret) {
      throw new Error('JWT secret is not configured');
    }

    const expiresIn =
      this.configService.get<StringValue>('jwt.expiration') || '1h';

    const token = jwt.sign({ data: '' }, jwtSecret, {
      expiresIn,
    });

    return { access_token: token };
  }
}
