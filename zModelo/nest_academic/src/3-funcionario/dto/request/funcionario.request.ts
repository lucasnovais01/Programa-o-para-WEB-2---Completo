import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class FuncionarioRequest {
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'ID do usuário deve ser número' })
  idUsuario?: number;

  @Type(() => Number)
  @IsNotEmpty({ message: 'Código da função deve ser informado' })
  @IsNumber({}, { message: 'Código da função deve ser número' })
  codigoFuncao?: number;

  @IsNotEmpty({ message: 'Nome de login deve ser informado' })
  @IsString()
  @MaxLength(50)
  nomeLogin: string = '';

  @IsNotEmpty({ message: 'Senha deve ser informada' })
  @IsString()
  @MaxLength(255)
  senha: string = '';

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(150)
  email?: string;

  @IsNotEmpty({ message: 'Data de contratação deve ser informada' })
  @IsDateString({}, { message: 'Data de contratação inválida' })
  dataContratacao: string = new Date().toISOString();

  @Type(() => Number)
  @IsOptional()
  @IsIn([0, 1])
  ativo: number = 1;

  constructor(data: Partial<FuncionarioRequest> = {}) {
    Object.assign(this, data);
  }
}

export class FuncionarioUpdateRequest {
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'ID do usuário deve ser número' })
  idUsuario?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'Código da função deve ser número' })
  codigoFuncao?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nomeLogin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  senha?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de contratação inválida' })
  dataContratacao?: string;

  @Type(() => Number)
  @IsOptional()
  @IsIn([0, 1])
  ativo?: number;

  constructor(data: Partial<FuncionarioUpdateRequest> = {}) {
    Object.assign(this, data);
  }
}
