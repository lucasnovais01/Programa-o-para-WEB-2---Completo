import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { USUARIO } from '../../constants/usuario.constants';

export class UsuarioResponse {
  @ApiProperty({ description: USUARIO.SWAGGER.ID_USUARIO, example: '1' })
  @Expose()
  idUsuario?: number;

  @ApiProperty({
    description: USUARIO.SWAGGER.NOME_USUARIO,
    example: 'João Silva',
  })
  @Expose()
  nomeUsuario: string = '';
}
