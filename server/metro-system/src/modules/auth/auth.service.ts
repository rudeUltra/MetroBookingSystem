import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly entityManager: EntityManager, // Inject the manager
    private jwtService: JwtService,
  ) {}

  async validateUser(googleUser: any) {
    let user = await this.entityManager.findOne(User, { where: { email: googleUser.email } });

    if (!user) {
      user = this.entityManager.create(User, { email: googleUser.email });
      await this.entityManager.save(user);
    }

    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
