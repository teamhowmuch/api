import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request as ExpressRequest } from 'express'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export interface AuthenticatedRequest extends ExpressRequest {
  user: { id: number; email: string }
}
