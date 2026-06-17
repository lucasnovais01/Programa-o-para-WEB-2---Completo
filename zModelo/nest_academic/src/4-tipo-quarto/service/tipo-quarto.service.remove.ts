import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoQuarto } from '../entity/tipo-quarto.entity';

@Injectable()
export class TipoQuartoServiceRemove {
  constructor(
    @InjectRepository(TipoQuarto)
    private tipoQuartoRepository: Repository<TipoQuarto>,
  ) {}

  async remove(id: number): Promise<void> {
    const tipoQuarto = await this.tipoQuartoRepository.findOneBy({
      codigoTipoQuarto: id,
    });
    if (!tipoQuarto) {
      throw new HttpException(
        'Tipo de quarto não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.tipoQuartoRepository.delete({ codigoTipoQuarto: id });
  }
}
