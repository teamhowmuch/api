import { Injectable } from '@nestjs/common';

import { UsersService} from 'src/users/users.service';

@Injectable()
export class SensorsService {
    constructor(private usersService: UsersService) {}

    async getSensorTypes() {
        return {"sensorTypes": ["smartMeterP1","bankPSD2"]};
    }

    async getUserSensors(){
        console.log("in the get user sensors service method");
        const userId = 1;
        const user = await this.usersService.findOne({ id: userId });
        console.log(user);
        if (user) {
            console.log("returning!");
            return {"userSensors": [{123:{"type":"smartMeterP1"}},{245:{"type":"bankPSD2"}}]};
        }   
    }
}
