import { CidadeRequest } from "../dto/request/cidade.request";
export declare class CidadeServiceUpdate {
    private cidades;
    constructor();
    update(id: string, cidadeRequest: CidadeRequest): import("../dto/response/cidade.response").CidadeResponse;
}
