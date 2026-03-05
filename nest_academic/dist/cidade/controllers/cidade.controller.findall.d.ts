import type { Request } from 'express';
import { Result } from '../../commons/mensagem/mensagem';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceFindAll } from '../service/cidade.service.findall';
export declare class CidadeControllerFindAll {
    private readonly cidadeServiceFindAll;
    constructor(cidadeServiceFindAll: CidadeServiceFindAll);
    findAll(req: Request, page?: string, pageSize?: string, order?: 'ASC' | 'DESC'): Promise<Result<CidadeResponse[]>>;
}
