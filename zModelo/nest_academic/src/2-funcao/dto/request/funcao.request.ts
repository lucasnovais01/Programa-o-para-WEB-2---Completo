import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FuncaoRequest {
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'Código da função deve ser número' })
  // Código da função (para updates e creates, diferente do ID auto-incremento)
  codigoFuncao?: number;

  @IsNotEmpty({ message: 'Nome da função deve ser informado' })
  @IsString({ message: 'Nome deve conter somente texto' })
  @MaxLength(60, { message: 'Nome deve ter no máximo 60 caracteres' })
  // Nome da função obrigatório (ex: 'Recepcionista').
  nomeFuncao: string = '';

  @IsOptional()
  @IsString({ message: 'Descrição deve conter somente texto' })
  @MaxLength(200, { message: 'Descrição deve ter no máximo 200 caracteres' })
  // Descrição opcional da função
  descricao?: string;

  @Type(() => Number)
  @IsNotEmpty({ message: 'Nível de acesso deve ser informado' })
  @IsNumber({}, { message: 'Nível de acesso deve ser número' })
  @IsIn([1, 2, 3], { message: 'Nível de acesso inválido: deve ser 1, 2 ou 3' })
  // Nível de acesso obrigatório: 1=Básico, 2=Intermediário, 3=Gerencial
  nivelAcesso: number = 1;

  // Construtor para inicialização parcial.
  constructor(data: Partial<FuncaoRequest> = {}) {
    Object.assign(this, data);
  }
}
