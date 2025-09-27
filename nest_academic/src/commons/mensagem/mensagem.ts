/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
export interface Result<T> {
  status: number;
  timestamp?: string;
  mensagem: string | null;
  erro?: string | null | unknown;
  dados?: T | null;
  path: string | null;
}

export class Mensagem<T> {
  status: number = 0;
  timestamp?: string = '';
  mensagem: string | null = null;
  erro?: string | unknown | null = null;
  dados?: T | null;
  path: string | null = null;

  constructor(
    status: number,
    timestamp?: string,
    mensagem: string | null = null,
    erro: string | unknown | null = null,
    dados: T | null = null,
    path: string | null = null,
  ) {
    this.status = status;
    this.mensagem = mensagem;
    this.dados = dados;
    this.erro = erro;
    this.path = path;
  }

  toJSON(): Result<T> {
    const result: Result<T> = {
      status: this.status,
      timestamp: new Date().toISOString().split('T')[0],
      path: this.path,
      mensagem: null,
    };

    if (
      this.mensagem != null &&
      this.mensagem !== undefined
      // && this.erro !== unknown
    ) {
      result.mensagem = this.mensagem;
    }
    if (this.dados !== null && this.dados != undefined) {
      result.dados = this.dados;
    }
    return result;
  }
}
/*
    if (this.mensagem != null && this.mensagem !== undefined && this.erro !== unknown) {
      result.mensagem = this.mensagem;
    }
    */

// Colocando o ? vc torna o dado opcional

// O que é o construtor da classe? vulgo contructor() {}
// ele inicializa a classe e É o primeiro a ser executado}
