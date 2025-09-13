import { Cidade } from '../entity/cidade.entity';
import { Repository } from 'typeorm';
export declare class CidadeServiceRemove {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    remove(idCidade: number): Promise<void>;
}
