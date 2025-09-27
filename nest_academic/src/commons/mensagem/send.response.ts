import { Response } from 'express';
import { MensagemSistema } from './mensagem.sistema';

export function sendHttpResponse<T>(
  res: Response,
  status: number,
  mensagem: string | null,
  dados: T | null,
  path: string | null,
  erro: string | null,
) {
  return res
    .status(status)
    .json(MensagemSistema.showMessage(status, mensagem, dados, path, erro));
}
