import { Injectable } from '@nestjs/common';
import { Resources } from './resources';

@Injectable()
export class ResourcesService {
  findAll() {
    return Resources;
  }
}
