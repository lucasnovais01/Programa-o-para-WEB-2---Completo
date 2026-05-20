# Segunda Atividade — Guia Completa e Detalhada

Objetivo: transformar o seu sistema de usuário em um sistema de autenticação completo com JWT, confirmação de e-mail, recuperação de senha e proteção de rotas. Este tutorial agora contém código completo, imports, comentários e instruções passo a passo para cada arquivo.

**Pré-requisitos**
- Node.js e npm instalados
- MySQL rodando com o schema usado no projeto (veja [ScriptDoBanco3.sql](ScriptDoBanco3.sql))
- Projeto já rodando: backend em `nest_academico` e frontend em `react_academico`

**O que vamos fazer**
- Backend: criar módulo `auth`, login JWT, confirmação de e-mail, recuperação de senha
- Frontend: criar login, logout, rotas privadas, esquecer senha, reset de senha
- Banco de dados: adicionar campos de validação e recuperação
- Testes: verificar endpoints no Postman e pela UI

---

## 1. Visão geral do fluxo

O fluxo será:

1. Usuário acessa a tela de cadastro e se registra.
2. Backend cria o usuário com senha hash e gera token de confirmação de e-mail.
3. Backend envia e-mail com link de confirmação.
4. Usuário confirma o e-mail e o sistema marca `status_validacao = 1`.
5. Usuário faz login com `emailUsuario` + `senhaUsuario`.
6. Backend emite JWT e o frontend salva o token.
7. Frontend envia `Authorization: Bearer <token>` para rotas protegidas.
8. Se usuário esquecer a senha, pede recuperação e recebe link por e-mail.
9. Com token válido, usuário redefine senha.

---

## 2. Backend — passos técnicos com código completo

### 2.1 Instalar dependências

