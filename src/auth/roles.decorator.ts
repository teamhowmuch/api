import { SetMetadata } from '@nestjs/common'
import { RoleEnum as Role } from '../entities/UserRole'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
