import { CidadeServiceRemove } from "../service/cidade.service.remove";
export declare class CidadeControllerRemove {
    private readonly cidadeServiceRemove;
    constructor(cidadeServiceRemove: CidadeServiceRemove);
    remove(id: number): {
        idCidade: number;
        codCidade: string;
        nomeCidade: string;
    }[];
}
