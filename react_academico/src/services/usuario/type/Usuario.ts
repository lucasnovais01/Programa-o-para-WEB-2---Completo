export interface Usuario {
  idUsuario?: string;
  nomeUsuario?: string;
  sobrenomeUsuario?: string;
  emailUsuario?: string;
  senhaUsuario?: string;
  confirmarSenhaUsuario?: string;
}

/**
 * Interface para resposta paginada da API
 * A API retorna um objeto com a propriedade 'dados' que contém:
 * - content: array de itens (Usuario[])
 * - page: número da página atual
 * - pageSize: quantidade de registros por página
 * - totalElements: total de registros
 * - totalPages: total de páginas
 */
export interface PaginatedResponse<T> {
  dados: {
    content: T[];
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface ErrosUsuario {
  idUsuario?: boolean;
  nomeUsuario?: boolean;
  sobrenomeUsuario?: boolean;
  emailUsuario?: boolean;
  senhaUsuario?: boolean;
  confirmarSenhaUsuario?: boolean;

  idUsuarioMensagem?: string[];
  nomeUsuarioMensagem?: string[];
  sobrenomeUsuarioMensagem?: string[];
  emailUsuarioMensagem?: string[];
  senhaUsuarioMensagem?: string[];
  confirmarSenhaUsuarioMensagem?: string[];
}
