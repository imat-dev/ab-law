import {
  ConsoleLogger,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardLocal } from './strategy/auth.guard.local';
import { CurrentUser } from './strategy/current.user.decorator';
import { User } from 'entities/user.entity';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './strategy/auth.guard.jwt';

@Controller('auth')
export class AuthController {
  private readonly logger = new ConsoleLogger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user._id,
      token: await this.authService.generateToken(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthenticatedUser)
  async getUser(@CurrentUser() user: User) {
    return user;
  }
}
