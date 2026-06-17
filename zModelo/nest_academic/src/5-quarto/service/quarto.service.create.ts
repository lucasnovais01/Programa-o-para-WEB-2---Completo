import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuartoConverter } from '../dto/converter/quarto.converter';
import { QuartoRequest } from '../dto/request/quarto.request';
import { QuartoResponse } from '../dto/response/quarto.response';
import { Quarto } from '../entity/quarto.entity';

@Injectable()
export class QuartoServiceCreate {
  constructor(
    @InjectRepository(Quarto)
    private quartoRepository: Repository<Quarto>,
  ) {}

  async create(quartoRequest: QuartoRequest): Promise<QuartoResponse | null> {
    let quarto = QuartoConverter.toQuarto(quartoRequest);

    const quartoExistente = await this.quartoRepository
      .createQueryBuilder('q')
      .where('q.numero = :numero', { numero: quarto.numero })
      .getOne();

    if (quartoExistente) {
      throw new HttpException(
        'Número do quarto já cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    quarto = await this.quartoRepository.save(quarto);

    return QuartoConverter.toQuartoResponse(quarto);
  }
}
