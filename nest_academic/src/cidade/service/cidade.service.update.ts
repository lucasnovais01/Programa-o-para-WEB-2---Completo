import { Injectable } from '@nestjs/common';
import { CidadeRequest } from '../dto/request/cidade.request';
import { ConverterCidade } from '../dto/converter/cidade.converter';
//import { tabelaCidade } from './tabela.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
import { CidadeServiceFindOne } from './cidade.service.findone';

@Injectable()
export class CidadeServiceUpdate {
  //private cidades = tabelaCidade;

  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
    private cidadeServiceFindOne: CidadeServiceFindOne,
  ) {}

  update(id: number, cidadeRequest: CidadeRequest) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cidade = ConverterCidade.toCidade(cidadeRequest);
    const cidadeCadastrada = this.cidadeServiceFindOne;

    if (cidadeCadastrada) {
      throw new Error('Cidade não cadastrada');
    }

    return null;
  }

  /*
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
  */
}
