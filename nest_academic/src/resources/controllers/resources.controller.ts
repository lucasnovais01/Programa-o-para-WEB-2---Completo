import { Controller, Get } from '@nestjs/common';
import { ResourcesService } from '../service/resources.service';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourceService: ResourcesService) {}

  @Get()
  findAll() {
    return this.resourceService.findAll();
  }
}
