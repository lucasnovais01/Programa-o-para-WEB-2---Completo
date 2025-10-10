import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
//import { CidadeServiceFindOne } from './cidade.service.findone';

@Injectable()
export class CidadeServiceRemove {
  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
    //private readonly service: CidadeServiceFindOne,
  ) {}

  async remove(idCidade: number): Promise<void> {
    const cidadeCadastrada = await this.cidadeRepository.findOne({
      where: { idCidade },
    }); //trocado findOne por findById
    /*
      .createQueryBuilder('cidade')
      .where('cidade.ID_CIDADE = :idCidade', { idCidade: idCidade })
      .getOne();
    */

    /*
    // refeito em casa 10-10-2025
    if (cidadeCadastrada?.idCidade) {
      throw new Error('Cidade não localizada');
    }
    await this.cidadeRepository
      .createQueryBuilder('cidade')
      .delete()
      .from(Cidade)
      .where('cidade.ID_CIDADE =:idCidade', { idCidade })
      .execute();
    */
    if (!cidadeCadastrada) {
      throw new NotFoundException('Cidade não localizada');
    }
    const result = await this.cidadeRepository.delete({ idCidade });

    if (result.affected === 0) {
      throw new NotFoundException('Cidade não localizada');
    }

    return;
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
