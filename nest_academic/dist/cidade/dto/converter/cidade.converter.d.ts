import { Cidade } from "src/cidade/entity/cidade.entity";
import { CidadeRequest } from "../request/cidade.request";
import { CidadeResponse } from "../response/cidade.response";
export declare class ConverterCidade {
    static toCidade(cidadeRequest: CidadeRequest): Cidade;
    static toCidadeResponse(cidade: Cidade): CidadeResponse;
}
