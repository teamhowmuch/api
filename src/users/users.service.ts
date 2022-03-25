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

  async findSensorsForUser(): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: [
        'sensors', //waarom deze notatie ipv {} zoals in NestJS / TypeORM docs?!
      ],
      where: {'id':2}
    });
    return user;
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
