import type { Request } from 'express';
import { Result } from '../../commons/mensagem/mensagem';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceCreate } from '../service/cidade.service.create';
export declare class CidadeControllerCreate {
    private readonly cidadeServiceCreate;
    constructor(cidadeServiceCreate: CidadeServiceCreate);
    create(res: Request, cidadeRequest: CidadeRequest): Promise<Result<CidadeResponse>>;
}
