import { Repository } from 'typeorm';
import { CidadeResponse } from '../dto/response/cidade.response';
import { Cidade } from '../entity/cidade.entity';
export declare class CidadeServiceFindAll {
    private cidadeRepository;
    constructor(cidadeRepository: Repository<Cidade>);
    findAll(page: number, pageSize: number, props: string, order: 'ASC' | 'DESC'): Promise<CidadeResponse[]>;
}
