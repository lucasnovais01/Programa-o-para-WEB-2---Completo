import { Request } from 'express';
import { Link } from '../mensagem/mensagem';

function gerarLinks(
  req: Request,
  id?: number,
  entity: string,
): Record<string, Link> {
  const protocol = req.protocol;
  const host = req.get('host');
  //http://localhost:8000/rest/sistema/cidade/
  const baseUrl = `${protocol}://${host}/${ROTA_SISTEMA}/${entity}`;

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

  return link;
}
