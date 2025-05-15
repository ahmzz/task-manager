import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from './dtos/token-payload';
import { Request } from 'express';

const extractJwtFromBearer: JwtFromRequestFunction = (
  req: Request,
): string | null => {
  if (
    req &&
    req.headers &&
    req.headers.authorization &&
    typeof req.headers.authorization === 'string' &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    return req.headers.authorization.replace('Bearer ', '');
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: extractJwtFromBearer,
      ignoreExpiration: false,
      secretOrKey: secret, // Use secretOrKey as per passport-jwt
    });
  }

  validate(payload: UserPayload): UserPayload {
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
