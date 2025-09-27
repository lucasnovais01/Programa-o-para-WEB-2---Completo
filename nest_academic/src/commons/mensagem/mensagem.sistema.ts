import { Injectable } from '@nestjs/common';
import { Mensagem, Result } from './mensagem';

@Injectable()
export class MensagemSistema {
  static showMessage<T>(
    status: number,
    mensagem: string | null,
    dados: T | null,
    path: string | null,
    erro: string | null,
  ): Result<T> {
    const resposta = new Mensagem(
      status,
      undefined,
      mensagem,
      erro,
      dados,
      path,
    );

    return resposta.toJSON();
  }
}
