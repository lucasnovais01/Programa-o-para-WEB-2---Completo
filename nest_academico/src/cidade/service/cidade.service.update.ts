import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConverterCidade } from '../dto/converter/cidade.converter';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';
import { CidadeServiceFindOne } from './cidade.service.findone';

@Injectable()
export class CidadeServiceUpdate {
  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
    private cidadeServiceFindOne: CidadeServiceFindOne,
  ) {}

  async update(
    idCidade: number,
    cidadeRequest: CidadeRequest,
  ): Promise<CidadeResponse> {
    let cidade = ConverterCidade.toCidade(cidadeRequest);

    const cidadeCadastrada = await this.cidadeServiceFindOne.findById(idCidade);

    if (!cidadeCadastrada) {
      throw new HttpException('Cidade não cadastrada', HttpStatus.NOT_FOUND);
    }

    const cidadeAtualizada = Object.assign(cidadeCadastrada, cidade);

    cidade = await this.cidadeRepository.save(cidadeAtualizada);

    return ConverterCidade.toCidadeResponse(cidade);
  }
}
