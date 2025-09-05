import { Injectable } from '@nestjs/common';
import { tabelaCidade } from './tabela.service';

@Injectable()
export class CidadeServiceFindOne {
  private cidade = tabelaCidade;

  constructor() {}

  findOne(id: number) {
    const cidade = this.cidade.find((c) => c.idCidade === id);
    return cidade;
  }
}

// Arrow Function = Cria uma função anônimo
