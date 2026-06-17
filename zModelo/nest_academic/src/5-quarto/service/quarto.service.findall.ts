import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Pageable } from 'src/commons/pagination/page.response';
import { Page } from 'src/commons/pagination/page.sistema';
import { Repository } from 'typeorm';
import { QuartoConverter } from '../dto/converter/quarto.converter';
import { QuartoResponse } from '../dto/response/quarto.response';
import { Quarto } from '../entity/quarto.entity';

@Injectable()
export class QuartoServiceFindAll {
  constructor(
    @InjectRepository(Quarto)
    private quartoRepository: Repository<Quarto>,
  ) {}

  async findAll(
    page: number = PAGINATION.PAGE,
    pageSize: number = PAGINATION.PAGESIZE,
    props?: string,
    order: string = PAGINATION.ASC,
  ): Promise<Page<QuartoResponse>> {
    const allowedFields = [
      'idQuarto',
      'codigoTipoQuarto',
      'numero',
      'statusQuarto',
      'andar',
    ];

    const pageable = new Pageable(page, pageSize, props, order, allowedFields);

    const [quartos, totalElements] = await this.quartoRepository
      .createQueryBuilder('quarto')
      .orderBy(`quarto.${pageable.props}`, pageable.order)
      .skip(pageable.offset)
      .take(pageable.limit)
      .getManyAndCount();

    const content = QuartoConverter.toListQuartoResponse(quartos);

    return Page.of(content, totalElements, pageable);
  }
}
