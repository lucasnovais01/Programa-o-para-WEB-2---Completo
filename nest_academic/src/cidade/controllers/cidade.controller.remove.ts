import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CidadeServiceRemove } from '../service/cidade.service.remove';
import { ROTA } from 'src/commons/constants/url.sistema';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerRemove {
  constructor(private readonly cidadeServiceRemove: CidadeServiceRemove) {}

  @HttpCode(HttpStatus.OK) //O correto é o NO_CONTENT, a exclusão sempre retorna NO_CONTENT
  @Delete(ROTA.CIDADE.DELETE)
  remove(@Param('id', ParseIntPipe) id: number) : Promise<CidadeResponse | null> {
    
    return this.cidadeServiceRemove.remove(id);
  }
  /*

  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cidadeServiceRemove.remove(id);
  }

  */
}
/*
    const response = this.cidadeServiceRemove.remove(id, cidadeRequest);
    return response;
*/