No diretório `nest_academico`, execute:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt nodemailer
npm install -D @types/passport-jwt @types/bcrypt
```

Se o projeto ainda não usa `class-validator` e `class-transformer`, instale também:

```bash
npm install class-validator class-transformer
```

---

### 2.2 Estrutura de arquivos do módulo `auth`

A autenticação não precisa de vários módulos separados. No NestJS, você deve usar um único módulo `AuthModule` quando todos os métodos lidam com o mesmo recurso — neste caso, a tabela `USUARIO`.

Crie a pasta `nest_academico/src/auth` com esta estrutura:

- `auth.module.ts`
- `auth.controller.ts`
- `auth.service.ts`
- `auth.constants.ts`
- `dto/request/login.request.ts`
- `dto/response/login.response.ts`
- `dto/request/recovery.request.ts`
- `dto/request/reset-password.request.ts`
- `dto/request/validate-email.request.ts`
- `dto/request/two-factor.request.ts`
- `guards/jwt-auth.guard.ts`
- `strategies/jwt.strategy.ts`
- `service/email.service.ts`

Esses arquivos são o núcleo da autenticação e todos pertencem ao mesmo módulo `auth`.

---

### 2.3 Constantes de autenticação

Crie `nest_academico/src/auth/constants/auth.constants.ts`:

```ts
// nest_academico/src/auth/constants/auth.constants.ts
export const JWT_SECRET = process.env.JWT_SECRET || 'CHAVE_SECRETA_ACADEMICO_2026';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
```

> Use variáveis de ambiente em produção. No desenvolvimento, a string fixa funciona.

---

### 2.4 DTOs completos

Crie `nest_academico/src/auth/dto/request/login.request.ts`:

```ts
// nest_academico/src/auth/dto/request/login.request.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  emailUsuario: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  senhaUsuario: string;
}
```

Crie `nest_academico/src/auth/dto/request/recovery.request.ts`:

```ts
// nest_academico/src/auth/dto/request/recovery.request.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoveryRequest {
  @IsEmail()
  @IsNotEmpty()
  emailUsuario: string;
}
```

Crie `nest_academico/src/auth/dto/request/reset-password.request.ts`:

```ts
// nest_academico/src/auth/dto/request/reset-password.request.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  novaSenha: string;
}
```

Crie `nest_academico/src/auth/dto/request/validate-email.request.ts`:

```ts
// nest_academico/src/auth/dto/request/validate-email.request.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateEmailRequest {
  @IsString()
  @IsNotEmpty()
  token: string;
}
```

Crie `nest_academico/src/auth/dto/request/two-factor.request.ts`:

```ts
// nest_academico/src/auth/dto/request/two-factor.request.ts
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorRequest {
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  idUsuario: number;

  @IsString()
  @IsNotEmpty()
  codigo: string;
}
```

Crie `nest_academico/src/auth/dto/response/login.response.ts`:

```ts
// nest_academico/src/auth/dto/response/login.response.ts
export class LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: {
    idUsuario: number;
    nomeUsuario: string;
    sobrenomeUsuario: string;
    emailUsuario: string;
  };
}
```

---

### 2.5 Serviço de autenticação completo

Crie `nest_academico/src/auth/service/auth.service.ts`:

```ts
// nest_academico/src/auth/service/auth.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { LoginResponse } from '../dto/response/login.response';
import { BCRYPT_SALT_ROUNDS } from '../constants/auth.constants';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(emailUsuario: string, senhaUsuario: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { emailUsuario } });
    if (!usuario) {
      throw new HttpException('E-mail ou senha inválidos.', HttpStatus.UNAUTHORIZED);
    }

    const senhaValida = await compare(senhaUsuario, usuario.senhaUsuario);
    if (!senhaValida) {
      throw new HttpException('E-mail ou senha inválidos.', HttpStatus.UNAUTHORIZED);
    }

    return usuario;
  }

  async login(emailUsuario: string, senhaUsuario: string): Promise<LoginResponse> {
    const usuario = await this.validateUser(emailUsuario, senhaUsuario);
    const payload = { sub: usuario.idUsuario, emailUsuario: usuario.emailUsuario };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
      usuario: {
        idUsuario: usuario.idUsuario,
        nomeUsuario: usuario.nomeUsuario,
        sobrenomeUsuario: usuario.sobrenomeUsuario,
        emailUsuario: usuario.emailUsuario,
      },
    };
  }

  async hashPassword(senhaUsuario: string): Promise<string> {
    return hash(senhaUsuario, BCRYPT_SALT_ROUNDS);
  }

  async changePassword(idUsuario: number, novaSenha: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }
    usuario.senhaUsuario = await this.hashPassword(novaSenha);
    await this.usuarioRepository.save(usuario);
  }

  async sendValidationEmail(idUsuario: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    usuario.emailToken = randomBytes(32).toString('hex');
    await this.usuarioRepository.save(usuario);

    const confirmationUrl = `${process.env.FRONTEND_URL}/confirmar-email?token=${usuario.emailToken}`;
    await this.emailService.sendMail(
      usuario.emailUsuario,
      'Confirme seu e-mail',
      `<p>Olá ${usuario.nomeUsuario}, clique no link para confirmar seu e-mail:</p><p><a href="${confirmationUrl}">Confirmar e-mail</a></p>`,
    );
  }

  async validateEmail(token: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { emailToken: token } });
    if (!usuario) {
      throw new HttpException('Token de confirmação inválido.', HttpStatus.BAD_REQUEST);
    }

    usuario.statusValidacao = 1;
    usuario.emailToken = null;
    await this.usuarioRepository.save(usuario);
  }

  async requestPasswordRecovery(emailUsuario: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { emailUsuario } });
    if (!usuario) {
      return;
    }

    usuario.recoveryToken = randomBytes(32).toString('hex');
    usuario.tokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    await this.usuarioRepository.save(usuario);

    const recoveryUrl = `${process.env.FRONTEND_URL}/resetar-senha?token=${usuario.recoveryToken}`;
    await this.emailService.sendMail(
      usuario.emailUsuario,
      'Recuperação de senha',
      `<p>Olá ${usuario.nomeUsuario}, clique no link para redefinir sua senha:</p><p><a href="${recoveryUrl}">Redefinir senha</a></p>`,
    );
  }

  async resetPassword(token: string, novaSenha: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { recoveryToken: token } });
    if (!usuario || !usuario.tokenExpires || usuario.tokenExpires < new Date()) {
      throw new HttpException('Token inválido ou expirado.', HttpStatus.BAD_REQUEST);
    }

    usuario.senhaUsuario = await this.hashPassword(novaSenha);
    usuario.recoveryToken = null;
    usuario.tokenExpires = null;
    await this.usuarioRepository.save(usuario);
  }

  async sendTwoFactorCode(idUsuario: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    usuario.codigoTwoFactor = codigo;
    usuario.codigoTwoFactorExpiracao = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
    await this.usuarioRepository.save(usuario);

    await this.emailService.sendMail(
      usuario.emailUsuario,
      'Código 2FA',
      `<p>Seu código de confirmação é <strong>${codigo}</strong>. Ele expira em 5 minutos.</p>`,
    );
  }

  async verifyTwoFactorCode(idUsuario: number, codigo: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { idUsuario } });
    if (!usuario || usuario.codigoTwoFactor !== codigo || !usuario.codigoTwoFactorExpiracao || usuario.codigoTwoFactorExpiracao < new Date()) {
      throw new HttpException('Código 2FA inválido ou expirado.', HttpStatus.BAD_REQUEST);
    }

    usuario.codigoTwoFactor = null;
    usuario.codigoTwoFactorExpiracao = null;
    await this.usuarioRepository.save(usuario);
  }
}
```

> `AuthService` agora contém todos os métodos de autenticação: login, validação de e-mail, recuperação de senha e 2FA.

---

### 2.6 Estratégia JWT e guard completo

Crie `nest_academico/src/auth/strategies/jwt.strategy.ts`:

```ts
// nest_academico/src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '../constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: { sub: number; emailUsuario: string }) {
    return { idUsuario: payload.sub, emailUsuario: payload.emailUsuario };
  }
}
```

Crie `nest_academico/src/auth/guards/jwt-auth.guard.ts`:

```ts
// nest_academico/src/auth/guards/jwt-auth.guard.ts
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {}
```

---

### 2.7 Controller de autenticação completo

Crie `nest_academico/src/auth/auth.controller.ts`:

```ts
// nest_academico/src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { LoginRequest } from './dto/request/login.request';
import { RecoveryRequest } from './dto/request/recovery.request';
import { ResetPasswordRequest } from './dto/request/reset-password.request';
import { ValidateEmailRequest } from './dto/request/validate-email.request';
import { TwoFactorRequest } from './dto/request/two-factor.request';
import { LoginResponse } from './dto/response/login.response';

