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

  async findAll(page: number, pageSize: number): Promise<CidadeResponse[]> {
    // cálculo do offset ou skip
    const offset = (page - 1) * pageSize;

    const cidades = await this.cidadeRepository
      .createQueryBuilder('cidade')
      //
      .offset(offset)
      .limit(pageSize)
      //
      .getMany();

    /* OUTRA FORMA:

    const cidades = await this.cidadeRepository.find({
      skip: offset,
      take: pageSize,
    });
    */

    return ConverterCidade.toListCidadeResponse(cidades);
  }
}
