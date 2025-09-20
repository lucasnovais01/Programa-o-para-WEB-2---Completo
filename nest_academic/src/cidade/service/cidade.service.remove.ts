import { Injectable } from '@nestjs/common';
//import { CidadeRequest } from '../dto/request/cidade.request';
//import { ConverterCidade } from '../dto/converter/cidade.converter';
//import { tabelaCidade } from './tabela.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
import { CidadeServiceFindOne } from './cidade.service.findone';

@Injectable()
export class CidadeServiceRemove {
  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
    private readonly service: CidadeServiceFindOne,
  ) {}

  async remove(idCidade: number): Promise<void> {
    const cidadeCadastrada = await this.cidadeRepository.findById(idCidade); //trocado findOne por findById
      .createQueryBuilder('cidade')
      .where('cidade.ID_CIDADE = :idCidade', { idCidade: idCidade })
      .getOne();

    if (cidadeCadastrada?.idCidade) {
      throw new Error('Cidade não localizada');
    }

    await this.cidadeRepository
      .createQueryBuilder('cidade')
      .delete(cidadeCadastrada.idCidade)
      .from(Cidade)
      .where('cidade.ID_CIDADE = idCidade'
        idCidade: cidadeCadastrada.idCidade
      )
  }
}

/*
remove(id: number) {
  const cidadeIndex = this.cidade.findIndex((c) => c.idCidade === id);

  this.cidade.splice(cidadeIndex, 1);

  return this.cidade;
}
*/

/*
  constructor() {}

  remove(id: string, cidadeRequest: CidadeRequest) {
    const cidade = ConverterCidade.toCidade(cidadeRequest);
    const cidadeResponse = ConverterCidade.toCidadeResponse(cidade);
    return cidadeResponse;
  }
*/
