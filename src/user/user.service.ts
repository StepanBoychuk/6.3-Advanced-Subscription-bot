import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as mongoose from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: mongoose.Model<User>) {}

  async findOne(userId: number): Promise<User> {
    return await this.userModel.findOne({ userId: userId });
  }

  async create(userData: CreateUserDto) {
    await this.userModel.create(userData);
  }

  async update(userId: number, updateData: UpdateUserDto) {
    await this.userModel.findOneAndUpdate({ userId: userId }, updateData);
  }

  async subscription(userId: number) {
    const user = await this.userModel.findOne({ userId: userId });
    user.isSubscribed = !user.isSubscribed;
    await user.save();
  }
}