// Use o caminho de rota do projeto em vez de repetir o prefixo `rest`.
// Se você tiver `ROTA.AUTH.BASE` definido, use-o aqui. Caso contrário, use a string abaixo:
@Controller('sistema/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(loginRequest.emailUsuario, loginRequest.senhaUsuario);
  }

  @Post('recovery')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async recovery(@Body() recoveryRequest: RecoveryRequest) {
    await this.authService.requestPasswordRecovery(recoveryRequest.emailUsuario);
    return { message: 'Se o e-mail estiver cadastrado, você receberá instruções.' };
  }

  @Post('reset')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async reset(@Body() resetRequest: ResetPasswordRequest) {
    await this.authService.resetPassword(resetRequest.token, resetRequest.novaSenha);
    return { message: 'Senha redefinida com sucesso.' };
  }

  @Get('validate-email')
  @UsePipes(new ValidationPipe({ transform: true }))
  async validateEmail(@Query() validateEmailRequest: ValidateEmailRequest) {
    await this.authService.validateEmail(validateEmailRequest.token);
    return { message: 'E-mail confirmado com sucesso.' };
  }

  @Post('2fa/send')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async sendTwoFactor(@Body() twoFactorRequest: TwoFactorRequest) {
    await this.authService.sendTwoFactorCode(twoFactorRequest.idUsuario);
    return { message: 'Código 2FA enviado por e-mail.' };
  }

  @Post('2fa/verify')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async verifyTwoFactor(@Body() twoFactorRequest: TwoFactorRequest) {
    await this.authService.verifyTwoFactorCode(twoFactorRequest.idUsuario, twoFactorRequest.codigo);
    return { message: 'Código 2FA verificado com sucesso.' };
  }
}
```

---

### 2.8 Módulo `AuthModule`

Crie `nest_academico/src/auth/auth.module.ts`:

```ts
// nest_academico/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { EmailService } from './service/email.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Usuario } from '../usuario/entities/usuario.entity';
import { JWT_EXPIRES_IN, JWT_SECRET } from './constants/auth.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
```

No arquivo `nest_academico/src/app/app.module.ts`, adicione o `AuthModule` aos imports:

```ts
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // outros imports ...
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

