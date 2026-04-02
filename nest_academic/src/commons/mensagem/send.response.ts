/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Response } from 'express';
import { MensagemSistema } from './mensagem.sistema';
import { Link } from './mensagem';

export function sendHttpResponse<T>(
  res: Response,
  status: number,
  mensagem: string | null,
  dados: T | null,
  path: string | null,
  erro: string | any | null,
  _link: Record<string, Link> | null,
) {
  return res
    .status(status)
    .json(
      MensagemSistema.showMensagem(status, mensagem, dados, path, erro, _link),
    );
}
