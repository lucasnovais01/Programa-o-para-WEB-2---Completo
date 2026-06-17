import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoQuartoConverter } from '../dto/converter/tipo-quarto.converter';
import { TipoQuartoRequest } from '../dto/request/tipo-quarto.request';
import { TipoQuartoResponse } from '../dto/response/tipo-quarto.response';
import { TipoQuarto } from '../entity/tipo-quarto.entity';

@Injectable()
export class TipoQuartoServiceUpdate {
  constructor(
    @InjectRepository(TipoQuarto)
    private tipoQuartoRepository: Repository<TipoQuarto>,
  ) {}

  async update(
    id: number,
    tipoQuartoRequest: TipoQuartoRequest,
  ): Promise<TipoQuartoResponse | null> {
    const tipoQuarto = await this.tipoQuartoRepository.findOneBy({
      codigoTipoQuarto: id,
    });
    if (!tipoQuarto) {
      throw new HttpException(
        'Tipo de quarto não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    // Atualiza campos permitidos
    tipoQuarto.nomeTipo = tipoQuartoRequest.nomeTipo ?? tipoQuarto.nomeTipo;
    tipoQuarto.capacidadeMaxima =
      tipoQuartoRequest.capacidadeMaxima ?? tipoQuarto.capacidadeMaxima;
    tipoQuarto.valorDiaria =
      tipoQuartoRequest.valorDiaria ?? tipoQuarto.valorDiaria;

    const saved = await this.tipoQuartoRepository.save(tipoQuarto);
    return TipoQuartoConverter.toTipoQuartoResponse(saved);
  }
}
