import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '@/usuario/entity/usuario.entity';
import { JsonWebTokenService } from './jwt.service';
import * as bcrypt from 'bcrypt';

// O injectable serve para ..
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jsonWebTokenService: JsonWebTokenService,
  ) {}

  async getJwtAccessToken(usuario: Usuario) {
    const { accessToken, expireInAccessToken } =
      await this.jsonWebTokenService.createAccessToken(usuario);
    return accessToken;

    const cookie = this.getCookieAccessToken(accessToken, expireInAccessToken);
    // throw new Error('Method not implemented.');
  }

  private getCookieAccessToken(
    token: string,
    expiresInSeconds: number,
  ): string {
    return `Refresh=${token}; HttpOnly: true, Path=/; Max-Age=${expiresInSeconds}; SameSite=Strict`;
  } // ele vai receber o token e o dado

  async getJwtRefreshToken(usuario: Usuario) {
    const userToken: UserToken = {
      idUsuario: usuario.idUsuario,
    };

    const { refreshToken } =
      await this.jsonWebTokenService.createRefreshToken(userToken); // deixar o userToken em ez de Usuario, para deixar mais didático
    return refreshToken;
  }

  async getAuthenticatedUser(email: string, senha: string): Promise<Usuario> {
    //const usuario = await this.usuarioRepository.findByEmail();
    const usuario = await this.findByEmail(email);
    await this.verificarSenha(senha, usuario.senha);

    return usuario;
  }
  /*
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
*/
  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario') // ← corrigido
      .where('usuario.email_usuario = :email', { email })
      .getOne();

    if (!usuario) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    return usuario;
  }

  async verificarSenha(senha: string, hashedSenha: string): Promise<boolean> {
    const isSenhaMatching = await bcrypt.compare(senha, hashedSenha);

    if (!isSenhaMatching) {
      throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
    }
    return true;
  }
}
