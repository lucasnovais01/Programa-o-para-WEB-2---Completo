import { Injectable } from '@nestjs/common';
import { CidadeRequest } from '../dto/request/cidade.request';
import { ConverterCidade } from '../dto/converter/cidade.converter';
import { tabelaCidade } from './tabela.service';

@Injectable()
export class CidadeServiceUpdate {
  private cidades = tabelaCidade;
  constructor() {}

  update(id: number, cidadeRequest: CidadeRequest) {
    const cidade = ConverterCidade.toCidade(cidadeRequest);

    const cidadeIndex = this.cidades.findIndex((c) => c.idCidade === id);

    const cidadeCadastrada = this.cidades[cidadeIndex];

    this.cidades[cidadeIndex] = {
      ...cidadeCadastrada,
      ...cidade,
    };

    const cidadeResponse = ConverterCidade.toCidadeResponse(
      this.cidades[cidadeIndex],
    );

    return cidadeResponse;
  }
}
