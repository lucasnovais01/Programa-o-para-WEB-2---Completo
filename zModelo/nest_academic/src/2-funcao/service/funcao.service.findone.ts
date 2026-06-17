import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcao } from '../entity/funcao.entity';

//
// import { FuncaoResponse } from '../dto/response/funcao.response';
// import { FuncaoConverter } from '../dto/converter/funcao.converter';

@Injectable()
export class FuncaoServiceFindOne {
  constructor(
    @InjectRepository(Funcao)
    private funcaoRepository: Repository<Funcao>,
  ) {}

  async findByCodigo(codigoFuncao: number): Promise<Funcao> {
    const funcao = await this.funcaoRepository.findOne({
      where: { codigoFuncao },
    });

    if (!funcao) {
      throw new HttpException('Função não cadastrada', HttpStatus.NOT_FOUND);
    }

    return funcao;
  }
}
