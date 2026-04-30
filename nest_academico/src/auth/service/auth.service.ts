import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Auth } from '../entity/auth.entity';
import { AuthRequest } from '../dto/request/auth.request';
import { AuthResponse } from '../dto/response/auth.response';
import { ConverterAuth } from '../dto/converter/auth.converter';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async login(authRequest: AuthRequest): Promise<AuthResponse> {
    // 1Busca o usuário pelo email
    const auth = await this.findByEmail(authRequest.emailUsuario);

    if (!auth) {
      // Mensagem genérica, não revela se o email existe ou não
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 2Compara a senha digitada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(
      authRequest.senhaUsuario, // senha que o usuário digitou (texto puro)
      auth.senhaUsuario, // hash que está no banco
    );

    if (!senhaCorreta) {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 3️⃣ Converte para response (sem expor a senha)
    return ConverterAuth.toAuthResponse(auth);
  }

  // Busca por email, não por ID
  private async findByEmail(emailUsuario: string): Promise<Auth | null> {
    return this.authRepository
      .createQueryBuilder('auth')
      .where('auth.EMAIL = :emailUsuario', { emailUsuario })
      .getOne();
  }
}