---

### 2.9 Confirmar e-mail + recuperação de senha

> Observação: este fluxo não precisa de módulos separados para cada tarefa. Tudo deve ficar em um único `AuthModule`, com `AuthService` e `AuthController`, porque os métodos apenas estendem o comportamento do usuário existente na tabela `USUARIO`.

#### 2.9.1 Alterações na entidade `Usuario`

Abra `nest_academico/src/usuario/entities/usuario.entity.ts` e adicione as colunas:

```ts
  @Column({ name: 'STATUS_VALIDACAO', type: 'tinyint', width: 1, default: 0 })
  statusValidacao: number;

  @Column({ name: 'EMAIL_TOKEN', type: 'varchar', length: 255, nullable: true })
  emailToken?: string;

  @Column({ name: 'RECOVERY_TOKEN', type: 'varchar', length: 255, nullable: true })
  recoveryToken?: string;

  @Column({ name: 'TOKEN_EXPIRES', type: 'datetime', nullable: true })
  tokenExpires?: Date;

  @Column({ name: 'CODIGO_TWO_FACTOR', type: 'varchar', length: 10, nullable: true })
  codigoTwoFactor?: string;

  @Column({ name: 'CODIGO_TWO_FACTOR_EXPIRACAO', type: 'datetime', nullable: true })
  codigoTwoFactorExpiracao?: Date;
```

> Esses campos permitem guardar o token de confirmação, a recuperação de senha e o código de 2FA.

#### 2.9.2 EmailService básico

Crie `nest_academico/src/auth/service/email.service.ts`:

```ts
// nest_academico/src/auth/service/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT || 2525),
      auth: {
        user: process.env.SMTP_USER || 'seu_usuario',
        pass: process.env.SMTP_PASS || 'sua_senha',
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@meusistema.com',
      to,
      subject,
      html,
    });
    this.logger.log(`E-mail enviado para ${to}`);
  }
}
```

> Para desenvolvimento, recomendo usar Mailtrap. Ele captura os e-mails em uma caixa de entrada de teste e evita precisar de SMTP real.

#### Configuração prática do Mailtrap

1. Abra `https://mailtrap.io` e crie uma conta gratuita.
2. Crie um novo `Inbox` em Email Testing.
3. No painel do Inbox, encontre as configurações SMTP.
4. No dropdown, escolha `Nodemailer`.
5. Copie `host`, `port`, `user` e `pass`.
6. Coloque esses valores em seu `.env`:

```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=SEU_USER_DO_MAILTRAP
SMTP_PASS=SUA_PASS_DO_MAILTRAP
EMAIL_FROM=no-reply@meusistema.com
```

7. Reinicie o backend e verifique o log do `EmailService`.
8. Abra o Mailtrap e veja o e-mail de confirmação ou recuperação na interface do teste.

> Mailtrap não envia o e-mail para uma caixa real: ele mostra o e-mail somente para você. Isso é perfeito para desenvolvimento e evita configuração de Gmail ou SMTP real.

#### 2.9.3 Registro com token de confirmação

No serviço de usuário (`UsuarioService`), ao criar o usuário, gere hash de senha e token de e-mail:

```ts
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';

async criarUsuario(model: CreateUsuarioDto): Promise<Usuario> {
  model.senhaUsuario = await hash(model.senhaUsuario, BCRYPT_SALT_ROUNDS);
  model.emailToken = randomBytes(32).toString('hex');
  model.statusValidacao = 0;
  const usuario = this.usuarioRepository.create(model);
  await this.usuarioRepository.save(usuario);
  return usuario;
}
```

Depois de salvar, chame o `EmailService` para enviar o link:

```ts
const token = usuario.emailToken;
const urlConfirmacao = `${process.env.FRONTEND_URL}/confirmar-email?token=${token}`;
await this.emailService.sendMail(
  usuario.emailUsuario,
  'Confirme seu e-mail',
  `<p>Olá ${usuario.nomeUsuario}, clique no link para confirmar: <a href="${urlConfirmacao}">Confirmar e-mail</a></p>`,
);
```

