import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';

import { SensorsService } from './sensors.service';

@Controller('')
export class SensorsController {
    constructor(private sensorsService: SensorsService ){}

    @Get('sensors/types')
    availableTypes() {
        console.log('returning available types');
        return this.sensorsService.getSensorTypes();
    }

    @Get('sensors/all')
    getAllSensors() {
        console.log("in getting all sensors controller")
        return this.sensorsService.findAll();
    }

    // @UseGuards(JwtAuthGuard)
    @Get('users/sensors')
    userSensorList(){ 
        console.log("returning available sensors for this user");
        console.log("first find the user");
        console.log("then ask the service to look up that user and return the available sensor IDs");
        return {"userSensors": [{123:{"type":"smartMeterP1"}},{245:{"type":"bankPSD2"}}]};
    }

    // @UseGuards(JwtAuthGuard)
    @Post('users/sensors/:id')
    mockFunction(@Param('id',ParseIntPipe) id: number) {
        console.log('user sensor is being posted!');
        console.log(id);
    }


}
