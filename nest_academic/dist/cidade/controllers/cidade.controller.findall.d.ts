import { CidadeServiceFindAll } from '../service/cidade.service.findall';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeControllerFindAll {
    private readonly cidadeServiceFindAll;
    constructor(cidadeServiceFindAll: CidadeServiceFindAll);
    findAll(): Promise<CidadeResponse[]>;
}
