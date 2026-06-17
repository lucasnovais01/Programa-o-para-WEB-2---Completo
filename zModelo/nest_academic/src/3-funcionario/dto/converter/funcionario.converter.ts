import { plainToInstance } from 'class-transformer';
import { Funcionario } from 'src/3-funcionario/entity/funcionario.entity';
import { FuncionarioRequest } from '../request/funcionario.request';
import { FuncionarioResponse } from '../response/funcionario.response';

export class FuncionarioConverter {
  static toFuncionario(funcionarioRequest: FuncionarioRequest): Funcionario {
    const f = new Funcionario();

    if (funcionarioRequest.idUsuario != null) {
      f.idUsuario = funcionarioRequest.idUsuario;
    }

    f.codigoFuncao = funcionarioRequest.codigoFuncao;
    f.nomeLogin = funcionarioRequest.nomeLogin;
    f.senha = funcionarioRequest.senha;
    f.email = funcionarioRequest.email ?? null;
    f.dataContratacao = new Date(funcionarioRequest.dataContratacao);
    f.ativo = funcionarioRequest.ativo ?? 1;

    return f;
  }

  static toFuncionarioResponse(funcionario: Funcionario): FuncionarioResponse {
    return plainToInstance(FuncionarioResponse, funcionario, {
      excludeExtraneousValues: true,
    });
  }

  static toListFuncionarioResponse(
    funcionarios: Funcionario[] = [],
  ): FuncionarioResponse[] {
    return plainToInstance(FuncionarioResponse, funcionarios, {
      excludeExtraneousValues: true,
    });
  }
}
