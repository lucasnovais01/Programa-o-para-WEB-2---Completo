import { Injectable } from '@nestjs/common';
import { tabelaCidade } from './tabela.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';

@Injectable()
export class CidadeServiceFindOne {
  private cidade = tabelaCidade;

  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

  findOne(id: number) {
    const cidade = this.cidade.find((c) => c.idCidade === id);
    return cidade;
  }
}

// Arrow Function = Cria uma função anônimo
