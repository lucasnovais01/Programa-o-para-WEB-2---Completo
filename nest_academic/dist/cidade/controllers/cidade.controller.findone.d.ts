import { CidadeServiceFindOne } from '../service/cidade.service.findone';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeControllerFindOne {
    private readonly cidadeServiceFindOne;
    constructor(cidadeServiceFindOne: CidadeServiceFindOne);
    findOne(id: number): Promise<CidadeResponse | null>;
}
