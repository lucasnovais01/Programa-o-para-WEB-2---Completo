import { Cidade } from 'src/cidade/entity/cidade.entity';
import { CidadeRequest } from '../request/cidade.request';
import { CidadeResponse } from '../response/cidade.response';
import { plainToInstance } from 'class-transformer';

export class ConverterCidade {
  static ConverterCidade(
    cidade: Cidade,
  ): Cidade | PromiseLike<Cidade | null> | null {
    throw new Error('Method not implemented.');
  }
  /*
  static ConverterCidade(cidade: Cidade): Cidade | PromiseLike<Cidade | null> | null {
    throw new Error('Method not implemented.');
  }
  static ConverterCidade(cidade: Cidade): Cidade | PromiseLike<Cidade | null> | null {
    throw new Error('Method not implemented.');
  }
  static ConverterCidade(cidade: Cidade): Cidade | PromiseLike<Cidade | null> | null {
    throw new Error('Method not implemented.');
  }
  */
  static toCidade(cidadeRequest: CidadeRequest) {
    //vai receber o cidadeRequest, que é do tipo CidadeRequest
    const cidade = new Cidade();

    if (cidadeRequest.idCidade != null) {
      cidade.idCidade = cidadeRequest.idCidade;
    }
    cidade.nomeCidade = cidadeRequest.nomeCidade;
    cidade.codCidade = cidadeRequest.codCidade;

    return cidade;
  }
  static toCidadeResponse(cidade: Cidade): CidadeResponse {
    return plainToInstance(CidadeResponse, cidade, {
      excludeExtraneousValues: true,
    });
  }
  static toListCidadeResponse(cidades: Cidade[] = []) {
    return plainToInstance(CidadeResponse, cidades, {
      excludeExtraneousValues: true,
    });
  }
}

/*Outra forma de escrever

  static toCidadeResponse(cidade: Cidade) {
    const cidadeResponse = new CidadeResponse();

    cidadeResponse.idCidade = cidade.idCidade ?? 0;
    cidadeResponse.codCidade = cidade.codCidade;
    cidadeResponse.nomeCidade = cidade.nomeCidade;

    return cidadeResponse;
*/