#### 2.9.4 Controller de confirmação de e-mail

No `UsuarioController` ou em novo `ConfirmacaoController`:

```ts
@Get('confirmar-email')
async confirmarEmail(@Query('token') token: string) {
  const usuario = await this.usuarioService.findByEmailToken(token);
  if (!usuario) {
    throw new NotFoundException('Token de confirmação inválido.');
  }
  usuario.statusValidacao = 1;
  usuario.emailToken = null;
  await this.usuarioRepository.save(usuario);
  return { message: 'E-mail confirmado com sucesso.' };
}
```

#### 2.9.5 Endpoint de recuperação de senha

No `AuthController` adicione:

```ts
@Post('recovery')
async recovery(@Body('emailUsuario') emailUsuario: string) {
  const usuario = await this.usuarioRepository.findOne({ where: { emailUsuario } });
  if (!usuario) {
    return { message: 'Se o e-mail estiver cadastrado, enviaremos instruções.' };
  }

  usuario.recoveryToken = randomBytes(32).toString('hex');
  usuario.tokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
  await this.usuarioRepository.save(usuario);

  const urlReset = `${process.env.FRONTEND_URL}/resetar-senha?token=${usuario.recoveryToken}`;
  await this.emailService.sendMail(
    usuario.emailUsuario,
    'Recuperação de senha',
    `<p>Clique no link para redefinir sua senha: <a href="${urlReset}">Redefinir senha</a></p>`,
  );

  return { message: 'Se o e-mail estiver cadastrado, você receberá instruções.' };
}
```

#### 2.9.6 Endpoint de reset de senha

```ts
@Post('reset')
async reset(@Body() body: { token: string; novaSenha: string }) {
  const usuario = await this.usuarioRepository.findOne({
    where: { recoveryToken: body.token },
  });

  if (!usuario || !usuario.tokenExpires || usuario.tokenExpires < new Date()) {
    throw new HttpException('Token inválido ou expirado.', HttpStatus.BAD_REQUEST);
  }

  usuario.senhaUsuario = await hash(body.novaSenha, BCRYPT_SALT_ROUNDS);
  usuario.recoveryToken = null;
  usuario.tokenExpires = null;
  await this.usuarioRepository.save(usuario);

  return { message: 'Senha redefinida com sucesso.' };
}
```

> Esse fluxo garante que o token expire e que a senha seja salva somente em hash.

---

## 3. Frontend — código completo e didático

### 3.1 Configuração do `http` no frontend

No `react_academico/src/services/axios/config.axios.ts`, certifique-se de que o `baseURL` esteja correto:

```ts
import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

> Se estiver usando Vite, adicione `VITE_API_URL=http://localhost:8000` no `.env`.

---

### 3.2 Criando `AuthContext` completo

Crie `react_academico/src/services/auth/AuthContext.tsx`:

```tsx
// react_academico/src/services/auth/AuthContext.tsx
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { http } from '../axios/config.axios';

export interface UsuarioLogado {
  idUsuario: number;
  nomeUsuario: string;
  sobrenomeUsuario: string;
  emailUsuario: string;
}

export interface AuthContextData {
  token: string | null;
  user: UsuarioLogado | null;
  login: (token: string, user: UsuarioLogado) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UsuarioLogado | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (token) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete http.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = (tokenValue: string, userData: UsuarioLogado) => {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(
    () => ({ token, user, login, logout }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

> O `AuthProvider` mantém o token e o usuário no `localStorage` e seta o header `Authorization` automaticamente.

---

### 3.3 Criando o arquivo de API de autenticação

Crie `react_academico/src/services/auth/api.auth.ts`:

```ts
// react_academico/src/services/auth/api.auth.ts
import { http } from '../axios/config.axios';

export interface LoginBody {
  emailUsuario: string;
  senhaUsuario: string;
}

export interface LoginResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: {
    idUsuario: number;
    nomeUsuario: string;
    sobrenomeUsuario: string;
    emailUsuario: string;
  };
}

