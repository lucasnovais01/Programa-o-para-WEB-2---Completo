import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoQuartoConverter } from '../dto/converter/tipo-quarto.converter';
import { TipoQuartoResponse } from '../dto/response/tipo-quarto.response';
import { TipoQuarto } from '../entity/tipo-quarto.entity';

@Injectable()
export class TipoQuartoServiceFindOne {
  constructor(
    @InjectRepository(TipoQuarto)
    private tipoQuartoRepository: Repository<TipoQuarto>,
  ) {}

  async findOne(id: number): Promise<TipoQuartoResponse | null> {
    const tipoQuarto = await this.tipoQuartoRepository
      .createQueryBuilder('tipoQuarto')
      .where('tipoQuarto.codigoTipoQuarto = :id', { id })
      .getOne();

    if (!tipoQuarto) return null;

    return TipoQuartoConverter.toTipoQuartoResponse(tipoQuarto);
  }
}
