import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.cookies?.access_token, // Look inside cookie
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback_secret_for_dev_only',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}