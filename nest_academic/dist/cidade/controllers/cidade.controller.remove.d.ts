import { CidadeServiceRemove } from '../service/cidade.service.remove';
export declare class CidadeControllerRemove {
    private readonly cidadeServiceRemove;
    constructor(cidadeServiceRemove: CidadeServiceRemove);
    remove(id: string): string;
}
