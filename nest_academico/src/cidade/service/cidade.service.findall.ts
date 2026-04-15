import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pageable } from '../../commons/pagination/page.response';
import { Page } from '../../commons/pagination/page.sistema';
import { CIDADE, fieldsCidade } from '../constants/cidade.constants';
import { ConverterCidade } from '../dto/converter/cidade.converter';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';

@Injectable()
export class CidadeServiceFindAll {
  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    props: string,
    order: 'ASC' | 'DESC',
    search?: string,
  ): Promise<Page<CidadeResponse>> {
    const pageable = new Pageable(page, pageSize, props, order, fieldsCidade);

    const query = this.cidadeRepository
      .createQueryBuilder(CIDADE.ENTITY)
      .orderBy(props, order)
      .offset(pageable.offset)
      .limit(pageable.limit);

    if (search) {
      query.where(`${props} LIKE :search_where`, {
        search_where: `%${search}%`,
      });
    }

    const [listaCidades, totalElements] = await query.getManyAndCount();

    const cidades = ConverterCidade.toListCidadeResponse(listaCidades);

    return Page.of(cidades, totalElements, pageable);
  }
}
