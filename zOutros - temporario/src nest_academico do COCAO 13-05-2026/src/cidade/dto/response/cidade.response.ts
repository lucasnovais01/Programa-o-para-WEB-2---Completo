import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CIDADE } from '../../constants/cidade.constants';

export class CidadeResponse {
  @ApiProperty({ description: CIDADE.SWAGGER.ID_CIDADE, example: '1' })
  @Expose()
  idCidade?: number;

  @ApiProperty({ description: CIDADE.SWAGGER.COD_CIDADE, example: 'COD120' })
  @Expose()
  codCidade: string = '';

  @ApiProperty({ description: CIDADE.SWAGGER.NOME_CIDADE, example: 'Birigui ' })
  @Expose()
  nomeCidade: string = '';
}
