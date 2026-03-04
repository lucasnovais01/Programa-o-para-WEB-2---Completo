import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { CIDADE } from '../../constants/cidade.constants';

export class CidadeRequest {
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ description: CIDADE.SWAGGER.ID_CIDADE, example: '1' })
  idCidade?: number;

  @IsNotEmpty({ message: CIDADE.INPUT_ERROR.COD_CIDADE.BLANK })
  @IsString({ message: CIDADE.INPUT_ERROR.COD_CIDADE.STRING })
  @MaxLength(10, {
    message: 'O tamanho máximo é de 10 caracteres para o código da cidade',
  })
  @ApiProperty({ description: CIDADE.SWAGGER.COD_CIDADE, example: 'COD120' })
  codCidade: string = '';

  @IsNotEmpty({ message: 'Nome da cidade deve ser informado' })
  @IsString({ message: 'A informação só pode conter texto' })
  @MaxLength(50, {
    message: 'O tamanho máximo é de 50 caracteres para o nome da cidade',
  })
  @ApiProperty({ description: CIDADE.SWAGGER.NOME_CIDADE, example: 'Birigui' })
  nomeCidade: string = '';

  constructor(data: Partial<CidadeRequest> = {}) {
    Object.assign(this, data);
  }
}