export async function apiLogin(body: LoginBody): Promise<LoginResult> {
  const response = await http.post<LoginResult>('/rest/sistema/auth/login', body);
  return response.data;
}

export async function apiRecovery(emailUsuario: string): Promise<{ message: string }> {
  const response = await http.post('/rest/sistema/auth/recovery', { emailUsuario });
  return response.data;
}

export async function apiReset(token: string, novaSenha: string): Promise<{ message: string }> {
  const response = await http.post('/rest/sistema/auth/reset', { token, novaSenha });
  return response.data;
}
```

---

### 3.4 Tela de login completa

Crie `react_academico/src/views/auth/Login.tsx`:

```tsx
// react_academico/src/views/auth/Login.tsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../services/auth/AuthContext';
import { apiLogin } from '../../services/auth/api.auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [emailUsuario, setEmailUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await apiLogin({ emailUsuario, senhaUsuario });
      login(result.accessToken, result.usuario);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Falha ao autenticar');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            value={emailUsuario}
            onChange={(event) => setEmailUsuario(event.target.value)}
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senhaUsuario}
            onChange={(event) => setSenhaUsuario(event.target.value)}
            required
          />
        </label>
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        <a href="/esqueci-senha">Esqueci minha senha</a>
      </p>
    </div>
  );
};
```

> O link para `/esqueci-senha` deve existir como rota do frontend.

---

### 3.5 Rotas privadas

Crie `react_academico/src/components/PrivateRoute.tsx`:

```tsx
// react_academico/src/components/PrivateRoute.tsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../services/auth/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
```

No seu roteamento (`App.tsx` ou onde usa o React Router):

```tsx
import { PrivateRoute } from './components/PrivateRoute';
import { Login } from './views/auth/Login';
import { Dashboard } from './views/Dashboard';

<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />
</Routes>
```

> Assim, a rota `/dashboard` só é acessada com token válido.

---

### 3.6 Tela de esqueceu senha

Crie `react_academico/src/views/auth/EsqueciSenha.tsx`:

```tsx
// react_academico/src/views/auth/EsqueciSenha.tsx
import React, { useState } from 'react';
import { apiRecovery } from '../../services/auth/api.auth';

