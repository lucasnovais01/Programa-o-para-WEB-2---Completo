/*
O problema é o mesmo do request, era quê: tinha duas definições duplicadas e a classe está sendo fechada e reaberta no meio. 
Provavelmente colou duas vezes. Além disso, a senha nunca deve ser exposta no response!

*/

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AUTH } from '../../constants/auth.constants';

export class AuthResponse {
  @ApiProperty({
    description: AUTH.SWAGGER.EMAIL_USUARIO,
    example: 'joao.silva@example.com',
  })
  @Expose()
  emailUsuario: string = '';

  // SENHA NUNCA deve ser exposta no response!
  // campo senhaUsuario daqui. Removido para garantir a segurança dos dados do usuário.

  @ApiProperty({
    description: AUTH.SWAGGER.TOKEN_JWT,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpvw6NvIFNpbHZhIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @Expose()
  tokenJWT: string = '';
  // O response de login deve retornar o token JWT, não a senha.
}
