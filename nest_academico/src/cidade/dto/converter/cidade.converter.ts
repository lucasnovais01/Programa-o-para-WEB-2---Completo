import { plainToInstance } from 'class-transformer';

import { CidadeRequest } from '../request/cidade.request';
import { CidadeResponse } from '../response/cidade.response';
import { Cidade } from '../../entity/cidade.entity';

export class ConverterCidade {
  static toCidade(cidadeRequest: CidadeRequest): Cidade {
    const cidade = new Cidade(); // cria instância

    if (cidadeRequest.idCidade != null) {
      cidade.idCidade = cidadeRequest.idCidade;
    }
    cidade.nomeCidade = cidadeRequest.nomeCidade;
    cidade.codCidade = cidadeRequest.codCidade;

    return cidade; // letra minúscula para retorna o objeto
  }

  static toCidadeResponse(cidade: Cidade): CidadeResponse {
    return plainToInstance(CidadeResponse, cidade, {
      excludeExtraneousValues: true,
    });
  }

  static toListCidadeResponse(cidades: Cidade[] = []): CidadeResponse[] {
    return plainToInstance(CidadeResponse, cidades, {
      excludeExtraneousValues: true,
    });
  }
}
