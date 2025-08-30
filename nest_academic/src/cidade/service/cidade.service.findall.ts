import { Injectable } from "@nestjs/common";
// import { CidadeRequest } from '../dto/request/cidade.request';
// import { ConverterCidade } from '../dto/converter/cidade.converter';
import { tabelaCidade } from "./tabela.service";

@Injectable()
export class CidadeServiceFindAll {
  private cidades = tabelaCidade;
  constructor() {}

  findAll(/*id: string, cidadeRequest: CidadeRequest*/) {
    return this.cidades;
  }
}

/*
const cidade = ConverterCidade.toCidade(cidadeRequest);
const cidadeResponse = ConverterCidade.toCidadeResponse(cidade);
return cidadeResponse;
*/
