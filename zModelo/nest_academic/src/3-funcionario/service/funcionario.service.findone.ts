import { Injectable } from '@nestjs/common';
import { Funcionario } from '../entity/funcionario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FuncionarioResponse } from '../dto/response/funcionario.response';
import { FuncionarioConverter } from '../dto/converter/funcionario.converter';

@Injectable()
export class FuncionarioServiceFindOne {
  constructor(
    @InjectRepository(Funcionario)
    private funcionarioRepository: Repository<Funcionario>,
  ) {}

  async findOne(id: number): Promise<FuncionarioResponse | null> {
    const funcionario = await this.funcionarioRepository
      .createQueryBuilder('funcionario')
      .where('funcionario.idUsuario = :id', { id })
      .getOne();

    if (!funcionario) return null;

    return FuncionarioConverter.toFuncionarioResponse(funcionario);
  }
}
