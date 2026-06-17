import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuartoConverter } from '../dto/converter/quarto.converter';
import { QuartoRequest } from '../dto/request/quarto.request';
import { QuartoResponse } from '../dto/response/quarto.response';
import { Quarto } from '../entity/quarto.entity';

@Injectable()
export class QuartoServiceUpdate {
  constructor(
    @InjectRepository(Quarto)
    private quartoRepository: Repository<Quarto>,
  ) {}

  async update(
    id: number,
    quartoRequest: QuartoRequest,
  ): Promise<QuartoResponse | null> {
    const quarto = await this.quartoRepository.findOneBy({
      idQuarto: id,
    });
    if (!quarto) {
      throw new HttpException('Quarto não encontrado', HttpStatus.NOT_FOUND);
    }

    // Atualiza campos permitidos
    quarto.codigoTipoQuarto =
      quartoRequest.codigoTipoQuarto ?? quarto.codigoTipoQuarto;
    quarto.numero = quartoRequest.numero ?? quarto.numero;
    quarto.statusQuarto = quartoRequest.statusQuarto ?? quarto.statusQuarto;
    quarto.andar = quartoRequest.andar ?? quarto.andar;

    const saved = await this.quartoRepository.save(quarto);
    return QuartoConverter.toQuartoResponse(saved);
  }
}
