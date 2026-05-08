import { Usuario } from '@/usuario/entity/usuario.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

// O injectable serve para ..
@Injectable()
export class AuthService {
  constructor(private readonly usuarioRepository: Repository<Usuario>) {}

  async getAuthenticatedUser(email: string, senha: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findByEmail();
    await this.virificarSenha(senha, usuario.senha);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuari')
      .where('usuario.email_usuario = :email', { email })
      .getOne();

    if (!usuario) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    return usuario;
  }

  async verificarSenha(senha: string, hashedSenha: string): Promise<boolean> {
    const isSenhaMatching = await bcrypt.compare(senha, hashedSenha);

    if (!IsSenhaMatching) {
      throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
}
