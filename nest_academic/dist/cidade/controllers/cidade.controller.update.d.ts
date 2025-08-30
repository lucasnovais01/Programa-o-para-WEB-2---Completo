import { CidadeRequest } from "../dto/request/cidade.request";
import { CidadeServiceUpdate } from "../service/cidade.service.update";
export declare class CidadeControllerUpdate {
    private readonly cidadeServiceUpdate;
    constructor(cidadeServiceUpdate: CidadeServiceUpdate);
    update(id: number, cidadeRequest: CidadeRequest): import("../dto/response/cidade.response").CidadeResponse;
}