export const EsqueciSenha: React.FC = () => {
  const [emailUsuario, setEmailUsuario] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await apiRecovery(emailUsuario);
      setMessage(result.message);
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao solicitar recuperação.');
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Esqueci minha senha</h1>
      <form onSubmit={handleSubmit}>
        <label>
          E-mail cadastrado
          <input
            type="email"
            value={emailUsuario}
            onChange={(event) => setEmailUsuario(event.target.value)}
            required
          />
        </label>
        <button type="submit">Enviar instruções</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
```

---

### 3.7 Tela de resetar senha

Crie `react_academico/src/views/auth/ResetSenha.tsx`:

```tsx
// react_academico/src/views/auth/ResetSenha.tsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiReset } from '../../services/auth/api.auth';

export const ResetSenha: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }
    try {
      const result = await apiReset(token, novaSenha);
      setMessage(result.message);
      setError('');
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao resetar senha.');
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Redefinir senha</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nova senha
          <input
            type="password"
            value={novaSenha}
            onChange={(event) => setNovaSenha(event.target.value)}
            required
          />
        </label>
        <label>
          Confirmar nova senha
          <input
            type="password"
            value={confirmarSenha}
            onChange={(event) => setConfirmarSenha(event.target.value)}
            required
          />
        </label>
        <button type="submit">Redefinir senha</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
```

---

## 4. Banco de dados — campos novos e SQL completo

No banco de dados MySQL, atualize a tabela `USUARIO` com os campos necessários para confirmação e recuperação:

```sql
ALTER TABLE USUARIO
  ADD COLUMN STATUS_VALIDACAO TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN EMAIL_TOKEN VARCHAR(255) NULL,
  ADD COLUMN RECOVERY_TOKEN VARCHAR(255) NULL,
  ADD COLUMN TOKEN_EXPIRES DATETIME NULL;
```

Se quiser usar nomes explicitamente em caixa alta para casar com o DDL atual, adote exatamente assim.

> Use backup antes de alterar o banco. Se precisar, gere um `CREATE TABLE USUARIO ...` com `mysqldump`.

---

## 5. Checkpoints e testes

### 5.1 Testar login via Postman

1. URL: `POST http://localhost:8000/rest/sistema/auth/login`
2. Body JSON:

```json
{
  "emailUsuario": "usuario@teste.com",
  "senhaUsuario": "senha123"
}
```

3. Verifique se resposta contém:
- `accessToken`
- `tokenType`: `Bearer`
- `expiresIn`
- `usuario` com `idUsuario`, `nomeUsuario`, `sobrenomeUsuario`, `emailUsuario`

### 5.2 Testar rota protegida

1. Chame `GET http://localhost:8000/rest/sistema/usuario/listar` sem header.
2. Deve retornar `401 Unauthorized`.
3. Depois chame com header:

```
Authorization: Bearer <accessToken>
```

4. Deve retornar a lista de usuários.

### 5.3 Testar confirmação de e-mail

1. Crie usuário pelo frontend ou via POST `/rest/sistema/usuario/criar`.
2. Verifique no banco se `STATUS_VALIDACAO = 0` e `EMAIL_TOKEN` foi gerado.
3. Acesse o link do e-mail de confirmação ou chame o endpoint de confirmação.
4. Verifique se `STATUS_VALIDACAO = 1` e `EMAIL_TOKEN` ficou `NULL`.

### 5.4 Testar recuperação de senha

1. Chame `POST /rest/sistema/auth/recovery` com o e-mail do usuário.
2. Verifique no banco se `RECOVERY_TOKEN` e `TOKEN_EXPIRES` foram preenchidos.
3. Acesse a rota de reset no frontend com `?token=<RECOVERY_TOKEN>`.
4. Submeta nova senha e confirme no banco se `SENHA` foi atualizada.

---

## 6. Observações e boas práticas

- Nunca armazene senha em texto puro. Use sempre `bcrypt.hash()` antes de salvar.
- Não retorne a senha no `usuario` do login.
- Use `JWT_SECRET` e `SMTP_*` em variáveis de ambiente.
- Valide dados no backend com `class-validator` e `ValidationPipe`.
- No frontend, não mantenha senhas no estado por mais tempo do que o necessário.

---

## 7. Checklist final para entrega

- [ ] `AuthModule` criado e importado em `AppModule`.
- [ ] `AuthController` responde em `/rest/sistema/auth/login`.
- [ ] `JwtStrategy` e `JwtAuthGuard` estão funcionando.
- [ ] Frontend salva token em `localStorage` e envia `Authorization`.
- [ ] `PrivateRoute` bloqueia páginas sem login.
- [ ] Recuperação de senha gera `RECOVERY_TOKEN` e `TOKEN_EXPIRES`.
- [ ] Confirmação de e-mail altera `STATUS_VALIDACAO`.
- [ ] Testes pelo Postman e UI foram executados.

---

## 8. Próximo passo

Se quiser, posso agora criar os arquivos do backend `nest_academico/src/auth` com o código pronto, e também montar as telas `Login`, `EsqueciSenha` e `ResetSenha` no frontend para você. Se você quiser, eu faço isso diretamente no workspace.


- Nunca armazene senha em texto puro — use `bcrypt.hash(, saltRounds)` ao criar/alterar senha.
- Use variáveis de ambiente para `JWT_SECRET` e credenciais SMTP.
- Para debug, confira os logs SQL no backend (TypeORM) para validar colunas/nomes.
- Mapeie os nomes de campos entre frontend e backend (`emailUsuario`, `senhaUsuario`, `idUsuario`).

Checklist antes de entregar:
- [ ] Todas as rotas protegidas usam `@UseGuards(JwtAuthGuard)`
- [ ] Login retorna `accessToken` e dados do usuário
- [ ] Token é enviado pelo frontend em `Authorization` header
- [ ] Fluxos de confirmação e recuperação por e-mail funcionam
- [ ] Testes manuais com Postman e pela UI completos

---

Se quiser, eu posso agora:

- gerar os arquivos base (scaffolding) dentro de `nest_academico/src/auth` com o código exato para cada arquivo; ou
- apenas orientar passo a passo à medida que você for implementando — me diga como prefere proceder.