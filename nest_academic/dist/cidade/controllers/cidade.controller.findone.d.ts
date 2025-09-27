import { CidadeServiceFindOne } from '../service/cidade.service.findone';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Result } from 'src/commons/mensagem/mensagem';
import type { Request } from 'express';
export declare class CidadeControllerFindOne {
    private readonly cidadeServiceFindOne;
    constructor(cidadeServiceFindOne: CidadeServiceFindOne);
    findOne(req: Request, id: number): Promise<Result<CidadeResponse | null>>;
}
