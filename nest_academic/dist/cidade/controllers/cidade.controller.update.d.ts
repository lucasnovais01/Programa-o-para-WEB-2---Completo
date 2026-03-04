import type { Request } from 'express';
import { Result } from '../../commons/mensagem/mensagem';
import { CidadeRequest } from '../dto/request/cidade.request';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceUpdate } from '../service/cidade.service.update';
export declare class CidadeControllerUpdate {
    private readonly cidadeServiceUpdate;
    constructor(cidadeServiceUpdate: CidadeServiceUpdate);
    update(res: Request, id: number, cidadeRequest: CidadeRequest): Promise<Result<CidadeResponse>>;
}
