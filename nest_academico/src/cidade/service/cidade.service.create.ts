import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeRequest } from '../dto/request/cidade.request';
import { ConverterCidade } from '../dto/converter/cidade.converter';

@Injectable()
export class CidadeServiceCreate {
  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

  async create(cidadeRequest: CidadeRequest): Promise<CidadeResponse> {
    let cidade = ConverterCidade.toCidade(cidadeRequest);

    const cidadeCadastrada = await this.cidadeRepository
      .createQueryBuilder('cidade')
      .where('cidade.nomeCidade =:nome', { nome: cidade.nomeCidade })
      .getOne();

    if (cidadeCadastrada) {
      throw new HttpException(
        'Cidade com nome informada já está cadastrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    cidade = await this.cidadeRepository.save(cidade);

    return ConverterCidade.toCidadeResponse(cidade);
  }
}
