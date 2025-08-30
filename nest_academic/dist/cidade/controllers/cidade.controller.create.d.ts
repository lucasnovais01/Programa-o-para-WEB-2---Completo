import { CidadeRequest } from "../dto/request/cidade.request";
import { CidadeServiceCreate } from "../service/cidade.service.create";
export declare class CidadeControllerCreate {
    private readonly cidadeServiceCreate;
    constructor(cidadeServiceCreate: CidadeServiceCreate);
    create(cidadeRequest: CidadeRequest): import("../dto/response/cidade.response").CidadeResponse;
}
