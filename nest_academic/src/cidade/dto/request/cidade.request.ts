import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CidadeRequest {
  @Type(() => Number)
  @IsOptional()
  idCidade?: number;

  @IsNotEmpty({ message: 'Código da ciadade deve ser informado' })
  @IsString({ message: 'o valor tem que ser somente texto' })
  @MaxLength(10, {
    message: 'O tamanho máximo é de 10 caracteres para o campo',
  })
  codCidade: string = '';

  @IsNotEmpty({ message: 'Nome da ciadade deve ser informado' })
  @IsString({ message: 'A informação só pode conter somente texto' })
  @MaxLength(10, {
    message: 'O tamanho máximo é de 10 caracteres para o nome da cidade',
  })
  nomeCidade: string = '';

  constructor(data: Partial<CidadeRequest> = {}) {
    Object.assign(this, data);

    /*this.codCidade = data.codCidade;
    this.nomeCidade = data.nomeCidade;*/
  }
}

// Quandos se coloca ? na variável em typescript, diz que ela não é obrigatória
