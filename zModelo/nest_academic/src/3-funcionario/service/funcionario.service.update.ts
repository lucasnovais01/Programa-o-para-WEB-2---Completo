import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { FuncionarioConverter } from '../dto/converter/funcionario.converter';
import { FuncionarioUpdateRequest } from '../dto/request/funcionario.request';
import { FuncionarioResponse } from '../dto/response/funcionario.response';
import { Funcionario } from '../entity/funcionario.entity';

@Injectable()
export class FuncionarioServiceUpdate {
  constructor(
    @InjectRepository(Funcionario)
    private funcionarioRepository: Repository<Funcionario>,
  ) {}

  async update(
    id: number,
    funcionarioRequest: FuncionarioUpdateRequest,
  ): Promise<FuncionarioResponse | null> {
    const funcionario = await this.funcionarioRepository.findOneBy({
      idUsuario: id,
    });
    if (!funcionario) {
      throw new HttpException(
        'Funcionário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    // Atualiza campos permitidos
    funcionario.codigoFuncao =
      funcionarioRequest.codigoFuncao ?? funcionario.codigoFuncao;
    funcionario.nomeLogin =
      funcionarioRequest.nomeLogin ?? funcionario.nomeLogin;

    // Mudei o funcionarioRequest.senha para usar o bcrypt
    if (funcionarioRequest.senha) {
      funcionario.senha = await bcrypt.hash(funcionarioRequest.senha, 10);
      funcionario.refreshToken = null;
    }

    funcionario.dataContratacao = funcionarioRequest.dataContratacao
      ? new Date(funcionarioRequest.dataContratacao)
      : funcionario.dataContratacao;
    funcionario.ativo = funcionarioRequest.ativo ?? funcionario.ativo;

    const saved = await this.funcionarioRepository.save(funcionario);
    return FuncionarioConverter.toFuncionarioResponse(saved);
  }
}
