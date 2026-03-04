import type { Request } from 'express';
import { Result } from '../../commons/mensagem/mensagem';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceFindOne } from '../service/cidade.service.findone';
export declare class CidadeControllerFindOne {
    private readonly cidadeServiceFindOne;
    constructor(cidadeServiceFindOne: CidadeServiceFindOne);
    findOne(req: Request, id: number): Promise<Result<CidadeResponse>>;
}
