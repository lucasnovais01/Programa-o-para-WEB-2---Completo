import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Hospede } from 'src/1-hospede/entity/hospede.entity';
import { Repository } from 'typeorm';
import { FuncionarioConverter } from '../dto/converter/funcionario.converter';
import { FuncionarioRequest } from '../dto/request/funcionario.request';
import { FuncionarioResponse } from '../dto/response/funcionario.response';
import { Funcionario } from '../entity/funcionario.entity';

@Injectable()
export class FuncionarioServiceCreate {
  constructor(
    @InjectRepository(Funcionario)
    private funcionarioRepository: Repository<Funcionario>,
    @InjectRepository(Hospede)
    private hospedeRepository: Repository<Hospede>,
  ) {}

  async create(
    funcionarioRequest: FuncionarioRequest,
  ): Promise<FuncionarioResponse | null> {
    let funcionario = FuncionarioConverter.toFuncionario(funcionarioRequest);

    const funcionarioExistente = await this.funcionarioRepository
      .createQueryBuilder('f')
      .where('f.nomeLogin = :login', { login: funcionario.nomeLogin })
      .getOne();

    if (funcionarioExistente) {
      throw new HttpException(
        'Nome de login já cadastrado',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hospedeExistente = await this.hospedeRepository.findOneBy({
      idUsuario: funcionario.idUsuario,
    });

    if (!hospedeExistente) {
      throw new HttpException(
        'Hóspede associado ao funcionário não encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Linha nova abaixo:
    // Criptografa a senha antes de salvar

    funcionario.senha = await bcrypt.hash(funcionario.senha, 10);
    funcionario.refreshToken = null;

    // Acima, usamos o bcrypt para gerar um hash da senha com um salt de 10 rodadas. O resultado é uma string segura que pode ser armazenada no banco de dados. Nunca armazenamos a senha em texto puro!

    funcionario = await this.funcionarioRepository.save(funcionario);

    await this.hospedeRepository.update(
      { idUsuario: funcionario.idUsuario },
      { tipo: 1 },
    );

    return FuncionarioConverter.toFuncionarioResponse(funcionario);
  }
}
