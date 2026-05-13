import { plainToInstance } from 'class-transformer';
import { AlterarSenhaResponse } from '../response/alterar-senha.response';

export class ConverterAlterarSenha {
  static toAlterarSenhaResponse(data: any): AlterarSenhaResponse {
    return plainToInstance(AlterarSenhaResponse, data, {
      excludeExtraneousValues: true,
    });
  }
}