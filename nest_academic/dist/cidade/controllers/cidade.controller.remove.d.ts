import { CidadeServiceRemove } from '../service/cidade.service.remove';
import { Result } from 'src/commons/mensagem/mensagem';
import type { Request } from 'express';
export declare class CidadeControllerRemove {
    private readonly cidadeServiceRemove;
    constructor(cidadeServiceRemove: CidadeServiceRemove);
    remove(res: Request, id: number): Promise<Result<void>>;
}
