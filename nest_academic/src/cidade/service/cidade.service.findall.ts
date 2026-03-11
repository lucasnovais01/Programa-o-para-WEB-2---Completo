import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConverterCidade } from '../dto/converter/cidade.converter';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';

import { Pageable } from 'src/commons/pagination/page.response';
import { CIDADE } from 'src/commons/constants/constants.sistema';
import { Page } from 'src/commons/pagination/page.sistema';
import { fieldsCidade } from '../constants/cidade.constants';

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
    //
  ): Promise<Page<CidadeResponse>> {
    const pageable = new Pageable(page, pageSize, props, order, fieldsCidade);

    // cálculo do offset ou skip
    //const offset = (page - 1) * pageSize;

    const query = this.cidadeRepository
      .createQueryBuilder(CIDADE.ENTITY)
      .orderBy(props, order)
      //
      .offset(pageable.offset)
      .limit(pageable.limit);

    if (search) {
      query.where(`${props} LIKE :search_where`, {
        search_where: `%${search}%`,
      });
    }
    //

    const [listaCidades, totalElements] = await query.getManyAndCount();

    const cidades = ConverterCidade.toListCidadeResponse(listaCidades);

    return Page.of(cidades, totalElements, pageable);

    /*
    const cidades = await query.getMany();

    const totalElements = await this.cidadeRepository.count();

    const totalPages = Math.ceil(totalElements / pageSize);

    const lastPages = totalPages;  

    return ConverterCidade.toListCidadeResponse(cidades);
    */
  }
}

/* OUTRA FORMA:

const cidades = await this.cidadeRepository.find({
  skip: offset,
  take: pageSize,
});
*/
