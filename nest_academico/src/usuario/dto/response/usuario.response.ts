import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { USUARIO } from '../../constants/usuario.constants';

export class UsuarioResponse {
  @ApiProperty({ description: USUARIO.SWAGGER.ID_USUARIO, example: '1' })
  @Expose()
  idUsuario?: number;

  @ApiProperty({
    description: USUARIO.SWAGGER.NOME_USUARIO,
    example: 'João',
  })
  @Expose()
  nomeUsuario: string = '';

  @ApiProperty({
    description: USUARIO.SWAGGER.SOBRENOME_USUARIO,
    example: 'Silva',
  })
  @Expose()
  sobrenomeUsuario: string = '';

  @ApiProperty({
    description: USUARIO.SWAGGER.EMAIL_USUARIO,
    example: 'joao.silva@uni.com',
  })
  @Expose()
  emailUsuario: string = '';

  @ApiProperty({
    description: USUARIO.SWAGGER.SENHA_USUARIO,
    example: 'senha123',
  })
  @Expose()
  senhaUsuario: string = '';
}
