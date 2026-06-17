import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quarto } from '../entity/quarto.entity';

@Injectable()
export class QuartoServiceRemove {
  constructor(
    @InjectRepository(Quarto)
    private quartoRepository: Repository<Quarto>,
  ) {}

  async remove(id: number): Promise<void> {
    const quarto = await this.quartoRepository.findOneBy({
      idQuarto: id,
    });
    if (!quarto) {
      throw new HttpException('Quarto não encontrado', HttpStatus.NOT_FOUND);
    }

    await this.quartoRepository.delete({ idQuarto: id });
  }
}
