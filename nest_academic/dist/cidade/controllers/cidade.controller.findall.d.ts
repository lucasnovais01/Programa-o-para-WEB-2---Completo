import { CidadeServiceFindAll } from "../service/cidade.service.findall";
export declare class CidadeControllerFindAll {
    private readonly cidadeServiceFindAll;
    constructor(cidadeServiceFindAll: CidadeServiceFindAll);
    findAll(): string;
}
