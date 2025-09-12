import { Injectable } from '@nestjs/common';
import { ConverterCidade } from '../dto/converter/cidade.converter';
import { CidadeRequest } from '../dto/request/cidade.request';
import { tabelaCidade } from './tabela.service';
import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CidadeServiceCreate {
  private cidades = tabelaCidade;

  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

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
