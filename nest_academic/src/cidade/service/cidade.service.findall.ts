import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConverterCidade } from '../dto/converter/cidade.converter';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';

@Injectable()
export class CidadeServiceFindAll {
  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

  async findAll(): Promise<CidadeResponse[]> {
    const cidades = await this.cidadeRepository
      .createQueryBuilder('cidade')
      .getMany();

    return ConverterCidade.toListCidadeResponse(cidades);
  }
}
