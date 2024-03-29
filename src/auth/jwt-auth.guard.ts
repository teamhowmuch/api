import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request as ExpressRequest } from 'express'
import { RoleEnum } from 'src/entities/UserRole'

export interface UserPayload {
  id: number
  email: string
  roles: RoleEnum[]
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload
}
