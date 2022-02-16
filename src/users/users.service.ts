import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { User } from '../entity/User';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(params: FindConditions<User>): Promise<User> {
    const res = await this.userRepository.findOne(params);
    return res;
  }

  async create({ email }: { email: string }): Promise<User> {
    const exists = await this.userRepository.findOne({ email });

    if (exists) {
      throw new ConflictException('User with that email exists');
    }

    const user = new User();
    user.email = email;
    const res = await this.userRepository.save(user);
    return res;
  }
}
