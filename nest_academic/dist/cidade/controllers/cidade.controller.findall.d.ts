import type { Request } from 'express';
import { Result } from '../../commons/mensagem/mensagem';
import { CidadeResponse } from '../dto/response/cidade.response';
import { CidadeServiceFindAll } from '../service/cidade.service.findall';
import { Page } from 'src/commons/pagination/page.sistema';
export declare class CidadeControllerFindAll {
    private readonly cidadeServiceFindAll;
    constructor(cidadeServiceFindAll: CidadeServiceFindAll);
    findAll(req: Request, page?: string, pageSize?: string, props?: string, order?: 'ASC' | 'DESC', search?: string): Promise<Result<Page<CidadeResponse>>>;
}
