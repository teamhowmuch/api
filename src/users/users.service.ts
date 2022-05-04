import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEnum } from 'src/entities/UserRole'
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { User } from '../entities/User'
import { RolesService } from './roles.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  find(options: FindManyOptions): Promise<User[]> {
    return this.userRepository.find(options)
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    const res = await this.userRepository.findOne(options)
    return res
  }

  async create({ email }: Pick<User, 'email'>): Promise<User> {
    const exists = await this.userRepository.findOne({ email })
    if (exists) {
      throw new ConflictException('User with that email exists')
    }

    const user = new User()
    user.email = email
    const res = await this.userRepository.save(user)
    console.log('created', res)
    const re2s = await this.rolesService.assign(res.id, RoleEnum.USER)

    console.log('heir ook done?', re2s)
    return res
  }

  async update(
    userId: number,
    { name, onboarding_data }: Partial<Pick<User, 'onboarding_data' | 'name'>>,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (name) {
      user.name = name
    }

    if (onboarding_data) {
      user.onboarding_data = onboarding_data
    }

    await this.userRepository.save(user)
  }
}
