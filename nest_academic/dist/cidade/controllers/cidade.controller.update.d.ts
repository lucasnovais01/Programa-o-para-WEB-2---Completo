import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeServiceUpdate } from '../service/cidade.service.update';
import type { Request } from 'express';
import { Result } from 'src/commons/mensagem/mensagem';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeControllerUpdate {
    private readonly cidadeServiceUpdate;
    constructor(cidadeServiceUpdate: CidadeServiceUpdate);
    update(res: Request, id: number, cidadeRequest: CidadeRequest): Promise<Result<CidadeResponse>>;
}
