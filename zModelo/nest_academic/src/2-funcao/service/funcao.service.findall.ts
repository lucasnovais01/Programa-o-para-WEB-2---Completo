import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Pageable } from 'src/commons/pagination/page.response';
import { Page } from 'src/commons/pagination/page.sistema';
import { Repository } from 'typeorm';
import { FuncaoConverter } from '../dto/converter/funcao.converter';
import { FuncaoResponse } from '../dto/response/funcao.response';
import { Funcao } from '../entity/funcao.entity';

@Injectable()
export class FuncaoServiceFindAll {
  constructor(
    @InjectRepository(Funcao)
    private funcaoRepository: Repository<Funcao>,
  ) {}

  async findAll(
    page: number = PAGINATION.PAGE,
    pageSize: number = PAGINATION.PAGESIZE,
    props: string = 'codigoFuncao',
    order: string = PAGINATION.ASC,
  ): Promise<Page<FuncaoResponse>> {
    const allowedFields = [
      'codigoFuncao',
      'nomeFuncao',
      'descricao',
      'nivelAcesso',
    ];

    const pageable = new Pageable(page, pageSize, props, order, allowedFields);

    const query = this.funcaoRepository
      .createQueryBuilder('funcao')
      .orderBy(`funcao.${pageable.props}`, pageable.order)
      .skip(pageable.offset)
      .take(pageable.limit);

    const [funcoes, totalElements] = await query.getManyAndCount();
    const content = FuncaoConverter.toListFuncaoResponse(funcoes);

    return Page.of(content, totalElements, pageable);
  }
}
