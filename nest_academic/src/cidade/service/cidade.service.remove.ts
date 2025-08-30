import { Injectable } from "@nestjs/common";
//import { CidadeRequest } from '../dto/request/cidade.request';
//import { ConverterCidade } from '../dto/converter/cidade.converter';
import { tabelaCidade } from "./tabela.service";

@Injectable()
export class CidadeServiceRemove {
  private cidade = tabelaCidade;
  constructor() {}

  remove(id: number) {
    const cidadeIndex = this.cidade.findIndex((c) => c.idCidade === id);

    this.cidade.splice(cidadeIndex, 1);

    return this.cidade;
  }
}

/*
  constructor() {}

  remove(id: string, cidadeRequest: CidadeRequest) {
    const cidade = ConverterCidade.toCidade(cidadeRequest);
    const cidadeResponse = ConverterCidade.toCidadeResponse(cidade);
    return cidadeResponse;
  }
*/
