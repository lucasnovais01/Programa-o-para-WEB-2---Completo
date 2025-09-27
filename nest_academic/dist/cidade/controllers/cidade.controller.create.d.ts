import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeServiceCreate } from '../service/cidade.service.create';
import { CidadeResponse } from '../dto/response/cidade.response';
import type { Request } from 'express';
import { Result } from 'src/commons/mensagem/mensagem';
export declare class CidadeControllerCreate {
    private readonly cidadeServiceCreate;
    constructor(cidadeServiceCreate: CidadeServiceCreate);
    create(res: Request, cidadeRequest: CidadeRequest): Promise<Result<CidadeResponse>>;
}
