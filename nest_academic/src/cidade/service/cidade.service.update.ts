import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CidadeRequest } from '../dto/request/cidade.request';
import { ConverterCidade } from '../dto/converter/cidade.converter';
//import { tabelaCidade } from './tabela.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
import { CidadeServiceFindOne } from './cidade.service.findone';
import { CidadeResponse } from '../dto/response/cidade.response';

@Injectable()
export class CidadeServiceUpdate {
  //private cidades = tabelaCidade;

  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
    private cidadeServiceFindOne: CidadeServiceFindOne,
  ) {}

  async update(
    id: number,
    cidadeRequest: CidadeRequest,
  ): Promise<CidadeResponse | null> {
    let cidade = ConverterCidade.toCidade(cidadeRequest);

    const cidadeCadastrada = await this.cidadeServiceFindOne.findById(idCidade);

    if (!cidadeCadastrada) {
      throw new HttpException('Cidade não cadastrada', HttpStatus.NOT_FOUND);
    }

    const cidadeAtualizada = Object.assign(cidadeCadastrada, cidade);

    cidade = await this.cidadeRepository.save(cidadeAtualizada);

    return ConverterCidade.toCidadeResponse(cidade);
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
