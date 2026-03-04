import { plainToInstance } from 'class-transformer';
import { Cidade } from 'src/cidade/entity/cidade.entity';
import { CidadeRequest } from '../request/cidade.request';
import { CidadeResponse } from '../response/cidade.response';

export class ConverterCidade {
  static toCidade(cidadeRequest: CidadeRequest) {
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

  static toListCidadeResponse(cidades: Cidade[] = []): CidadeResponse[] {
    return plainToInstance(CidadeResponse, cidades, {
      excludeExtraneousValues: true,
    });
  }
}
