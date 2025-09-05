import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CidadeServiceFindAll } from '../service/cidade.service.findall';
import { ROTA } from 'src/commons/constants/url.sistema';

@Controller(ROTA.CIDADE.BASE)
//PascalCamel
export class CidadeControllerFindAll {
  constructor(private readonly cidadeServiceFindAll: CidadeServiceFindAll) {}

  @HttpCode(HttpStatus.OK) // 200
  @Get(ROTA.CIDADE.LIST)
  findAll() {
    return 'Listar todas as cidades do banco de dados';
  }
}

// http://localhost:8000/cidade/listar
