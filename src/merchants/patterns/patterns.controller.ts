import { Body, Controller, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common'
import { IsString } from 'class-validator'
import { AuthenticatedRequest, JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { RoleEnum } from 'src/entities/UserRole'
import { verifyAccess } from 'src/auth/verifyAccess'
import { PatternsService } from './patterns.service'

class CreatePatternDto {
  @IsString()
  pattern: string
}

@Controller('merchants/:merchantId/patterns')
export class PatternsController {
  constructor(private patternsService: PatternsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() { user }: AuthenticatedRequest,
    @Body() { pattern }: CreatePatternDto,
    @Param('merchantId', ParseIntPipe) merchantId: number,
  ) {
    verifyAccess(user, -1, [RoleEnum.ADMIN])
    this.patternsService.create(merchantId, pattern)
  }
}
