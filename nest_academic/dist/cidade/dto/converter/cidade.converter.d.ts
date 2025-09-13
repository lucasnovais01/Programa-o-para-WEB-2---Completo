import { Cidade } from 'src/cidade/entity/cidade.entity';
import { CidadeRequest } from '../request/cidade.request';
import { CidadeResponse } from '../response/cidade.response';
export declare class ConverterCidade {
    static ConverterCidade(cidade: Cidade): Cidade | PromiseLike<Cidade | null> | null;
    static toCidade(cidadeRequest: CidadeRequest): Cidade;
    static toCidadeResponse(cidade: Cidade): CidadeResponse;
    static toListCidadeResponse(cidades?: Cidade[]): CidadeResponse[];
}
