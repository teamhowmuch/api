import { Module } from '@nestjs/common';
import { DetermineEmissionsServiceService } from './determine-emissions-service.service';

@Module({
  providers: [DetermineEmissionsServiceService]
})
export class EmissionsModule {}
