import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async generateToken(user: User): Promise<string> {
    const token = this.jwtService.sign({
      email: user.email,
      roles: user.roles,
      sub: user._id,
    });

    return token;
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
