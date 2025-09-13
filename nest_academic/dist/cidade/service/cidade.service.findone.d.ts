import { Repository } from 'typeorm';
import { Cidade } from '../entity/cidade.entity';
export declare class CidadeServiceFindOne {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    findById(idCidade: number): Promise<Cidade | null>;
}
