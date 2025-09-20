import { CidadeServiceRemove } from '../service/cidade.service.remove';
import { CidadeResponse } from '../dto/response/cidade.response';
export declare class CidadeControllerRemove {
    private readonly cidadeServiceRemove;
    constructor(cidadeServiceRemove: CidadeServiceRemove);
    remove(id: number): Promise<CidadeResponse | null>;
}
