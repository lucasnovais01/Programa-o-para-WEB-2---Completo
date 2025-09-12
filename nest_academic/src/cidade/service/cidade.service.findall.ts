import { Injectable } from '@nestjs/common';
// import { CidadeRequest } from '../dto/request/cidade.request';
// import { ConverterCidade } from '../dto/converter/cidade.converter';
import { tabelaCidade } from './tabela.service';
import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CidadeServiceFindAll {
  private cidades = tabelaCidade;
  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

  findAll(/*id: string, cidadeRequest: CidadeRequest*/) {
    return this.cidades;
  }
}

/*
const cidade = ConverterCidade.toCidade(cidadeRequest);
const cidadeResponse = ConverterCidade.toCidadeResponse(cidade);
return cidadeResponse;
*/
