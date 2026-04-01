export interface Link {
  href: string;
  method?: string;
}

// Interface Genérica -
export interface Result<T> {
  status: number;
  timestamp: string;
  mensagem?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  erro?: string | null | unknown;
  dados?: T | null;
  path: string | null;
  _link?: Record<string, Link>;
}

// Classe Genérica - consegue trabalhar com
// qualquer tipo de objeto - Cidade, Usuário, Professor, Disciplina
// Aluno --- etc.

export class Mensagem<T> {
  status: number = 0;
  mensagem: string | null = null;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  erro: string | unknown | null = null;
  dados: T | null = null;
  path: string | null = null;
  _link: Record<string, Link>;

  constructor(
    status: number,
    mensagem: string | null = null,
    dados: T | null = null,
    path: string | null = null,
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    erro: string | unknown | null = null,
    _link: Record<string, Link>,
  ) {
    this.status = status;
    this.mensagem = mensagem;
    this.dados = dados;
    this.path = path;
    this.erro = erro;
    this._link = _link;
  }

  toJSON(): Result<T> {
    const result: Result<T> = {
      status: this.status,
      timestamp: new Date().toISOString().split('T')[0],
      path: this.path,
      _link: this._link,
    };

    if (this.mensagem !== null && this.mensagem !== undefined) {
      result.mensagem = this.mensagem;
    }

    if (this.dados !== null && this.dados !== undefined) {
      result.dados = this.dados;
    }

    if (this.erro !== null && this.erro !== undefined) {
      result.erro = this.erro;
    }

    return result;
  }
}
