import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'entities/user.entity';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async createUser(user: CreateUserDto): Promise<User> {
    return await this.userModel.create(user);
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  public async findById(id: string) : Promise<User> {
    return await this.userModel.findById(id)
  }
}
