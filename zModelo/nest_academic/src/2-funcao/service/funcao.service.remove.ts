import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funcao } from '../entity/funcao.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FuncaoServiceRemove {
  constructor(
    @InjectRepository(Funcao)
    private funcaoRepository: Repository<Funcao>,
  ) {}

  async remove(codigoFuncao: number): Promise<void> {
    const funcaoCadastrada = await this.funcaoRepository.findOne({
      where: { codigoFuncao },
    });

    if (!funcaoCadastrada) {
      throw new NotFoundException('Função não localizada');
    }

    const result = await this.funcaoRepository.delete({ codigoFuncao });

    if (result.affected === 0) {
      throw new NotFoundException('Função não localizada');
    }

    return;
  }
}
