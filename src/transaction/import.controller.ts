import { Controller, Get, Post } from '@nestjs/common';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private importService: ImportService) {

  }
  @Post()
  testTransaction() {
    this.importService.addToQueue();
  }
}
