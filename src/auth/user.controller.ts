import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedUser } from './strategy/auth.guard.jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/guards/roles.decorator';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() inputs: CreateUserDto) {
    
    const existingUser = await this.userService.findByEmail(inputs.email);

    if (existingUser) {
      throw new BadRequestException('Email already taken.');
    }

    const enteredUser = {
      ...inputs,
      password: await this.authService.hashPassword(inputs.password),
    };

    const user = await this.userService.createUser(enteredUser);

    return {
      userId: user._id,
      token: await this.authService.generateToken(user),
    };
  }

  @UseGuards(AuthenticatedUser)
  @Roles(['admin'])
  @UseGuards(RolesGuard)
  @Get(':userId')
  async getProfile(@Param('userId') userID: string) {
    const user = await this.userService.findById(userID);
    if (!user) {
      throw new BadRequestException();
    }
  }

  
}
