import { Injectable } from '@nestjs/common';
import { Link, Mensagem, Result } from './mensagem';

@Injectable()
export class MensagemSistema {
  static showMensagem<T>(
    status: number,
    mensagem: string | null,
    dados: T | null,
    path: string | null,
    erro: string | null,
    _link: Record<string, Link>,
  ): Result<T> {
    const resposta = new Mensagem(status, mensagem, dados, path, erro, _link);
    return resposta.toJSON();
  }
}
