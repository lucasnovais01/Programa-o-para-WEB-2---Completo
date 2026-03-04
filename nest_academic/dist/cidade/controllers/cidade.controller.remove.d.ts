import type { Request } from 'express';
import { Result } from '../../commons/mensagem/mensagem';
import { CidadeServiceRemove } from '../service/cidade.service.remove';
export declare class CidadeControllerRemove {
    private readonly cidadeServiceRemove;
    constructor(cidadeServiceRemove: CidadeServiceRemove);
    remove(res: Request, id: number): Promise<Result<void>>;
}
