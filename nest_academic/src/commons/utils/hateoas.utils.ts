import { Request } from 'express';
import { Link } from '../mensagem/mensagem';
import { ROTA_SISTEMA } from '../constants/url.sistema';

export function gerarLinks(
  req: Request,
  entity: string,
  id?: number,
): Record<string, Link> {
  const protocol = req.protocol;
  const host = req.get('host');
  const entidade = entity.toLowerCase();
  //http://localhost:8000/rest/sistema/cidade/
  const baseUrl = `${protocol}://${host}/${ROTA_SISTEMA}/${entidade}`;

  const link: Record<string, Link> = {
    listar: {
      href: `${baseUrl}/listar`,
      method: 'GET',
    },
    criar: {
      href: `${baseUrl}/criar`,
      method: 'POST',
    },
  };

  if (id) {
    link.self = {
      href: `${baseUrl}/buscar/${id}`,
      method: 'GET',
    };
    link.alterar = {
      href: `${baseUrl}/alterar/${id}`,
      method: 'PUT',
    };
    link.excluir = {
      href: `${baseUrl}/excluir/${id}`,
      method: 'PUT',
    };
  }

  return link;
}
