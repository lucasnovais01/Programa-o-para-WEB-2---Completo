import { Injectable } from "@nestjs/common";

@Injectable()
export class CidadeServiceFindOne {
  constructor(private readonly cidadeServiceFindOne: CidadeServiceFindOne) {}

  findOne(id: number) {
    const cidade = this.cidadeServiceFindOne.find((c) => c.idCidade === id);
    return cidade;
  }
}

// Arrow Function = Cria uma função anônimo
