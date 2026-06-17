import { Request } from 'express';
import { ROTA_SISTEMA } from '../constants/url.sistema';
import { Link } from '../mensagem/mensagem';
import { Page } from '../pagination/page.sistema';

//localhost

export function gerarLinks(
  req: Request,
  entity: string,
  id?: number,
): Record<string, Link> {
  const protocol = req.protocol;
  const host = req.get('host');

  //http://localhost:8000/rest/sistema/cidade/
  const baseUrl = `${protocol}://${host}/${ROTA_SISTEMA}/${entity.toLowerCase()}`;

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
    link.buscar = {
      href: `${baseUrl}/buscar/${id}`,
      method: 'GET',
    };
    link.alterar = {
      href: `${baseUrl}/alterar/${id}`,
      method: 'PUT',
    };
    link.excluir = {
      href: `${baseUrl}/excluir/${id}`,
      method: 'DELETE',
    };
  }

  return link;
}

export function geraPageLinks(
  req: Request,
  page: Page<any>,
  entity: string,
): Record<string, Link> | null {
  const protocol = req.protocol;
  const host = req.get('host');
  const baseUrl = `${protocol}://${host}/${ROTA_SISTEMA}/${entity.toLowerCase()}`;

  const params = new URLSearchParams({
    page: String(page.page),
    pageSize: String(page.pageSize),
  });

  const links: Record<string, Link> = {
    self: {
      href: `${baseUrl}/listar?${params.toString()}`,
      method: 'GET',
    },
    first: {
      href: `${baseUrl}/listar?page=1&pageSize=${page.pageSize}`,
      method: 'GET',
    },
    last: {
      href: `${baseUrl}/listar?page=${page.totalPages}&pageSize=${page.pageSize}`,
      method: 'GET',
    },
  };

  if (page.page > 1) {
    links.prev = {
      href: `${baseUrl}/listar?page=${page.page - 1}&pageSize=${page.pageSize}`,
      method: 'GET',
    };
  }

  if (page.page < page.totalPages) {
    links.next = {
      href: `${baseUrl}/listar?page=${page.page + 1}&pageSize=${page.pageSize}`,
      method: 'GET',
    };
  }

  return links;
}
