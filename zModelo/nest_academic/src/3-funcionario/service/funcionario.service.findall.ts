import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Pageable } from 'src/commons/pagination/page.response';
import { Page } from 'src/commons/pagination/page.sistema';
import { Repository } from 'typeorm';
import { FuncionarioConverter } from '../dto/converter/funcionario.converter';
import { FuncionarioResponse } from '../dto/response/funcionario.response';
import { Funcionario } from '../entity/funcionario.entity';

@Injectable()
export class FuncionarioServiceFindAll {
  constructor(
    @InjectRepository(Funcionario)
    private funcionarioRepository: Repository<Funcionario>,
  ) {}

  async findAll(
    page: number = PAGINATION.PAGE,
    pageSize: number = PAGINATION.PAGESIZE,
    props: string = 'nomeLogin',
    order: 'ASC' | 'DESC' = PAGINATION.ASC,
    search?: string,
  ): Promise<Page<FuncionarioResponse>> {
    const allowedFields = [
      'idUsuario',
      'codigoFuncao',
      'nomeLogin',
      'dataContratacao',
      'ativo',
    ];

    const pageable = new Pageable(page, pageSize, props, order, allowedFields);

    const query = this.funcionarioRepository
      .createQueryBuilder('funcionario')
      .orderBy(`funcionario.${pageable.props}`, pageable.order)
      .skip(pageable.offset)
      .take(pageable.limit);

    if (search?.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      query.where(
        'LOWER(funcionario.nomeLogin) LIKE :searchTerm OR funcionario.codigoFuncao LIKE :searchTerm',
        { searchTerm },
      );
    }

    const [funcionarios, totalElements] = await query.getManyAndCount();
    const content =
      FuncionarioConverter.toListFuncionarioResponse(funcionarios);

    return Page.of(content, totalElements, pageable);
  }
}
