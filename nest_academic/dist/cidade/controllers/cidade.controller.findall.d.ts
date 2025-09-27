import { CidadeServiceFindAll } from '../service/cidade.service.findall';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Result } from 'src/commons/mensagem/mensagem';
import type { Request } from 'express';
export declare class CidadeControllerFindAll {
    private readonly cidadeServiceFindAll;
    constructor(cidadeServiceFindAll: CidadeServiceFindAll);
    findAll(res: Request): Promise<Result<CidadeResponse[]>>;
}
