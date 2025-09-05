import { Cidade } from 'src/cidade/entity/cidade.entity';
import { CidadeRequest } from '../request/cidade.request';
import { CidadeResponse } from '../response/cidade.response';

export class ConverterCidade {
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
  static toCidadeResponse(cidade: Cidade) {
    const cidadeResponse = new CidadeResponse();

    cidadeResponse.idCidade = cidade.idCidade ?? 0;
    cidadeResponse.codCidade = cidade.codCidade;
    cidadeResponse.nomeCidade = cidade.nomeCidade;

    return cidadeResponse;
  }
}
