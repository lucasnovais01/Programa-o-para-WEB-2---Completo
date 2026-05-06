import { Controller, Get } from '@nestjs/common';
import { ResourcesService } from '../service/resources.service';

@Controller('/rest')
export class ResourcesController {
  constructor(private readonly resourceService: ResourcesService) {}

  @Get('/resources')
  findAll() {
    return this.resourceService.findAll();
  }
}
