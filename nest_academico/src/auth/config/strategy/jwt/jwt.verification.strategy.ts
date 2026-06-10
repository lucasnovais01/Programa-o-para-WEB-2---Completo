import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtVerificationTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-verification',
) {
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>(
        'JWT_VERIFICATION_TOKEN_SECRET',
      ),
    });
    this.configService = configService;
  }

  async validate(payload: any) {
    return await payload;
  }
}
