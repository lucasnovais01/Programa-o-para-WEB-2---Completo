import { Module } from '@nestjs/common';
import { ResourcesController } from './controllers/resources.controller';
import { ResourcesService } from './service/resources.service';

@Module({
  imports: [],
  controllers: [ResourcesController],
  providers: [ResourcesService],
})
export class ResourceModule {}
