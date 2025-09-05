import { Injectable } from '@nestjs/common';
import { CidadeRequest } from '../dto/request/cidade.request';
import { ConverterCidade } from '../dto/converter/cidade.converter';
import { tabelaCidade } from './tabela.service';

@Injectable()
export class CidadeServiceCreate {
  private cidades = tabelaCidade;
  constructor() {}

  create(cidadeRequest: CidadeRequest) {
    const cidade = ConverterCidade.toCidade(cidadeRequest);

    const newIdCidade = this.cidades.length + 1;

    const newCidade = {
      ...cidade,
      idCidade: newIdCidade,
    };

    this.cidades.push(newCidade);

    const cidadeResponse = ConverterCidade.toCidadeResponse(newCidade);

    return cidadeResponse;
  }
}
/*
    const cidade = ConverterCidade.toCidade(cidadeRequest);
    const cidadeResponse = ConverterCidade.toCidadeResponse(cidade);
    return cidadeResponse;
*/
