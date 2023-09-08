import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/auth/entities/user.entity';
import { Model } from 'mongoose';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string) {
    const user = await this.userModel.findOne({
      email: email,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await this.authService.comparePassword(
      password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
