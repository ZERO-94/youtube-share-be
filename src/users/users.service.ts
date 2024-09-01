import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({
      email,
    });
  }

  async findForLogin(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userModel
      .findOne({
        email,
      })
      .exec();

    if (!user) {
      return undefined;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return user.toObject();
    }
  }

  async create({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = new this.userModel({
      email,
      password,
    });
    return user.save();
  }
}
