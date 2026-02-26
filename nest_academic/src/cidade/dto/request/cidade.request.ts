import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
//
//
//
import { CIDADE } from 'src/cidade/constants/cidade.constants';
//
//
//
export class CidadeRequest {
  @Type(() => Number)
  @IsOptional()
  //
  // Para o swagger (criar uma documentação oficial online, para o)
  //
  // NOVO SEMESTRE
  @ApiProperty({ description: CIDADE.SWAGGER.ID_CIDADE, example: '1' })

  // SEMESTRE PASSADO ABAIXO:
  //
  //
  idCidade?: number;
  //
  //
  //
  // antigo: @IsNotEmpty({ message: 'Código da ciadade deve ser informado' })
  // antigo: @IsString({ message: 'o valor tem que ser somente texto' })
  @IsNotEmpty({ message: 'CIDADE.INPUT_ERROR.COD_CIDADE.BLANK' })
  @IsString({ message: 'CIDADE.INPUT_ERROR.COD_CIDADE.STRING' })
  //
  @MaxLength(10, {
    message: 'O tamanho máximo é de 10 caracteres para o campo',
  })
  //
  // NOVO SEMESTRE
  @ApiProperty({ description: CIDADE.SWAGGER.ID_CIDADE, example: '1' })

  // SEMESTRE PASSADO ABAIXO:
  //
  //
  codCidade: string = '';
  //
  //
  //
  @IsNotEmpty({ message: 'Nome da ciadade deve ser informado' })
  @IsString({ message: 'A informação só pode conter somente texto' })
  @MaxLength(50, {
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
