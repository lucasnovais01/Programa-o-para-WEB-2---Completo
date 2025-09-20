import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
import { CidadeResponse } from '../dto/response/cidade.response';
import { ConverterCidade } from '../dto/converter/cidade.converter';

@Injectable()
export class CidadeServiceFindOne {
  idCidade: any;
  //private cidade = tabelaCidade;

  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

  async findById(idCidade: number): Promise<CidadeResponse> {
    const cidade = await this.cidadeRepository.findOne({ where: { idCidade } });
    /*
      .createQueryBuilder('cidade')
      .where('cidade.ID_CIDADE = :idCidade', { idCidade: idCidade })
      .getOne();
    */
    // é isto que ele ta falando pro banco: 'SELECT * FROM CIDADE cidade WHERE cidade.idCidade = idCidade'

    if (!cidade) {
      throw new HttpException('Cidade não cadastrada', HttpStatus.NOT_FOUND);
    }

    return ConverterCidade.toCidadeResponse(cidade);
  }
}
/*
  async findById(idCidade: number): Promise<Cidade | null> {
    const cidade = await this.cidadeRepository

}
*/

/*
findOne(id: number) {
  const cidade = this.cidade.find((c) => c.idCidade === id);
  return cidade;
}
*/

// Arrow Function = Cria uma função anônimo
