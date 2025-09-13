import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CidadeServiceFindAll } from '../service/cidade.service.findall';
import { ROTA } from 'src/commons/constants/url.sistema';
import { CidadeResponse } from '../dto/response/cidade.response';

@Controller(ROTA.CIDADE.BASE)
//PascalCamel
export class CidadeControllerFindAll {
  constructor(private readonly cidadeServiceFindAll: CidadeServiceFindAll) {}

  @HttpCode(HttpStatus.OK) // 200
  @Get(ROTA.CIDADE.LIST)
  async findAll(): Promise<CidadeResponse[]> {
    const response = await this.cidadeServiceFindAll.findAll();
    return response;
  }
}

// http://localhost:8000/cidade/listar
