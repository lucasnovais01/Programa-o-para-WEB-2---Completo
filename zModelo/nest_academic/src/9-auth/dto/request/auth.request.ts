import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ForgotPasswordRequest {
  @IsNotEmpty({ message: 'Email deve ser informado' })
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(150)
  email: string = '';
}

export class ResetPasswordRequest {
  @IsNotEmpty({ message: 'Token deve ser informado' })
  @IsString()
  token: string = '';

  @IsNotEmpty({ message: 'Nova senha deve ser informada' })
  @IsString()
  @MaxLength(255)
  newPassword: string = '';
}
