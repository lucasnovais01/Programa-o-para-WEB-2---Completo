import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PAGINATION } from "src/commons/enum/paginacao.enum";
import { Pageable } from "src/commons/pagination/page.response";
import { Page } from "src/commons/pagination/page.sistema";
import { Repository } from "typeorm";
import { TipoQuartoConverter } from "../dto/converter/tipo-quarto.converter";
import { TipoQuartoResponse } from "../dto/response/tipo-quarto.response";
import { TipoQuarto } from "../entity/tipo-quarto.entity";

@Injectable()
export class TipoQuartoServiceFindAll {
  constructor(
    @InjectRepository(TipoQuarto)
    private tipoQuartoRepository: Repository<TipoQuarto>
  ) {}

  async findAll(
    page: number = PAGINATION.PAGE,
    pageSize: number = PAGINATION.PAGESIZE,
    props?: string,
    order: string = PAGINATION.ASC,
  ): Promise<Page<TipoQuartoResponse>> {
    const allowedFields = [
      "codigoTipoQuarto",
      "nomeTipo",
      "capacidadeMaxima",
      "valorDiaria",
    ];

    const pageable = new Pageable(page, pageSize, props, order, allowedFields);

    const [tiposQuarto, totalElements] = await this.tipoQuartoRepository
      .createQueryBuilder("tipoQuarto")
      .orderBy(`tipoQuarto.${pageable.props}`, pageable.order)
      .skip(pageable.offset)
      .take(pageable.limit)
      .getManyAndCount();

    const content = TipoQuartoConverter.toListTipoQuartoResponse(tiposQuarto);

    return Page.of(content, totalElements, pageable);
  }
}
