import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_CHANGE_IN_PROD', // Move to .env later
    });
  }

  async validate(payload: any) {
    // This object is injected into request object as req.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      managerId: payload.managerId,
    };
  }
}
