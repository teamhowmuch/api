import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindConditions, Repository } from 'typeorm'
import { number } from 'yup'
import { User } from '../entities/User'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  async findOne(params: FindConditions<User>): Promise<User> {
    const res = await this.userRepository.findOne(params)
    return res
  }

  async create({ email }: { email: string }): Promise<User> {
    const exists = await this.userRepository.findOne({ email })

    if (exists) {
      throw new ConflictException('User with that email exists')
    }

    const user = new User()
    user.email = email
    const res = await this.userRepository.save(user)
    return res
  }

  async update(userId: number, fields: Partial<User>): Promise<void> {
    const user = await this.findOne({ id: userId })
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`)
    }

    if (fields.car_fuel_type) {
      user.car_fuel_type = fields.car_fuel_type
    }

    this.userRepository.save(user)
  }
}
