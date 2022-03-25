import { Injectable } from '@nestjs/common';

import { UsersService} from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { User } from '../entity/User';
import { Sensor } from '../entity/Sensor';
import { SensorData } from '../entity/SensorData';

@Injectable()
export class SensorsService {
    constructor(
        @InjectRepository(Sensor)
        private sensorsRepository: Repository<Sensor>,
        @InjectRepository(SensorData)
        private sensorDataRepository: Repository<SensorData>,
        private usersService: UsersService
    ) {}

    findAll(): Promise<Sensor[]> {
        return this.sensorsRepository.find();
    }

    async getSensorTypes() {
        const tst = await this.usersService.findSensorsForUser();
        console.log(tst);
        console.log(tst.sensors[0]);

        const userId = 1;
        const exUser = await this.usersService.findOne({ id: userId });
        
        //const user = new User();
        //user.email = "Leo";
        //await this.sensorsRepository.save(user);
        
        /*
        
        const user = await this.usersService.findAll();
        
        const sensor1 = new Sensor();
        sensor1.sensorname = "sensor1";
        sensor1.sensortype = "P1";
        sensor1.enabled = true;
        sensor1.created_at = new Date();
        sensor1.updated_at = new Date();
        sensor1.user = exUser;
        await this.sensorsRepository.save(sensor1);
        /*
        const sensor2 = new Sensor();
        sensor2.sensorname = "me-and-bears.jpg";
        //sensor2.user = user;
        await this.sensorsRepository.save(sensor2);
        */
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

    async postNewSensorData(){
        const sensorId = 14;
        const sensor = await this.sensorsRepository.findOne({ id: sensorId });

        const data = new SensorData();
        data.sensor = sensor;
        data.amount = 1045;
        data.metric = "m3";
        data.source = "Gas";
        data.interval = false;
        data.from = new Date();
        data.to = new Date();
        await this.sensorDataRepository.save(data);
        return "data posted succesfully";
    }
}
