import { CidadeServiceFindOne } from '../service/cidade.service.findone';
export declare class CidadeControllerFindOne {
    private readonly cidadeServiceFindOne;
    constructor(cidadeServiceFindOne: CidadeServiceFindOne);
    findOne(id: number): null;
}
