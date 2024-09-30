import { Injectable } from '@nestjs/common';
import { dynamoDBClient } from 'src/config/database-config.service';
import { v4 as uuidv4 } from 'uuid';
import { UserModule } from 'src/model/user.module';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const { USERS_TABLE } = process.env;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(
    mobileNumber: string,
    language: string,
    botID: string,
  ): Promise<User> {
    const existingUser = await this.findUserByMobileNumber(mobileNumber);
    if (existingUser) {
      existingUser.language = language;
      return this.userRepository.save(existingUser);
    } else {
      const newUser = new User();
      newUser.mobileNumber = mobileNumber;
      newUser.language = language;
      newUser.botID = botID;
      return this.userRepository.save(newUser);
    }
  }

  async findUserByMobileNumber(
    mobileNumber: string,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { mobileNumber } });
  }

  async saveUser(user: User): Promise<User | undefined> {
    return this.userRepository.save(user);
  }
}
