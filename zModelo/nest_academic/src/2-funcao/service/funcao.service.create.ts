import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FuncaoConverter } from '../dto/converter/funcao.converter';
import { FuncaoRequest } from '../dto/request/funcao.request';
import { Repository } from 'typeorm';
import { Funcao } from '../entity/funcao.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FuncaoResponse } from '../dto/response/funcao.response';

@Injectable()
export class FuncaoServiceCreate {
  constructor(
    @InjectRepository(Funcao)
    private funcaoRepository: Repository<Funcao>,
  ) {}

  async create(funcaoRequest: FuncaoRequest): Promise<FuncaoResponse | null> {
    let funcao = FuncaoConverter.toFuncao(funcaoRequest);

    const funcaoCadastrada = await this.funcaoRepository
      .createQueryBuilder('funcao')
      .where('funcao.nomeFuncao = :nome', { nome: funcao.nomeFuncao })
      .getOne();

    if (funcaoCadastrada) {
      throw new HttpException(
        'A função com o nome informado já está cadastrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    funcao = await this.funcaoRepository.save(funcao);

    return FuncaoConverter.toFuncaoResponse(funcao);
  }
}
