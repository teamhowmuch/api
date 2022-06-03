import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEnum } from '../entities/UserRole'
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

    await this.rolesService.assign(res.id, RoleEnum.USER)

    return res
  }

  async update(
    userId: number,
    {
      name,
      onboarding_data,
      is_beta_tester,
    }: Partial<Pick<User, 'onboarding_data' | 'name' | 'is_beta_tester'>>,
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

    if (typeof is_beta_tester !== 'undefined') {
      user.is_beta_tester = is_beta_tester
    }

    await this.userRepository.save(user)
  }
}
