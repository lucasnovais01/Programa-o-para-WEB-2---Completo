import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  //Param,
  //ParseIntPipe,
  Put,
} from '@nestjs/common';
//import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeServiceUpdate } from '../service/cidade.service.update';
import { ROTA } from 'src/commons/constants/url.sistema';

@Controller(ROTA.CIDADE.BASE)
export class CidadeControllerUpdate {
  constructor(private readonly cidadeServiceUpdate: CidadeServiceUpdate) {}

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.CIDADE.UPDATE)
  // o método PUT envia o objeto a ser persistido, a ser modificado
  update() {
    return null;
  }
  /*

  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() cidadeRequest: CidadeRequest,
  ) {
    // console.log("recebendo o id " + id);
    const response = this.cidadeServiceUpdate.update(id, cidadeRequest);
    return response;
  }
  
  */
}
