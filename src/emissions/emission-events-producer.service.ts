import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class EmissionEventsProducerService {
    constructor(@InjectQueue('emissionEvents') private emissionEventsQueue: Queue){
        
    }
}
