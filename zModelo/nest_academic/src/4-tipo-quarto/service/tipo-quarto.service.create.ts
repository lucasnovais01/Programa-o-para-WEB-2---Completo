import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoQuartoConverter } from '../dto/converter/tipo-quarto.converter';
import { TipoQuartoRequest } from '../dto/request/tipo-quarto.request';
import { TipoQuartoResponse } from '../dto/response/tipo-quarto.response';
import { TipoQuarto } from '../entity/tipo-quarto.entity';

@Injectable()
export class TipoQuartoServiceCreate {
  constructor(
    @InjectRepository(TipoQuarto)
    private tipoQuartoRepository: Repository<TipoQuarto>,
  ) {}

  async create(
    tipoQuartoRequest: TipoQuartoRequest,
  ): Promise<TipoQuartoResponse | null> {
    let tipoQuarto = TipoQuartoConverter.toTipoQuarto(tipoQuartoRequest);

    const tipoQuartoExistente = await this.tipoQuartoRepository
      .createQueryBuilder('tq')
      .where('tq.nomeTipo = :nome', { nome: tipoQuarto.nomeTipo })
      .getOne();

    if (tipoQuartoExistente) {
      throw new HttpException(
        'Nome do tipo de quarto já cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    tipoQuarto = await this.tipoQuartoRepository.save(tipoQuarto);

    return TipoQuartoConverter.toTipoQuartoResponse(tipoQuarto);
  }
}
