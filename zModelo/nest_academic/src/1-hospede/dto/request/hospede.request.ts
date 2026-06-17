import {
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO de requisição para Hospede.
 * Valida dados de entrada para create/update no controller.
 * - Baseado nas constraints do DDL de COCAO_HOSPEDE.
 * - Usa class-validator para regras (NOT NULL, lengths, regex, etc.).
 * - Campos opcionais: rg, email, telefone.
 * - Defaults no DDL (tipo=0, ativo=1) são validados, mas permitidos vazios se não enviados.
 * Observações:
 * - Validações regex alinhadas ao CHECK no banco (ex.: CPF 11 dígitos).
 * - Datas: Transformadas via @Type(() => Date).
 * - Erros: Mensagens customizadas para usuário.
 */

/*
 * Diferenças em relação ao modelo antigo ('CidadeRequest'):
 * 1. Mais campos e validações: Antigo simples (2 strings obrigatórias). Aqui, incluímos dates, numbers, regex (CPF/RG/email/telefone), enums (sexo/tipo/ativo), email validation.
 * 2. @Type: Expandido para numbers e dates (ex.: @Type(() => Date) para dataNascimento).
 * 3. Regex/Checks: Adicionados @Matches para constraints do DDL (ausente no antigo).
 * 4. Opcionais: Mais uso de @IsOptional + '?' para campos NULLABLE.
 * 5. Construtor: Mantido com Object.assign para inicialização parcial.
 */

export class HospedeRequest {
  @Type(() => Number)
  @IsOptional()
  // ID opcional (para updates; gerado pelo banco em creates).
  idUsuario?: number;

  @IsNotEmpty({ message: 'Nome do hóspede deve ser informado' })
  @IsString({ message: 'Nome deve conter somente texto' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  // Nome obrigatório.
  nomeHospede: string = '';

  @IsNotEmpty({ message: 'CPF deve ser informado' })
  @IsString({ message: 'CPF deve conter somente dígitos' })
  @Length(11, 11, { message: 'CPF deve ter exatamente 11 dígitos' })
  @Matches(/^[0-9]{11}$/, { message: 'CPF inválido: apenas dígitos' })
  // CPF obrigatório, 11 dígitos.
  cpf: string = '';

  @IsOptional()
  @IsString({ message: 'RG deve conter texto válido' })
  @MaxLength(20, { message: 'RG deve ter no máximo 20 caracteres' })
  @Matches(/^[0-9A-Za-z\\-]{7,9}$/, {
    message: 'RG inválido: 7-9 chars alfanuméricos com -',
  })
  // RG opcional.
  rg?: string;

  @IsNotEmpty({ message: 'Sexo deve ser informado' })
  @IsString({ message: 'Sexo deve ser "M", "F" ou "O"' })
  @Matches(/^[MFO]$/, { message: 'Sexo inválido: apenas "M", "F" ou "O"' })
  // Sexo obrigatório.
  sexo: string = '';

  @Type(() => Date)
  @IsNotEmpty({ message: 'Data de nascimento deve ser informada' })
  @IsDate({ message: 'Data de nascimento inválida' })
  // Data de nascimento obrigatória.
  dataNascimento: Date = new Date();

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(100, { message: 'Email deve ter no máximo 100 caracteres' })
  // Email opcional.
  email?: string;

  @IsOptional()
  @IsString({ message: 'Telefone deve conter texto válido' })
  @MaxLength(20, { message: 'Telefone deve ter no máximo 20 caracteres' })
  @Matches(/^[0-9\s\-\\(\\)]+$/, {
    message: 'Telefone inválido: apenas dígitos, espaços, - ou ()',
  })
  // Telefone opcional.
  telefone?: string;

  @Type(() => Number)
  @IsNotEmpty({ message: 'Tipo deve ser informado' })
  @IsNumber({}, { message: 'Tipo deve ser número' })
  @IsIn([0, 1], { message: 'Tipo inválido: 0 (hóspede) ou 1 (funcionário)' })
  // Tipo obrigatório (0 ou 1).
  tipo: number = 0;

  @Type(() => Number)
  @IsNotEmpty({ message: 'Ativo deve ser informado' })
  @IsNumber({}, { message: 'Ativo deve ser número' })
  @IsIn([0, 1], { message: 'Ativo inválido: 0 ou 1' })
  // Ativo obrigatório (0 ou 1).
  ativo: number = 1;

  // Construtor para inicialização parcial.
  // Exemplo: new HospedeRequest({ nomeHospede: 'João' });
  constructor(data: Partial<HospedeRequest> = {}) {
    Object.assign(this, data);
  }
}

/**
 * ==============================================================
 * TUTORIAL RÁPIDO: hospede.request.ts
 * ==============================================================
 
 * O que é?
 *   - DTO para requisições de entrada (create/update).
 *   - Valida dados do body via class-validator.

 * Para que serve?
 *   - Garante dados válidos antes de chegar ao service/banco.
 *   - Integra com NestJS: Use em controllers (@Body() dto: HospedeRequest).
 *   - Alinha validações ao DDL (lengths, regex, required).

 * Dicas:
 *   - Erros automáticos: Nest lança ValidationPipe exceptions.
 *   - Expanda com mais rules se precisar (ex.: custom validators).
 *   - Use com converter para mapear request → entity.
 * 
 * ==============================================================
 */
