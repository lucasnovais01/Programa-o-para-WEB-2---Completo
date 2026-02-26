import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CIDADE } from 'src/cidade/constants/cidade.constants';

export class CidadeResponse {
  // Todo campo que é permitido ao cliente ver
  //
  //
  // Novo Semestre
  @ApiProperty({ description: CIDADE.SWAGGER.ID_CIDADE, example: '1' })
  //
  @Expose()
  idCidade?: number;

  // Novo Semestre
  @ApiProperty({ description: CIDADE.SWAGGER.COD_CIDADE, example: 'COD120' })
  @Expose()
  codCidade: string = '';

  // Novo Semestre
  @ApiProperty({ description: CIDADE.SWAGGER.NOME_CIDADE, example: 'Birigui' })
  @Expose()
  nomeCidade: string = '';
}
