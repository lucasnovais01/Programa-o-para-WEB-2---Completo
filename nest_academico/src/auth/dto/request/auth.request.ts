import { AUTH } from '@/auth/constants/auth.constants';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthRequest {
  @IsEmail({}, { message: AUTH.INPUT_ERROR.EMAIL_USUARIO.VALID })
  @IsNotEmpty({ message: AUTH.INPUT_ERROR.EMAIL_USUARIO.BLANK })
  @ApiProperty({
    description: AUTH.SWAGGER.EMAIL_USUARIO,
    example: 'joao.silva@example.com',
  })
  emailUsuario: string = '';

  @IsNotEmpty({ message: AUTH.INPUT_ERROR.SENHA_USUARIO.BLANK })
  @IsString({ message: AUTH.INPUT_ERROR.SENHA_USUARIO.STRING })
  @ApiProperty({
    description: AUTH.SWAGGER.SENHA_USUARIO,
    example: 'senha123',
  })
  senhaUsuario: string = '';

  constructor(data: Partial<AuthRequest> = {}) {
    Object.assign(this, data);
  }
}
