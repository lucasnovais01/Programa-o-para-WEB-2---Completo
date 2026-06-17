import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuartoConverter } from '../dto/converter/quarto.converter';
import { QuartoResponse } from '../dto/response/quarto.response';
import { Quarto } from '../entity/quarto.entity';

@Injectable()
export class QuartoServiceFindOne {
  constructor(
    @InjectRepository(Quarto)
    private quartoRepository: Repository<Quarto>,
  ) {}

  async findOne(id: number): Promise<QuartoResponse | null> {
    const quarto = await this.quartoRepository
      .createQueryBuilder('quarto')
      .where('quarto.idQuarto = :id', { id })
      .getOne();

    if (!quarto) return null;

    return QuartoConverter.toQuartoResponse(quarto);
  }
}
