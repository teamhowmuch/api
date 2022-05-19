import { ForbiddenException } from '@nestjs/common'
import { RoleEnum } from 'src/entities/UserRole'
import { UserPayload } from './jwt-auth.guard'

export function verifyAccess(
  user: UserPayload,
  requestUserId: number,
  requiredRoles: RoleEnum[] = [RoleEnum.ADMIN],
) {
  if (requiredRoles.every((role) => user.roles.includes(role))) {
    return true
  } else if (user.id === requestUserId) {
    return true
  } else {
    throw new ForbiddenException()
  }
}
