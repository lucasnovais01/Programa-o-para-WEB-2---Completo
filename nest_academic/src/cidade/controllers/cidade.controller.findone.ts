import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CidadeServiceFindOne } from '../service/cidade.service.findone';
import { ROTA } from 'src/commons/constants/url.sistema';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerFindOne {
  constructor(private readonly cidadeServiceFindOne: CidadeServiceFindOne) {}

  @HttpCode(HttpStatus.OK) // 200
  @Get(ROTA.CIDADE.BY_ID)
  findOne(@Param('id', ParseIntPipe) id: number) {
    const cidade = this.cidadeServiceFindOne.findOne(+id);
    return cidade;
  }
}

// http://localhost:8000/cidade/listar/1
