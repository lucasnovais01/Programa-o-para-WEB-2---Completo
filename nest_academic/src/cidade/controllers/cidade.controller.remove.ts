import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { CidadeServiceRemove } from "../service/cidade.service.remove";

@Controller("/cidade")
export class CidadeControllerRemove {
  constructor(private readonly cidadeServiceRemove: CidadeServiceRemove) {}

  @HttpCode(HttpStatus.OK) //O correto é o NO_CONTENT, a exclusão sempre retorna NO_CONTENT
  @Delete("/remover/:id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.cidadeServiceRemove.remove(id);
  }
}
/*
    const response = this.cidadeServiceRemove.remove(id, cidadeRequest);
    return response;
*/
