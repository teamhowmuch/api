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

  async createOrFind({ email }: Pick<User, 'email'>): Promise<User> {
    const found = await this.findOne({ where: { email } })
    return found || this.create({ email })
  }

  async create({ email, name }: Pick<User, 'email'> & Partial<User>): Promise<User> {
    const exists = await this.userRepository.findOne({ where: { email } })

    if (exists) {
      throw new ConflictException('User with that email exists')
    }

    const user = new User()
    user.email = email
    user.name = name

    const res = await this.userRepository.save(user)

    await this.rolesService.assign(res.id, RoleEnum.USER)

    // TODO 20220808 Ugly hack alert and security risk
    // Assign Daan and Bot roles
    if (email === 'daanaerts@gmail.com' || email === 'daan@howmuch.how') {
      await this.rolesService.assign(res.id, RoleEnum.ADMIN)
    }
    if (email === 'bot@howmuch.how') {
      await this.rolesService.assign(res.id, RoleEnum.CHATBOT)
    }

    return res
  }

  async update(
    userId: number,
    {
      name,
      onboarding_data,
      journey_data,
      is_beta_tester,
    }: Partial<Pick<User, 'onboarding_data' | 'journey_data' | 'name' | 'is_beta_tester'>>,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (name) {
      user.name = name
    }

    if (onboarding_data) {
      user.onboarding_data = { ...user.onboarding_data, ...onboarding_data }
    }

    if (journey_data) {
      user.journey_data = { ...user.journey_data, ...journey_data }
    }

    if (typeof is_beta_tester !== 'undefined') {
      user.is_beta_tester = is_beta_tester
    }

    await this.userRepository.save(user)
  }
}
