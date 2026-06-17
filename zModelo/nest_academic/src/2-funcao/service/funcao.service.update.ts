import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FuncaoRequest } from '../dto/request/funcao.request';
import { FuncaoConverter } from '../dto/converter/funcao.converter';
import { InjectRepository } from '@nestjs/typeorm';
import { Funcao } from '../entity/funcao.entity';
import { Repository } from 'typeorm';
import { FuncaoServiceFindOne } from './funcao.service.findone';
import { FuncaoResponse } from '../dto/response/funcao.response';

@Injectable()
export class FuncaoServiceUpdate {
  constructor(
    @InjectRepository(Funcao)
    private funcaoRepository: Repository<Funcao>,
    private funcaoServiceFindOne: FuncaoServiceFindOne,
  ) {}

  async update(
    codigoFuncao: number,
    funcaoRequest: FuncaoRequest,
  ): Promise<FuncaoResponse | null> {
    const funcaoCadastrada =
      await this.funcaoServiceFindOne.findByCodigo(codigoFuncao);

    if (!funcaoCadastrada) {
      throw new HttpException('Função não cadastrada', HttpStatus.NOT_FOUND);
    }

    let funcao = FuncaoConverter.toFuncao({
      ...funcaoRequest,
      codigoFuncao: funcaoCadastrada.codigoFuncao,
    } as any);

    const funcaoAtualizado = Object.assign(funcaoCadastrada, funcao);

    funcao = await this.funcaoRepository.save(funcaoAtualizado);

    return FuncaoConverter.toFuncaoResponse(funcao);
  }
}
