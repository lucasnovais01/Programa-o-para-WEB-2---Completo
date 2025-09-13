import { BaseEntity } from 'typeorm';
export declare class Cidade extends BaseEntity {
    idCidade?: number;
    codCidade: string;
    nomeCidade: string;
    constructor(data?: Partial<Cidade>);
}
