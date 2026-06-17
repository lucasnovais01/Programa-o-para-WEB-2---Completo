import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION } from 'src/commons/enum/paginacao.enum';
import { Pageable } from 'src/commons/pagination/page.response';
import { Page } from 'src/commons/pagination/page.sistema';
import { Repository } from 'typeorm';
import { ConverterHospede } from '../dto/converter/hospede.converter';
import { HospedeResponse } from '../dto/response/hospede.response';
import { Hospede } from '../entity/hospede.entity';

@Injectable()
export class HospedeServiceFindAll {
  constructor(
    @InjectRepository(Hospede)
    private hospedeRepository: Repository<Hospede>,
  ) {}

  //async e await são comandos que sempre aparecem juntos

  async findAll(
    page: number = PAGINATION.PAGE,
    pageSize: number = PAGINATION.PAGESIZE,
    props: string = 'nomeHospede',
    order: 'ASC' | 'DESC' = PAGINATION.ASC,
    search?: string,
  ): Promise<Page<HospedeResponse>> {
    const query = this.hospedeRepository.createQueryBuilder('hospede');

    if (search?.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      query.where(
        'LOWER(hospede.nomeHospede) LIKE :searchTerm OR LOWER(hospede.cpf) LIKE :searchTerm OR LOWER(hospede.email) LIKE :searchTerm',
        { searchTerm },
      );
    }

    const [hospedes, totalElements] = await query
      .orderBy(`hospede.${props}`, order)
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const content = ConverterHospede.toListHospedeResponse(hospedes);
    const pageable = new Pageable(page, pageSize, props, order, [
      'idUsuario',
      'nomeHospede',
      'cpf',
      'email',
    ]);

    return Page.of(content, totalElements, pageable);
  }
}

/*
 * ==============================================================
 * EXPLICAÇÃO DIDÁTICA: hospede.service.findall.ts
 * ==============================================================

 * O que é?
 *   - Service específico para a operação de FIND ALL no módulo Hospede.
 * Como funciona?
 *   1. Injeta repositório TypeORM para Hospede.
 *   2. Usa createQueryBuilder para buscar todos os registros (getMany).
 *   3. Converte a lista de entidades para lista de HospedeResponse via converter.
 *   4. Retorna a lista de responses.

 * Por quê separado?
 *   - Organização: Lógica de negócios isolada por operação.
 *   - Facilita injeção, testes e reutilização.

 * Dicas:
 *   - Pode expandir query com filtros/order se necessário.
 *   - Erros (ex.: banco offline) propagados para controller/filter.
 *   - Integra com converter para mapear entity → response.
 * 
 * ==============================================================
 */
