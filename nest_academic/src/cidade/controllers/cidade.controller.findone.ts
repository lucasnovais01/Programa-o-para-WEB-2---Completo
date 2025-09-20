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
import { CidadeResponse } from '../dto/response/cidade.response';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerFindOne {
  constructor(private readonly cidadeServiceFindOne: CidadeServiceFindOne) {}

  @HttpCode(HttpStatus.OK) // 200
  @Get(ROTA.CIDADE.BY_ID)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CidadeResponse | null> {
    const response = await this.cidadeServiceFindOne.findById(+id);

    return response;
  }
}
/*

findOne(@Param('id', ParseIntPipe) id: number) {
  const cidade = this.cidadeServiceFindOne.findOne(+id);
  return cidade;
}

*/

// http://localhost:8000/cidade/listar/1
