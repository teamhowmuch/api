import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRole, RoleEnum } from 'src/entities/UserRole'
import { Repository } from 'typeorm'

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(UserRole)
    private roleRepository: Repository<UserRole>,
  ) {}

  async assign(userId: number, role: RoleEnum) {
    const entity = new UserRole()
    entity.user_id = userId
    entity.role = role
    return this.roleRepository.insert(entity)
  }
}
