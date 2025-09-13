import { Injectable } from '@nestjs/common';
import { tabelaCidade } from './tabela.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
import { CidadeResponse } from '../dto/response/cidade.response';
import { ConverterCidade } from '../dto/converter/cidade.converter';

@Injectable()
export class CidadeServiceFindOne {
  private cidade = tabelaCidade;

  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

  async findOne(idCidade: number): Promise<CidadeResponse | null> {
    const cidade = await this.cidadeRepository
      .createQueryBuilder('cidade')
      .where('cidade.ID_CIDADE = :idCidade', { idCidade: idCidade })
      .getOne();

    // é isto que ele ta falando pro banco: 'SELECT * FROM CIDADE cidade WHERE cidade.idCidade = idCidade'

    if (!cidade) {
      throw new Error('Cidade não localizada ');
    }

    return cidade ? ConverterCidade.toCidadeResponse(cidade) : null;
  }
}
/*
findOne(id: number) {
  const cidade = this.cidade.find((c) => c.idCidade === id);
  return cidade;
}
*/

// Arrow Function = Cria uma função anônimo
