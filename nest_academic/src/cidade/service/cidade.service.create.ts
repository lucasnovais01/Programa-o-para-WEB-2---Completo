import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConverterCidade } from '../dto/converter/cidade.converter';
import { CidadeRequest } from '../dto/request/cidade.request';
//import { tabelaCidade } from './tabela.service';
import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CidadeServiceCreate {
  //private cidades = tabelaCidade;

  constructor(
    @InjectRepository(Cidade)
    private cidadeRepository: Repository<Cidade>,
  ) {}

  async create(cidadeRequest: CidadeRequest) {
    const cidade = ConverterCidade.toCidade(cidadeRequest);

    const cidadeCadastrada = await this.cidadeRepository
      .createQueryBuilder('cidade')
      .where('cidade.nomeCidade =:nome', { nome: cidade.nomeCidade })
      .getOne();

    if (cidadeCadastrada) {
      throw new HttpException(
        'A cidade com o nome informado já está cadastrada',
        HttpStatus.BAD_REQUEST,
      );
    }

    return null;
  }
}
/*
create(cidadeRequest: CidadeRequest) {
  const cidade = ConverterCidade.toCidade(cidadeRequest);

  const newIdCidade = this.cidades.length + 1;

  const newCidade = {
    ...cidade,
    idCidade: newIdCidade,
  };

  this.cidades.push(newCidade);

  const cidadeResponse = ConverterCidade.toCidadeResponse(newCidade);

  return cidadeResponse;
}
*/

/*
function getOne() {
  throw new Error('Function not implemented.');
}
*/
/*
    const cidade = ConverterCidade.toCidade(cidadeRequest);
    const cidadeResponse = ConverterCidade.toCidadeResponse(cidade);
    return cidadeResponse;
*/
