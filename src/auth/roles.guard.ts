import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLES_KEY } from 'src/auth/roles.decorator'
import { RoleEnum as Role } from 'src/entities/UserRole'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('called')
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true
    }
    const req = context.switchToHttp().getRequest()
    const { user } = req

    if (!user) {
      // weird stuff. Awaiting jwt auth guard to complete. Will be called again
      return true
    }

    return requiredRoles.every((role) => user.roles.includes(role))
  }
}
