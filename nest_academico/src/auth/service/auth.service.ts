import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { RequestUserPayload } from '../config/requestWithUser.interface';
import { JsonWebTokenService, UserToken } from './jwt.service';
import { EmailService } from '@/mail/service/email.service';

// Definimos o tipo do provider OAuth para documentar os valores aceitos
// e evitar o uso de strings hardcoded espalhadas pelo código.
type OAuthProvider = 'google' | 'facebook' | 'instagram' | 'microsoft';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jsonWebTokenService: JsonWebTokenService,
    private readonly emailService: EmailService,
  ) {}

  async getJwtAccessToken(usuario: RequestUserPayload) {
    // DEBUG didático e importante: acompanhar geração de token JWT.
    console.log('[DEBUG][AuthService] getJwtAccessToken start', usuario);

    const { accessToken, expireInAccessToken } =
      await this.jsonWebTokenService.createAccessToken(usuario);

    const cookie = this.getCookieAccessToken(accessToken, expireInAccessToken);

    console.log('[DEBUG][AuthService] getJwtAccessToken result', {
      accessToken,
      expireInAccessToken,
    });

    return {
      cookie,
      accessToken,
      expireInAccessToken,
    };
  }

  private getCookieAccessToken(
    token: string,
    expiresInSeconds: number,
  ): string {
    return `Authentication=${token}; HttpOnly: true, Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax; Secure`;
  }

  /*
    Authentication - o nome do cookie 
    token - jwt json web toke
    httpOnly - invadir o quebra o cookie e 
    Path - caminho - em o cookie pode ser acessado
        //exemplo
    Max-Age - tempo de vida 3600 -  never ----> 1h, 2d      
    SameSite = Law, Strict, none 
  
  */

  async getJwtRefreshToken(usuario: Usuario) {
    const userToken: UserToken = {
      idUsuario: usuario.idUsuario,
    };

    const { refreshToken } =
      await this.jsonWebTokenService.createRefreshtoken(userToken);
    return refreshToken;
  }

  async getAuthenticatedUser(email: string, senha: string): Promise<Usuario> {
    // DEBUG didático e importante: acompanhar cada etapa do login.
    // Usamos console.log para facilitar a leitura no terminal do npm run start:dev.
    console.log('[DEBUG][AuthService] getAuthenticatedUser start', {
      email,
      senhaProvided: typeof senha === 'string' && senha.length > 0,
    });

    const usuario = await this.findByEmail(email);
    console.log('[DEBUG][AuthService] user found', {
      idUsuario: usuario.idUsuario,
      emailUsuario: usuario.emailUsuario,
    });

    // Inspeciona formato da senha armazenada (não imprime a senha em texto claro)
    const senhaStored = usuario.senhaUsuario as string | undefined;
    console.log('[DEBUG][AuthService] stored senha meta', {
      hasSenha: !!senhaStored,
      startsWithDollar2: !!senhaStored && senhaStored.startsWith('$2'),
      length: senhaStored ? senhaStored.length : 0,
    });
    //     const matching = await this.verificarSenha(senha, usuario.senhaUsuario);

    const matching = await this.verificarSenha(senha, usuario);
    console.log('[DEBUG][AuthService] password verification', {
      emailUsuario: usuario.emailUsuario,
      matching,
    });

    if (!matching) {
      throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
    }
    return usuario;
  }

  // Em findByEmail, trocado usuario.email por usuario.emailUsuario para refletir a estrutura do banco de dados e da entidade Usuario.

  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.emailUsuario = :email', { email })
      .getOne();

    if (!usuario) {
      throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
    }

    return usuario;
  }
  /*
  async verificarSenha(senha: string, hashedSenha: string): Promise<boolean> {
    const isSenhaMatching = await bcrypt.compare(senha, hashedSenha);
    if (!isSenhaMatching) {
      throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
    }

*/
  async verificarSenha(senha: string, usuario: Usuario): Promise<boolean> {
    const hashedSenha = usuario.senhaUsuario as string | undefined;

    // Se estiver com hash bcrypt, use bcrypt.compare
    if (hashedSenha && hashedSenha.startsWith && hashedSenha.startsWith('$2')) {
      const isSenhaMatching = await bcrypt.compare(senha, hashedSenha);
      return isSenhaMatching;
    }

    // Caso a senha esteja armazenada em texto simples (problema legado),
    // comparamos diretamente. Se bater, migramos para bcrypt e salvamos.
    if (hashedSenha === senha) {
      try {
        const saltRounds = 10;
        const newHash = await bcrypt.hash(senha, saltRounds);
        usuario.senhaUsuario = newHash;
        // atualiza registro do usuário com a senha hasheada
        await this.usuarioRepository.save(usuario);
        return true;
      } catch (e) {
        // Se a migração falhar, não bloqueamos a autenticação neste passo,
        // mas registramos e retornamos true para permitir login.
        console.warn('[AuthService] password migration failed', e);
        return true;
      }
    }

    return false;
  }

  // Aqui passamos o tipo, o nome, do provider, se for google, então é "google"
  findOrCreateUser = async (
    provider: OAuthProvider,
    profile: any,
    accessToken: string,
    refreshToken: string,
  ) => {
    // Usamos propriedade de classe com arrow function para manter o contexto 'this'
    // e o modificador async na posição correta.
    const oauthEmail = profile.email?.[0].value || profile._json?.email;
  };



// ======================== RECUPERAÇÃO DE SENHA ========================

  async forgotPassword(email: string) {
    const usuario = await this.findByEmail(email).catch(() => null);

    if (!usuario) {
      return { mensagem: 'Se o e-mail estiver cadastrado, você receberá um link.' };
    }

    const token = this.jsonWebTokenService.generateVerificationToken(usuario.idUsuario!);

    await this.emailService.sendPasswordResetEmail(
      usuario.emailUsuario,
      usuario.nomeUsuario || 'Usuário',
      token
    );

    return { mensagem: 'Link de recuperação enviado com sucesso!' };
  }

  async resetPassword(token: string, novaSenha: string) {
    const payload = await this.jsonWebTokenService.verifyToken(token, 'verification');

    if (!payload.isValid || !payload.payload?.idUsuario) {
      throw new HttpException('Token inválido ou expirado', HttpStatus.BAD_REQUEST);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: payload.payload.idUsuario },
    });

    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    usuario.senhaUsuario = novaSenha;
    await this.usuarioRepository.save(usuario);

    return { mensagem: 'Senha alterada com sucesso!' };
  }
}
