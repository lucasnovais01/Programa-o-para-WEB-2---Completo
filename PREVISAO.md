# PREVISÃƒÆ’O DE PROVA - AUTENTICAÃƒâ€¡ÃƒÆ’O COMPLETA

## 1. IntroduÃƒÂ§ÃƒÂ£o

Este documento ÃƒÂ© o tutorial definitivo para terminar a matÃƒÂ©ria de autenticaÃƒÂ§ÃƒÂ£o no seu sistema. Ele cobre o cÃƒÂ³digo atual, os problemas que existem hoje e o caminho completo atÃƒÂ© um fluxo final funcional:

- Cadastro de usuÃƒÂ¡rio
- Login com JWT
- ProteÃƒÂ§ÃƒÂ£o de rotas
- ConfirmaÃƒÂ§ÃƒÂ£o de e-mail
- RecuperaÃƒÂ§ÃƒÂ£o de senha
- AlteraÃƒÂ§ÃƒÂ£o de senha
- 2FA por e-mail (opcional / extra)
- IntegraÃƒÂ§ÃƒÂ£o com frontend React

O foco ÃƒÂ© no `nest_academico` e no `react_academico`, com base nos arquivos existentes.

---

## 2. Conceitos bÃƒÂ¡sicos (ler antes de comeÃƒÂ§ar)

### 2.1 O que ÃƒÂ© cada coisa?

**Backend (nest_academico)**
- Ãƒâ€° o servidor que fica rodando no seu computador em `http://localhost:5000`
- Ele guarda os dados no banco de dados MySQL
- Quando vocÃƒÂª envia um login, o backend verifica se estÃƒÂ¡ correto

**Frontend (react_academico)**
- Ãƒâ€° o site que vocÃƒÂª vÃƒÂª no navegador em `http://localhost:3000`
- Tem os formulÃƒÂ¡rios e botÃƒÂµes que vocÃƒÂª clica
- Envia o login para o backend verificar

**JWT (JSON Web Token)**
- Ãƒâ€° como um "crachÃƒÂ¡ de visitante" que o backend emite quando vocÃƒÂª faz login
- Depois que pega o crachÃƒÂ¡, vocÃƒÂª envia ele em toda requisiÃƒÂ§ÃƒÂ£o
- Ãƒâ€° uma string longa e confusa: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdGVAZW1haWwuY29tIn0...`

**bcrypt**
- Ãƒâ€° uma funÃƒÂ§ÃƒÂ£o que "embaralha" a senha para deixar segura
- Quando vocÃƒÂª cria um usuÃƒÂ¡rio, a senha `senha123` vira `$2b$10$Xyz9kLmNoPqRsTuVwXyZ...`
- NinguÃƒÂ©m consegue recuperar a senha original a partir desse hash

**LocalStrategy**
- Ãƒâ€° o Passport lendo o email e senha do formulÃƒÂ¡rio
- Verifica se estÃƒÂ£o corretos no banco de dados

**JwtStrategy**
- Ãƒâ€° o Passport lendo o token JWT do header `Authorization`
- Se o token for vÃƒÂ¡lido, deixa entrar; se expirou, rejeita

**Guard (JwtAuthGuard)**
- Ãƒâ€° como um porteiro que verifica se vocÃƒÂª tem o token vÃƒÂ¡lido
- Se vocÃƒÂª tentar acessar uma rota protegida sem token, ele bloqueia

**EmailService**
- Ãƒâ€° quem envia os e-mails (confirmaÃƒÂ§ÃƒÂ£o, reset de senha, etc.)
- Usa SMTP para conectar ao provedor de e-mail (Gmail, Outlook, etc.)

### 2.2 Como a autenticaÃƒÂ§ÃƒÂ£o funciona no total?

```
1. UsuÃƒÂ¡rio acessa http://localhost:3000/sistema/auth/login
2. Preenche email e senha no formulÃƒÂ¡rio
3. Clica "Entrar"
4. Frontend envia POST para http://localhost:5000/sistema/auth/login
5. Backend verifica email e senha no banco de dados
6. Se estÃƒÂ¡ correto, gera um JWT (o "crachÃƒÂ¡")
7. Frontend recebe o JWT e guarda no localStorage
8. Frontend agora envia o JWT em toda requisiÃƒÂ§ÃƒÂ£o no header Authorization
9. Backend vÃƒÂª o JWT, verifica se ÃƒÂ© vÃƒÂ¡lido
10. Se ÃƒÂ© vÃƒÂ¡lido, deixa a requisiÃƒÂ§ÃƒÂ£o passar
11. Se expirou, rejeita com erro 401
```

---

## 3. Estado atual do projeto

### 3.1 O que jÃƒÂ¡ existe

No backend (`nest_academico`):

- `nest_academico/src/auth/auth.module.ts`
- `nest_academico/src/auth/service/auth.service.ts`
- `nest_academico/src/auth/service/jwt.service.ts`
- `nest_academico/src/auth/controllers/auth.controllers.ts`
- `nest_academico/src/auth/config/strategy/local/local.strategy.ts`
- `nest_academico/src/auth/config/guard/local.auth.guard.ts`
- `nest_academico/src/mail/service/email.service.ts`
- `nest_academico/src/mail/service/email.template.service.ts`
- `nest_academico/src/usuario/entities/usuario.entity.ts`
- `nest_academico/src/app/app.module.ts`
- `nest_academico/src/main.ts`

No frontend (`react_academico`):

- `react_academico/src/services/auth/api/api.auth.ts`
- `react_academico/src/services/auth/hook/useLogin.tsx`
- `react_academico/src/services/auth/hook/useAuth.tsx`
- `react_academico/src/services/router/url.ts`
- `react_academico/src/services/router/Router.tsx`
- `react_academico/src/views/auth/Login.tsx`
- `react_academico/src/services/axios/config.axios.ts`

### 3.2 O que ainda falta / estÃƒÂ¡ incorreto

No backend:

- A rota atual de login em `auth.controllers.ts` usa `@Controller('auth')` e `@Post('/session/login')`, o que nÃƒÂ£o combina com o frontend `/sistema/auth/login`.
- `AuthController` faz `req.res?.setHeader('Set-Cookie', [cookie, accessToken])`, o que estÃƒÂ¡ errado. Um cookie deve ser enviado como string formatada e o access token deve ser retornado no corpo.
- `AuthModule` nÃƒÂ£o importa `PassportModule`, portanto o `LocalAuthGuard` pode nÃƒÂ£o funcionar corretamente.
- O backend nÃƒÂ£o tem `ValidationPipe` global em `main.ts`.
- O `EmailService` tem HTML com erros de template e nÃƒÂ£o usa o `TemplateService` corretamente.
- A entidade `Usuario` ainda nÃƒÂ£o possui campos de validaÃƒÂ§ÃƒÂ£o de e-mail, token de recuperaÃƒÂ§ÃƒÂ£o e expiraÃƒÂ§ÃƒÂ£o.
- Ainda nÃƒÂ£o hÃƒÂ¡ endpoints de `validate-email`, `request-password-recovery`, `reset-password`, `change-password` e `two-factor`.
- O fluxo atual sÃƒÂ³ cobre autenticaÃƒÂ§ÃƒÂ£o local simples; nÃƒÂ£o hÃƒÂ¡ proteÃƒÂ§ÃƒÂ£o real de rotas JWT nem refresh token.

No frontend:

- NÃƒÂ£o existe interceptor Axios para enviar o token JWT automaticamente.
- `useLogin.tsx` estÃƒÂ¡ salvando token no `localStorage`, mas nÃƒÂ£o redireciona para dashboard.
- As rotas de proteÃƒÂ§ÃƒÂ£o existem apenas no comentÃƒÂ¡rio.
- NÃƒÂ£o hÃƒÂ¡ pÃƒÂ¡ginas e hooks para recuperaÃƒÂ§ÃƒÂ£o de senha, validaÃƒÂ§ÃƒÂ£o de e-mail ou alteraÃƒÂ§ÃƒÂ£o de senha.

---

## 4. PrÃƒÂ©-requisitos: instalar dependÃƒÂªncias

Antes de comeÃƒÂ§ar a editar cÃƒÂ³digo, vocÃƒÂª precisa instalar algumas bibliotecas extras. Abra o terminal PowerShell na pasta `nest_academico`:

```bash
cd nest_academico
npm install class-validator class-transformer
npm install @nestjs/passport passport passport-local
npm install -D @types/passport-local @types/express
npm install bcrypt
npm install -D @types/bcrypt
npm install uuid
npm install -D @types/uuid
npm install nodemailer
npm install -D @types/nodemailer
npm install handlebars
```

**Por que cada uma?**
- `class-validator`: valida dados que chegam no servidor (email, senha, etc.)
- `@nestjs/passport` + `passport-local`: estratÃƒÂ©gia de login com email/senha
- `@types/passport-local`: tipos TypeScript para Passport
- `bcrypt`: embaralha a senha antes de guardar no banco
- `uuid`: gera tokens aleatÃƒÂ³rios e seguros
- `nodemailer`: envia e-mails
- `handlebars`: cria templates HTML para e-mails

Se o npm disser que algo jÃƒÂ¡ estÃƒÂ¡ instalado, ÃƒÂ© normal Ã¢â‚¬â€ significa que jÃƒÂ¡ estava lÃƒÂ¡.

No React, provavelmente vocÃƒÂª jÃƒÂ¡ tem `axios`, mas se nÃƒÂ£o tiver:

```bash
cd react_academico
npm install axios
```

---

## 5. Objetivo final da matÃƒÂ©ria

### 5.1 O sistema final deve oferecer

1. Registro de usuÃƒÂ¡rio com senha hash e validaÃƒÂ§ÃƒÂ£o de e-mail.
2. Login com JWT.
3. Rotas protegidas com `JwtAuthGuard`.
4. RecuperaÃƒÂ§ÃƒÂ£o de senha por e-mail.
5. AlteraÃƒÂ§ÃƒÂ£o de senha autenticada.
6. Envio de e-mail com templates.
7. Frontend React com login, rotas privadas e fluxo de recuperaÃƒÂ§ÃƒÂ£o.
8. Se possÃƒÂ­vel, 2FA por e-mail como reforÃƒÂ§o de seguranÃƒÂ§a.

### 5.2 O que ÃƒÂ© esperado na prova

Provavelmente pedirÃƒÂ£o:

- `AuthController` e `AuthService` em NestJS.
- Login com JWT.
- Guard para rotas protegidas.
- Token de confirmaÃƒÂ§ÃƒÂ£o de e-mail e fluxo de validaÃƒÂ§ÃƒÂ£o.
- RecuperaÃƒÂ§ÃƒÂ£o de senha com token temporÃƒÂ¡rio.
- Senha criptografada no banco.
- Frontend com login e proteÃƒÂ§ÃƒÂ£o de pÃƒÂ¡ginas.

---

## 6. Como usar este tutorial (instruÃƒÂ§ÃƒÂµes para nÃƒÂ£o se perder)

### 6.0.1 Passo a passo bem simples

1. **Abra os terminais**: vocÃƒÂª precisa de 2 terminais abertos ao mesmo tempo
   - Terminal 1: fica aberto em `nest_academico` rodando `npm run start:dev`
   - Terminal 2: vocÃƒÂª usa para editar arquivos e instalar pacotes

2. **Para cada arquivo novo que aparece aqui**:
   - Procure a instruÃƒÂ§ÃƒÂ£o que diz `Crie nest_academico/src/auth/...`
   - Clique com botÃƒÂ£o direito na pasta onde precisa criar
   - Escolha "New File" ou "New Folder"
   - Escreva o nome do arquivo
   - Copie o cÃƒÂ³digo que estÃƒÂ¡ no bloco `\`\`\`ts` (o cÃƒÂ³digo ÃƒÂ© azul dentro de um retÃƒÂ¢ngulo)
   - Cole no arquivo que vocÃƒÂª criou
   - Salve com Ctrl+S

3. **Para cada arquivo que jÃƒÂ¡ existe**:
   - Procure a instruÃƒÂ§ÃƒÂ£o que diz `Atualize nest_academico/src/auth/...`
   - Abra o arquivo no VS Code
   - Encontre a parte do cÃƒÂ³digo que precisa trocar (procure com Ctrl+F)
   - Delete a parte antiga
   - Cole a parte nova
   - Salve com Ctrl+S

4. **Testando**:
   - Sempre apÃƒÂ³s salvar um arquivo, olhe no Terminal 1
   - Se aparecer erro em vermelho, ÃƒÂ© sinal que algo estÃƒÂ¡ errado
   - Se nÃƒÂ£o aparecer erro, o arquivo foi atualizado com sucesso

### 6.0.2 Se vocÃƒÂª se perder, olhe para este sumÃƒÂ¡rio

Ordem que vocÃƒÂª deve fazer as coisas:

1. Instalar dependÃƒÂªncias (npm install)
2. Criar constantes de auth (seÃƒÂ§ÃƒÂ£o 6.5)
3. Atualizar Usuario entity (seÃƒÂ§ÃƒÂ£o 6.4)
4. Atualizar main.ts (seÃƒÂ§ÃƒÂ£o 6.3)
5. Atualizar ou criar AuthModule (seÃƒÂ§ÃƒÂ£o 6.6)
6. Criar JwtStrategy (seÃƒÂ§ÃƒÂ£o 6.8)
7. Atualizar LocalStrategy (seÃƒÂ§ÃƒÂ£o 6.7)
8. Atualizar AuthService (seÃƒÂ§ÃƒÂ£o 6.9)
9. Atualizar JwtService (seÃƒÂ§ÃƒÂ£o 6.10)
10. Atualizar AuthController (seÃƒÂ§ÃƒÂ£o 6.11)
11. Criar DTOs (seÃƒÂ§ÃƒÂ£o 6.12)
12. Atualizar EmailService (seÃƒÂ§ÃƒÂ£o 6.13)
13. Atualizar EmailModule (seÃƒÂ§ÃƒÂ£o 6.14)
14. Depois fazer o Frontend

---

## 7. Backend: implementaÃƒÂ§ÃƒÂ£o completa

### 7.1 Estrutura de pastas recomendada

```
nest_academico/src/auth/
  auth.module.ts
  controllers/
    auth.controller.ts
  config/
    guard/
      jwt-auth.guard.ts
      local.auth.guard.ts
    requestWithUser.interface.ts
    strategy/
      local/
        local.strategy.ts
      jwt/
        jwt.strategy.ts
  constants/
    auth.constants.ts
  dto/
    request/
      login.request.ts
      recovery.request.ts
      reset-password.request.ts
      validate-email.request.ts
      change-password.request.ts
      two-factor.request.ts
    response/
      login.response.ts
      generic.response.ts
  service/
    auth.service.ts
    jwt.service.ts

nest_academico/src/mail/
  email.module.ts
  service/
    email.service.ts
    email.template.service.ts
    templates/
      confirmation.hbs
      reset-password.hbs
```

### 7.2 VariÃƒÂ¡veis de ambiente
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(1521),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_DATABASE: Joi.string().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().default(3600),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().default('refresh-secret'),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().default(86400),
  JWT_VERIFICATION_TOKEN_SECRET: Joi.string().default('verification-secret'),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_FROM: Joi.string().required(),
  EMAIL_TLS: Joi.boolean().default(false),
});
```

No arquivo `.env`, coloque algo parecido com:

```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_DATABASE=seu_banco
JWT_ACCESS_TOKEN_SECRET=MinhaChaveSuperSecreta
JWT_ACCESS_TOKEN_EXPIRATION_TIME=3600
JWT_REFRESH_TOKEN_SECRET=MinhaChaveRefresh
JWT_REFRESH_TOKEN_EXPIRATION_TIME=86400
JWT_VERIFICATION_TOKEN_SECRET=MinhaChaveVerificacao
EMAIL_HOST=smtp.seuprovedor.com
EMAIL_PORT=587
EMAIL_USER=seu_usuario
EMAIL_PASSWORD=sua_senha
EMAIL_FROM=seu@email.com
EMAIL_TLS=false
```

### 7.3 Atualizar `main.ts`

Ative a validaÃƒÂ§ÃƒÂ£o global de DTOs e CORS corretamente:

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './commons/exceptions/filters/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe ÃƒÂ© como um "policial de validaÃƒÂ§ÃƒÂ£o"
  // Quando alguÃƒÂ©m envia dados para o backend, ele verifica:
  // - Se os campos estÃƒÂ£o vazios (quando nÃƒÂ£o deveriam ser)
  // - Se o tipo de dados estÃƒÂ¡ correto (email tem @ ? nÃƒÂºmero ÃƒÂ© nÃƒÂºmero?)
  // - Se tem campos extras que nÃƒÂ£o deveriam estar lÃƒÂ¡
  // Se algo estiver errado, rejeita automaticamente
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  
  app.useGlobalFilters(new HttpExceptionFilter());

  const configSwagger = new DocumentBuilder()
    .setTitle('Sistema AcadÃƒÂªmico')
    .setDescription('API para gestÃƒÂ£o acadÃƒÂªmica')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api_academico', app, document);

  // CORS = "Cross-Origin Resource Sharing" = permite que o React (localhost:3000) converse com o NestJS (localhost:5000)
  // Sem isso, o navegador bloqueia requisiÃƒÂ§ÃƒÂµes entre domÃƒÂ­nios diferentes
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap();
```

### 7.4 Atualizar a entidade `Usuario`

Acrescente campos para confirmaÃƒÂ§ÃƒÂ£o de e-mail, recuperaÃƒÂ§ÃƒÂ£o de senha e status.

```ts
// nest_academico/src/usuario/entities/usuario.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entity/base.entity';

@Entity('usuario')
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ID_USUARIO' })
  idUsuario!: number;

  @Column({ name: 'NOME_USUARIO' })
  nomeUsuario!: string;

  @Column({ name: 'SOBRENOME_USUARIO' })
  sobrenomeUsuario!: string;

  @Column({ name: 'EMAIL' })
  emailUsuario!: string;

  @Column({ name: 'SENHA' })
  senhaUsuario!: string;

  @Column({ name: 'STATUS_VALIDACAO', default: false })
  statusValidacao!: boolean;

  @Column({ name: 'TOKEN_VALIDACAO_EMAIL', nullable: true })
  tokenValidacaoEmail?: string;

  @Column({ name: 'TOKEN_RECUPERACAO_SENHA', nullable: true })
  recoveryToken?: string;

  @Column({
    name: 'TOKEN_RECUPERACAO_EXPIRADO_EM',
    type: 'datetime',
    nullable: true,
  })
  recoveryTokenExpiresAt?: Date;

  @Column({ name: 'CODIGO_2FA', nullable: true })
  twoFactorCode?: string;

  @Column({
    name: 'CODIGO_2FA_EXPIRADO_EM',
    type: 'datetime',
    nullable: true,
  })
  twoFactorCodeExpiresAt?: Date;

  constructor(data: Partial<Usuario> = {}) {
    super();
    Object.assign(this, data);
  }
}
```

> Importante: este passo ÃƒÂ© essencial para suportar validaÃƒÂ§ÃƒÂ£o e recuperaÃƒÂ§ÃƒÂ£o de senha no backend.

### 7.5 Criar constantes de autenticaÃƒÂ§ÃƒÂ£o

Crie `nest_academico/src/auth/constants/auth.constants.ts` com:

```ts
export const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || 'CHAVE_SECRETA_ACADEMICO_2026';
export const JWT_ACCESS_TOKEN_EXPIRATION_TIME =
  Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || 3600);
export const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'CHAVE_REFRESH_SECRETA_2026';
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME =
  Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || 86400);
export const JWT_VERIFICATION_TOKEN_SECRET =
  process.env.JWT_VERIFICATION_TOKEN_SECRET || 'CHAVE_VERIFICACAO_SECRETA_2026';
export const BCRYPT_SALT_ROUNDS =
  Number(process.env.BCRYPT_SALT_ROUNDS || 10);
```

### 7.6 Atualizar `AuthModule`

A versÃƒÂ£o atual importa `JwtModule` e `ConfigModule`, mas ainda precisa do `PassportModule` e deve usar o `Usuario` do TypeORM.

```ts
// nest_academico/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { AuthController } from './controllers/auth.controllers';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './config/strategy/jwt/jwt.strategy';
import { LocalStrategy } from './config/strategy/local/local.strategy';
import { JsonWebTokenService } from './service/jwt.service';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
} from './constants/auth.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({
      secret: JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: `${JWT_ACCESS_TOKEN_EXPIRATION_TIME}s` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JsonWebTokenService],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### 7.7 Atualizar `LocalStrategy`

O `local.strategy.ts` jÃƒÂ¡ estÃƒÂ¡ correto no padrÃƒÂ£o, mas o nome dos campos deve bater com o frontend e o backend. O `usernameField` deve ser `email` e o `passwordField` deve ser `password` apenas se vocÃƒÂª enviar esses nomes no frontend.

Se seu frontend envia `emailUsuario` e `senhaUsuario`, configure a validaÃƒÂ§ÃƒÂ£o no controller para transformar antes de chamar o guard, ou altere o formulÃƒÂ¡rio para enviar `email` e `password`.

### 7.8 Criar `JwtStrategy`

Adicione o arquivo `nest_academico/src/auth/config/strategy/jwt/jwt.strategy.ts`:

```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../service/auth.service';
import { JWT_ACCESS_TOKEN_SECRET } from '../../constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const usuario = await this.authService.buscarUsuarioPorId(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException('UsuÃƒÂ¡rio nÃƒÂ£o encontrado');
    }
    return usuario;
  }
}
```

### 7.9 Atualizar `AuthService`

O serviÃƒÂ§o de autenticaÃƒÂ§ÃƒÂ£o deve ser o coraÃƒÂ§ÃƒÂ£o do fluxo. Ele jÃƒÂ¡ tem `getJwtAccessToken`, `getJwtRefreshToken`, `getAuthenticatedUser`, `findByEmail` e `verificarSenha`.

**O que este serviÃƒÂ§o faz?**
- Verifica email e senha usando bcrypt (a funÃƒÂ§ÃƒÂ£o que compara a senha enviada com o hash no banco)
- Cria tokens JWT para o usuÃƒÂ¡rio (crachÃƒÂ¡s que expiram)
- Valida se um token ÃƒÂ© real e nÃƒÂ£o foi falsificado
- Envia e-mails de confirmaÃƒÂ§ÃƒÂ£o, recuperaÃƒÂ§ÃƒÂ£o de senha, etc.

A seguir estÃƒÂ¡ a versÃƒÂ£o completa com os mÃƒÂ©todos que faltam:

```ts
// nest_academico/src/auth/service/auth.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'; // FunÃƒÂ§ÃƒÂ£o para embaralhar senha
import { Repository } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { JsonWebTokenService, UserToken } from './jwt.service';
import { EmailService } from '@/mail/service/email.service';
import { BCRYPT_SALT_ROUNDS } from '../constants/auth.constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jsonWebTokenService: JsonWebTokenService,
    private readonly emailService: EmailService,
  ) {}

  async getJwtAccessToken(usuario: Usuario) {
    const { accessToken, expireInAccessToken } =
      await this.jsonWebTokenService.createAccessToken({
        idUsuario: usuario.idUsuario,
      });

    const cookie = this.getCookieAccessToken(accessToken, expireInAccessToken);
    return {
      cookie,
      accessToken,
      expireInAccessToken,
    };
  }

  private getCookieAccessToken(token: string, expiresInSeconds: number): string {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax; Secure`;
  }

  async getJwtRefreshToken(usuario: Usuario) {
    const { refreshToken } =
      await this.jsonWebTokenService.createRefreshToken({
        idUsuario: usuario.idUsuario,
      });
    return refreshToken;
  }

  async getAuthenticatedUser(email: string, senha: string): Promise<Usuario> {
    const usuario = await this.findByEmail(email);
    if (!usuario) {
      throw new HttpException('UsuÃƒÂ¡rio nÃƒÂ£o cadastrado', HttpStatus.NOT_FOUND);
    }
    await this.verificarSenha(senha, usuario.senhaUsuario);
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .where('usuario.emailUsuario = :email', { email })
      .getOne();

    if (!usuario) {
      throw new HttpException('UsuÃƒÂ¡rio nÃƒÂ£o cadastrado', HttpStatus.NOT_FOUND);
    }

    return usuario;
  }

  async verificarSenha(senha: string, hashedSenha: string): Promise<boolean> {
    const isSenhaMatching = await bcrypt.compare(senha, hashedSenha);
    if (!isSenhaMatching) {
      throw new HttpException('Credenciais invÃƒÂ¡lidas', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  async validateEmail(token: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { tokenValidacaoEmail: token },
    });
    if (!usuario) {
      throw new HttpException(
        'Token de validaÃƒÂ§ÃƒÂ£o invÃƒÂ¡lido',
        HttpStatus.BAD_REQUEST,
      );
    }

    usuario.statusValidacao = true;
    usuario.tokenValidacaoEmail = null;
    await this.usuarioRepository.save(usuario);
  }

  async requestPasswordRecovery(email: string): Promise<void> {
    const usuario = await this.findByEmail(email);
    const recoveryToken = await bcrypt.hash(
      `${usuario.idUsuario}-${Date.now()}`,
      BCRYPT_SALT_ROUNDS,
    );
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

    usuario.recoveryToken = recoveryToken;
    usuario.recoveryTokenExpiresAt = expiresAt;
    await this.usuarioRepository.save(usuario);

    await this.emailService.sendResetPasswordEmail(
      usuario.emailUsuario,
      usuario.nomeUsuario,
      recoveryToken,
    );
  }

  async resetPassword(token: string, novaSenha: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { recoveryToken: token },
    });
    if (!usuario) {
      throw new HttpException('Token invÃƒÂ¡lido', HttpStatus.BAD_REQUEST);
    }
    if (!usuario.recoveryTokenExpiresAt || usuario.recoveryTokenExpiresAt < new Date()) {
      throw new HttpException('Token expirado', HttpStatus.BAD_REQUEST);
    }

    usuario.senhaUsuario = await bcrypt.hash(novaSenha, BCRYPT_SALT_ROUNDS);
    usuario.recoveryToken = null;
    usuario.recoveryTokenExpiresAt = null;
    await this.usuarioRepository.save(usuario);
  }

  async changePassword(
    idUsuario: number,
    senhaAtual: string,
    novaSenha: string,
  ): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });
    if (!usuario) {
      throw new HttpException('UsuÃƒÂ¡rio nÃƒÂ£o encontrado', HttpStatus.NOT_FOUND);
    }

    await this.verificarSenha(senhaAtual, usuario.senhaUsuario);
    usuario.senhaUsuario = await bcrypt.hash(novaSenha, BCRYPT_SALT_ROUNDS);
    await this.usuarioRepository.save(usuario);
  }

  async sendTwoFactorCode(idUsuario: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });
    if (!usuario) {
      throw new HttpException('UsuÃƒÂ¡rio nÃƒÂ£o encontrado', HttpStatus.NOT_FOUND);
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    usuario.twoFactorCode = codigo;
    usuario.twoFactorCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
    await this.usuarioRepository.save(usuario);

    await this.emailService.sendTwoFactorCode(
      usuario.emailUsuario,
      usuario.nomeUsuario,
      codigo,
    );
  }

  async verifyTwoFactorCode(idUsuario: number, codigo: string): Promise<string> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });
    if (!usuario) {
      throw new HttpException('UsuÃƒÂ¡rio nÃƒÂ£o encontrado', HttpStatus.NOT_FOUND);
    }
    if (
      !usuario.twoFactorCode ||
      usuario.twoFactorCode !== codigo ||
      !usuario.twoFactorCodeExpiresAt ||
      usuario.twoFactorCodeExpiresAt < new Date()
    ) {
      throw new HttpException('CÃƒÂ³digo invÃƒÂ¡lido ou expirado', HttpStatus.BAD_REQUEST);
    }

    usuario.twoFactorCode = null;
    usuario.twoFactorCodeExpiresAt = null;
    await this.usuarioRepository.save(usuario);

    const { accessToken } =
      await this.jsonWebTokenService.createAccessToken({
        idUsuario: usuario.idUsuario,
      });
    return accessToken;
  }

  async buscarUsuarioPorId(idUsuario: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { idUsuario } });
  }
}
```

> ObservaÃƒÂ§ÃƒÂ£o: se vocÃƒÂª usa o nome `emailUsuario` no frontend, mantenha esta convenÃƒÂ§ÃƒÂ£o. No `LocalStrategy`, o campo enviado pelo formulÃƒÂ¡rio deve ser `email` ou vocÃƒÂª deve ajustar o request no controller.

### 7.10 Atualizar `JwtService`

Seu arquivo atual jÃƒÂ¡ cria access token e refresh token. O que faltava ÃƒÂ© deixar claro o uso de secrets diferentes e o `verify` correto.

```ts
// nest_academico/src/auth/service/jwt.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';

export interface UserToken {
  idUsuario: number;
}

@Injectable()
export class JsonWebTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createAccessToken(userToken: UserToken, timer?: number) {
    const { idUsuario } = userToken;
    const data: JwtPayload = { idUsuario };

    const expireInAccessToken = this.expireInSecondsAccessToken(timer);
    const secretAccessToken = this.secretAccessToken();
    const accessToken = await this.jwtService.signAsync(data, {
      secret: secretAccessToken,
      expiresIn: `${expireInAccessToken}s`,
    });
    return { accessToken, expireInAccessToken };
  }

  async createRefreshToken(usuario: UserToken) {
    const { idUsuario } = usuario;
    const data: JwtPayload = { idUsuario };

    const expireInRefreshToken = this.expireInSecondsRefreshToken();
    const secretRefreshToken = this.secretRefreshToken();
    const refreshToken = await this.jwtService.signAsync(data, {
      secret: secretRefreshToken,
      expiresIn: `${expireInRefreshToken}s`,
    });
    return { refreshToken, expireInRefreshToken };
  }

  private secretAccessToken() {
    return this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET');
  }

  private secretRefreshToken() {
    return this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET');
  }

  private expireInSecondsAccessToken(timer?: number): number {
    return (
      timer ?? this.configService.getOrThrow<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')
    );
  }

  private expireInSecondsRefreshToken() {
    return this.configService.getOrThrow<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.getOrThrow('JWT_VERIFICATION_TOKEN_SECRET'),
    });
  }
}
```

### 7.11 Corrigir `AuthController`

Substitua o cÃƒÂ³digo atual pelo seguinte, alinhando a rota com o frontend e usando o cookie corretamente:

```ts
// nest_academico/src/auth/controllers/auth.controllers.ts
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../dto/request/login.request';
import { RecoveryRequest } from '../dto/request/recovery.request';
import { ResetPasswordRequest } from '../dto/request/reset-password.request';
import { ValidateEmailRequest } from '../dto/request/validate-email.request';
import { ChangePasswordRequest } from '../dto/request/change-password.request';
import { TwoFactorRequest } from '../dto/request/two-factor.request';

@Controller('sistema/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: Request, @Body() loginRequest: LoginRequest) {
    const usuario = await this.authService.getAuthenticatedUser(
      loginRequest.emailUsuario,
      loginRequest.senhaUsuario,
    );
    const { accessToken } = await this.authService.getJwtAccessToken(usuario);
    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('validate-email')
  async validateEmail(@Body() body: ValidateEmailRequest) {
    await this.authService.validateEmail(body.token);
    return { message: 'E-mail validado com sucesso' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('request-password-recovery')
  async requestPasswordRecovery(@Body() body: RecoveryRequest) {
    await this.authService.requestPasswordRecovery(body.emailUsuario);
    return { message: 'Se o e-mail existir, um link foi enviado.' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordRequest) {
    await this.authService.resetPassword(body.token, body.novaSenha);
    return { message: 'Senha redefinida com sucesso' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  async changePassword(@Body() body: ChangePasswordRequest) {
    await this.authService.changePassword(
      body.idUsuario,
      body.senhaAtual,
      body.novaSenha,
    );
    return { message: 'Senha alterada com sucesso' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-2fa-code')
  async sendTwoFactorCode(@Body() body: { idUsuario: number }) {
    await this.authService.sendTwoFactorCode(body.idUsuario);
    return { message: 'CÃƒÂ³digo 2FA enviado por e-mail' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-2fa-code')
  async verifyTwoFactorCode(@Body() body: TwoFactorRequest) {
    const accessToken = await this.authService.verifyTwoFactorCode(
      body.idUsuario,
      body.codigo,
    );
    return { accessToken };
  }
}
```

> Dica: o endpoint de login deve ficar em `/sistema/auth/login`, porque o frontend `react_academico` usa essa rota.

### 7.12 Adicionar DTOs

**O que ÃƒÂ© um DTO?**
DTO = "Data Transfer Object" = ÃƒÂ© como um "formulÃƒÂ¡rio" que vocÃƒÂª envia para o backend.

Quando o frontend faz uma requisiÃƒÂ§ÃƒÂ£o POST, ele envia dados. O DTO ÃƒÂ© uma classe que:
- Define quais campos vocÃƒÂª DEVE enviar (email, senha)
- Define o tipo de cada campo (string, number, boolean)
- Valida automaticamente (email tem @ ? senha nÃƒÂ£o ÃƒÂ© vazia?)
- Rejeita campos extras

Crie os seguintes DTOs em `nest_academico/src/auth/dto/request/`:

`login.request.ts`
```ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @IsEmail()
  emailUsuario: string;

  @IsNotEmpty()
  @IsString()
  senhaUsuario: string;
}
```

`recovery.request.ts`
```ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RecoveryRequest {
  @IsEmail()
  @IsNotEmpty()
  emailUsuario: string;
}
```

`reset-password.request.ts`
```ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  novaSenha: string;
}
```

`validate-email.request.ts`
```ts
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateEmailRequest {
  @IsNotEmpty()
  @IsString()
  token: string;
}
```

`change-password.request.ts`
```ts
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class ChangePasswordRequest {
  @IsNumber()
  idUsuario: number;

  @IsString()
  @IsNotEmpty()
  senhaAtual: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  novaSenha: string;
}
```

`two-factor.request.ts`
```ts
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class TwoFactorRequest {
  @IsNumber()
  idUsuario: number;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  codigo: string;
}
```

### 7.13 Melhorar `EmailService`

O serviÃƒÂ§o de e-mail atual tem duas melhorias necessÃƒÂ¡rias:

- Corrigir o HTML do mÃƒÂ©todo `generateHtml`
- Usar templates ou contexto para criar o corpo do e-mail

Substitua o `EmailService` por esta versÃƒÂ£o:

```ts
// nest_academico/src/mail/service/email.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MailPayload } from '../config/mail-options';
import { EmailExceptions } from '@/commons/exceptions/error/email.exceptions';

@Injectable()
export class EmailService {
  private mailTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.mailTransport = createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: this.configService.get('EMAIL_TLS'),
      },
      ignoreTLS: !this.configService.get('EMAIL_TLS'),
    });
  }

  async sendMail(options: MailPayload) {
    if (!options.from) {
      throw new EmailExceptions(
        'ERRO NOS DADOS DE ENVIO DO EMAIL',
        HttpStatus.BAD_REQUEST,
        "Campo 'from' do e-mail nÃƒÂ£o informado",
      );
    }

    try {
      await this.mailTransport.sendMail({
        from: options.from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      });
    } catch (error: any) {
      throw new Error('Falha no envio do mail: ' + error.message);
    }
  }

  async sendRegisterEmailConfirmation(
    email: string,
    nome: string,
    token: string,
  ) {
    const url = `http://localhost:3000/confirmacao-email?token=${encodeURIComponent(token)}`;
    const message = `Obrigado por se registrar. Clique no botÃƒÂ£o abaixo para ativar sua conta.`;

    const html = this.generateHtml(
      'ConfirmaÃƒÂ§ÃƒÂ£o de registro',
      nome,
      message,
      url,
      'Confirmar e-mail',
    );

    const text = `OlÃƒÂ¡ ${nome},\n\n${message}\n\nLink: ${url}`;

    return this.sendMail({
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
      to: email,
      subject: 'ConfirmaÃƒÂ§ÃƒÂ£o de Registro',
      text,
      html,
    });
  }

  async sendResetPasswordEmail(
    email: string,
    nome: string,
    token: string,
  ) {
    const url = `http://localhost:3000/redefinir-senha?token=${encodeURIComponent(token)}`;
    const message = `VocÃƒÂª solicitou a recuperaÃƒÂ§ÃƒÂ£o de senha. Clique no botÃƒÂ£o abaixo para redefinir sua senha.`;

    const html = this.generateHtml(
      'RecuperaÃƒÂ§ÃƒÂ£o de senha',
      nome,
      message,
      url,
      'Redefinir senha',
    );

    const text = `OlÃƒÂ¡ ${nome},\n\n${message}\n\nLink: ${url}`;

    return this.sendMail({
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
      to: email,
      subject: 'RecuperaÃƒÂ§ÃƒÂ£o de senha',
      text,
      html,
    });
  }

  async sendTwoFactorCode(email: string, nome: string, codigo: string) {
    const message = `Seu cÃƒÂ³digo de autenticaÃƒÂ§ÃƒÂ£o de dois fatores ÃƒÂ©: ${codigo}. Ele expira em 5 minutos.`;

    const html = this.generateHtml('CÃƒÂ³digo 2FA', nome, message, '', '');
    const text = `OlÃƒÂ¡ ${nome},\n\n${message}`;

    return this.sendMail({
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
      to: email,
      subject: 'CÃƒÂ³digo de autenticaÃƒÂ§ÃƒÂ£o de dois fatores',
      text,
      html,
    });
  }

  private generateHtml(
    title: string,
    nome: string,
    message: string,
    url: string,
    buttonLabel: string,
  ) {
    const button = url
      ? `<a href="${url}" style="display:inline-block;padding:12px 18px;background:#007bff;color:#fff;text-decoration:none;border-radius:6px;">${buttonLabel}</a>`
      : '';

    return `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #007bff;">${title}</h2>
            <p>OlÃƒÂ¡ <strong>${nome}</strong>,</p>
            <p>${message}</p>
            ${button}
            <p style="margin-top: 24px; color: #999; font-size: 14px;">Se vocÃƒÂª nÃƒÂ£o solicitou essa aÃƒÂ§ÃƒÂ£o, ignore esta mensagem.</p>
          </div>
        </body>
      </html>
    `;
  }
}
```

> ObservaÃƒÂ§ÃƒÂ£o: o `TemplateService` atual nÃƒÂ£o estÃƒÂ¡ sendo usado, mas vocÃƒÂª pode mantÃƒÂª-lo para gerar HTML avanÃƒÂ§ado. Priorize primeiro as rotas de e-mail funcionais.

### 7.14 Atualizar `EmailModule`

O `EmailModule` pode ficar assim:

```ts
import { Global, Module } from '@nestjs/common';
import { EmailService } from './service/email.service';

@Global()
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
```

### 7.15 Ajustar `UsuarioModule` para enviar e-mail de confirmaÃƒÂ§ÃƒÂ£o

No momento do cadastro, chame o `EmailService` para enviar o link de confirmaÃƒÂ§ÃƒÂ£o. O melhor lugar ÃƒÂ© no `UsuarioService` que cria o usuÃƒÂ¡rio.

```ts
const novoUsuario = this.usuarioRepository.create({
  ...dados,
  senhaUsuario: await bcrypt.hash(dados.senhaUsuario, BCRYPT_SALT_ROUNDS),
  tokenValidacaoEmail: uuidv4(),
  statusValidacao: false,
});
await this.usuarioRepository.save(novoUsuario);
await this.emailService.sendRegisterEmailConfirmation(
  novoUsuario.emailUsuario,
  novoUsuario.nomeUsuario,
  novoUsuario.tokenValidacaoEmail,
);
```

> Use `uuidv4()` do `uuid` ou outro gerador de token seguro.

### 7.16 Proteger rotas com `JwtAuthGuard`

Crie `nest_academico/src/auth/config/guard/jwt-auth.guard.ts`:

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Use no controller de usuÃƒÂ¡rio ou em qualquer recurso privado:

```ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/config/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('listar')
async listarUsuarios() {
  return this.usuarioService.listarTodos();
}
```

### 7.17 Testando o backend

1. Suba o backend com `npm run start:dev` em `nest_academico`.
2. Use o Postman para testar `/sistema/auth/login`.
3. Teste `/sistema/auth/request-password-recovery` com um e-mail cadastrado.
4. Teste `/sistema/auth/reset-password` com o token enviado por e-mail.
5. Teste `/sistema/auth/validate-email` com o token de confirmaÃƒÂ§ÃƒÂ£o.
6. Teste um endpoint protegido pelo `JwtAuthGuard` usando `Authorization: Bearer <token>`.

---

## 7.18 Troubleshooting (o que fazer se der erro)

### Erro: "Cannot find module '@nestjs/passport'"

**SoluÃƒÂ§ÃƒÂ£o**: vocÃƒÂª nÃƒÂ£o instalou a dependÃƒÂªncia. Execute no terminal:
```bash
npm install @nestjs/passport passport passport-local
```

### Erro: "src/auth/config/strategy/jwt/jwt.strategy.ts does not exist"

**SoluÃƒÂ§ÃƒÂ£o**: vocÃƒÂª precisa criar o arquivo. Siga a seÃƒÂ§ÃƒÂ£o 6.8 do tutorial.

### Erro: "Property 'tokenValidacaoEmail' does not exist on type 'Usuario'"

**SoluÃƒÂ§ÃƒÂ£o**: a entidade Usuario nÃƒÂ£o foi atualizada. Siga a seÃƒÂ§ÃƒÂ£o 6.4 e acrescente os campos:
- statusValidacao
- tokenValidacaoEmail
- recoveryToken
- recoveryTokenExpiresAt
- twoFactorCode
- twoFactorCodeExpiresAt

### Erro: "ValidationPipe is not defined"

**SoluÃƒÂ§ÃƒÂ£o**: falta importar em `main.ts`. Procure pela linha `import { ValidationPipe }` e adicione se nÃƒÂ£o existir:
```ts
import { ValidationPipe } from '@nestjs/common';
```

### Erro ao fazer login: "Property 'emailUsuario' not found in LoginRequest"

**SoluÃƒÂ§ÃƒÂ£o**: vocÃƒÂª nÃƒÂ£o criou o DTO `LoginRequest`. Siga a seÃƒÂ§ÃƒÂ£o 6.12.

### Erro: "No auth guard found"

**SoluÃƒÂ§ÃƒÂ£o**: vocÃƒÂª esqueceu de importar e fornecer o JwtStrategy no AuthModule. Verifique a seÃƒÂ§ÃƒÂ£o 6.6.

### Erro: "Cannot GET /sistema/auth/login"

**SoluÃƒÂ§ÃƒÂ£o**: a rota estÃƒÂ¡ errada. Verifique se o AuthController estÃƒÂ¡ com `@Controller('sistema/auth')` e nÃƒÂ£o `@Controller('auth')`.

### Erro: "Email not sent"

**SoluÃƒÂ§ÃƒÂ£o**: as variÃƒÂ¡veis de ambiente de e-mail nÃƒÂ£o estÃƒÂ£o configuradas. Verifique se o `.env` tem:
```
EMAIL_HOST=smtp.seu_provedor.com
EMAIL_PORT=587
EMAIL_USER=seu_usuario
EMAIL_PASSWORD=sua_senha
EMAIL_FROM=seu@email.com
```

### Dica: Se o backend nÃƒÂ£o inicia

1. Olhe no terminal qual ÃƒÂ© a mensagem de erro
2. Procure essa mensagem neste documento (use Ctrl+F)
3. Se nÃƒÂ£o encontrar, o erro ÃƒÂ© de sintaxe no cÃƒÂ³digo (esqueceu vÃƒÂ­rgula, parÃƒÂªntese, etc.)
4. Abra o arquivo que foi alterado por ÃƒÂºltimo e procure por erros ÃƒÂ³bvios

---

## 8. Frontend: implementaÃƒÂ§ÃƒÂ£o completa

### 5.1 Estado atual do frontend

JÃƒÂ¡ existe: login view, hook `useLogin`, hook `useAuth`, rota de login, `ProtectedRoute` comentada.

Ainda faltam:

- Interceptor Axios para enviar token
- Redirecionamento apÃƒÂ³s login
- PÃƒÂ¡ginas de recuperaÃƒÂ§ÃƒÂ£o de senha e confirmaÃƒÂ§ÃƒÂ£o de e-mail
- Uso efetivo de `ProtectedRoute`
- AtualizaÃƒÂ§ÃƒÂ£o de rotas se quiser deixar `/sistema/auth/login`

### 5.2 Atualizar `config.axios.ts`

Adicione interceptor para enviar o token a cada requisiÃƒÂ§ÃƒÂ£o:

```ts
import axios from 'axios';
import { REST_CONFIG } from '../constant/sistema.constants';

export const http = axios.create({
  baseURL: REST_CONFIG.BASE_URL,
  timeout: 15000,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 5.3 Atualizar `useLogin.tsx`

Defina o redirecionamento apÃƒÂ³s login:

```ts
const onSubmitForm = async (e: any) => {
  e.preventDefault();
  if (!validarFormulario()) return;
  setIsLoading(true);

  try {
    const response = await apiLogin(model);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('usuario', JSON.stringify(response.usuario));
    navigate(ROTA.DASHBOARD);
  } catch (error: any) {
    if (error.response?.data?.message) {
      setErrors({ geral: [error.response.data.message] });
    } else {
      setErrors({ geral: ['Erro ao realizar login. Tente novamente.'] });
    }
  } finally {
    setIsLoading(false);
  }
};
```

### 5.4 Atualizar `ProtectedRoute.tsx`

Use esse componente para proteger pÃƒÂ¡ginas que sÃƒÂ³ podem ser acessadas por usuÃƒÂ¡rio logado.

```tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../services/auth/hook/useAuth';
import { ROTA } from '../../services/router/url';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROTA.AUTH.LOGIN} replace />;
  }

  return children;
}
```

### 5.5 Proteger rotas no `Router.tsx`

Substitua as rotas privadas pelo `ProtectedRoute`:

```tsx
{
  path: ROTA.USUARIO.LISTAR,
  element: (
    <ProtectedRoute>
      <ListarUsuario />
    </ProtectedRoute>
  ),
},
```

FaÃƒÂ§a isso para todas as rotas que sÃƒÂ³ devem ser acessÃƒÂ­veis apÃƒÂ³s login.

### 5.6 Atualizar a pÃƒÂ¡gina de login

A `Login.tsx` jÃƒÂ¡ estÃƒÂ¡ boa. Adicione um link para recuperar senha e, futuramente, para confirmaÃƒÂ§ÃƒÂ£o de e-mail:

```tsx
<Link to={ROTA.RECUPERAR_SENHA.SOLICITAR} className="text-decoration-none">
  Esqueci minha senha
</Link>
```

### 5.7 Criar pÃƒÂ¡ginas de recuperaÃƒÂ§ÃƒÂ£o e reset de senha

Crie os arquivos:

- `react_academico/src/views/auth/RequestPasswordRecovery.tsx`
- `react_academico/src/views/auth/ResetPassword.tsx`
- `react_academico/src/views/auth/ConfirmEmail.tsx`

Essas pÃƒÂ¡ginas devem usar hooks parecidos com `useLogin` e enviar os requests:

- `POST /sistema/auth/request-password-recovery`
- `POST /sistema/auth/reset-password`
- `POST /sistema/auth/validate-email`

### 5.8 Atualizar `api.auth.ts`

Adicione funÃƒÂ§ÃƒÂµes para as novas rotas:

```ts
export interface RecoveryRequest {
  emailUsuario: string;
}

export interface ResetPasswordRequest {
  token: string;
  novaSenha: string;
}

export interface ValidateEmailRequest {
  token: string;
}

export const apiRequestPasswordRecovery = async (
  dados: RecoveryRequest,
): Promise<void> => {
  await http.post('/sistema/auth/request-password-recovery', dados);
};

export const apiResetPassword = async (
  dados: ResetPasswordRequest,
): Promise<void> => {
  await http.post('/sistema/auth/reset-password', dados);
};

export const apiValidateEmail = async (
  dados: ValidateEmailRequest,
): Promise<void> => {
  await http.post('/sistema/auth/validate-email', dados);
};
```

### 5.9 Atualizar `useAuth.tsx`

O hook jÃƒÂ¡ funciona, mas vocÃƒÂª pode melhorar adicionando estado global com `useContext`. Enquanto isso, o `useEffect` existente ÃƒÂ© suficiente para reconhecer o token salvo.

### 5.10 Add logout no layout

No `Layout.tsx`, use `logout()` do `useAuth` para limpar o token e redirecionar o usuÃƒÂ¡rio.

### 5.11 PÃƒÂ¡ginas extras que valem a pena criar

- `Login` (jÃƒÂ¡ existe)
- `Register` (caso vocÃƒÂª ainda nÃƒÂ£o tenha)
- `ForgotPassword` / `RequestPasswordRecovery`
- `ResetPassword`
- `ConfirmEmail`
- `ChangePassword`
- `TwoFactorVerify`

Essas pÃƒÂ¡ginas sÃƒÂ£o a camada final do fluxo de autenticaÃƒÂ§ÃƒÂ£o.

---

## 8.1 Fluxo completo esperado

1. UsuÃƒÂ¡rio se registra.
2. Backend salva o usuÃƒÂ¡rio com `senhaUsuario` hash e `tokenValidacaoEmail`.
3. Backend envia e-mail de confirmaÃƒÂ§ÃƒÂ£o com o token.
4. UsuÃƒÂ¡rio clica no link e o frontend chama `/sistema/auth/validate-email`.
5. O backend atualiza `statusValidacao = true`.
6. UsuÃƒÂ¡rio faz login em `/sistema/auth/login`.
7. Backend valida e retorna `accessToken`.
8. Frontend guarda o token e permite acesso ÃƒÂ s rotas privadas.
9. Se o usuÃƒÂ¡rio esquecer a senha, ele pede `request-password-recovery`.
10. Backend envia link de reset com token temporÃƒÂ¡rio.
11. UsuÃƒÂ¡rio redefine senha em `/sistema/auth/reset-password`.
12. UsuÃƒÂ¡rio autenticado pode alterar senha em `/sistema/auth/change-password`.
13. Opcionalmente, o sistema pode enviar 2FA por e-mail e seguir o fluxo `send-2fa-code` / `verify-2fa-code`.

---

## 8.2 Checklist final

### Backend

- [ ] `Usuario` tem campos de validaÃƒÂ§ÃƒÂ£o e recuperaÃƒÂ§ÃƒÂ£o.
- [ ] `AuthModule` importa `PassportModule` e `JwtModule`.
- [ ] `AuthService` possui login, validaÃƒÂ§ÃƒÂ£o de e-mail, recuperaÃƒÂ§ÃƒÂ£o e reset.
- [ ] `JwtStrategy` estÃƒÂ¡ disponÃƒÂ­vel e o guard `JwtAuthGuard` protege rotas.
- [ ] `EmailService` envia e-mails com HTML vÃƒÂ¡lido.
- [ ] `main.ts` tem `ValidationPipe` global.
- [ ] Rotas em `AuthController` estÃƒÂ£o alinhadas com o frontend.

### Frontend

- [ ] Axios envia token no header Authorization.
- [ ] `useLogin` armazena token e redireciona.
- [ ] `ProtectedRoute` impede acessos sem login.
- [ ] Existem pÃƒÂ¡ginas para recuperaÃƒÂ§ÃƒÂ£o e confirmaÃƒÂ§ÃƒÂ£o de e-mail.
- [ ] O usuÃƒÂ¡rio vÃƒÂª erros amigÃƒÂ¡veis.

### OperaÃƒÂ§ÃƒÂ£o

- [ ] Login retorna token vÃƒÂ¡lido.
- [ ] Rotas protegidas respondem com 401 quando nÃƒÂ£o autenticado.
- [ ] Link de confirmaÃƒÂ§ÃƒÂ£o ativa o usuÃƒÂ¡rio.
- [ ] Token de recuperaÃƒÂ§ÃƒÂ£o expira.
- [ ] Reset de senha funciona sem expor a senha.

---

## 10. Colinha de referÃƒÂªncia: resumo rÃƒÂ¡pido da autenticaÃƒÂ§ÃƒÂ£o

Se vocÃƒÂª se perdeu na documentaÃƒÂ§ÃƒÂ£o gigante, aqui estÃƒÂ¡ a versÃƒÂ£o resumida do que estÃƒÂ¡ acontecendo:

### O que vocÃƒÂª precisa saber em 2 minutos

1. **Login**:
   - Frontend envia email + senha para `POST /sistema/auth/login`
   - Backend verifica com bcrypt.compare()
   - Backend volta com JWT no corpo `{ accessToken: "token..." }`
   - Frontend guarda no localStorage

2. **RequisiÃƒÂ§ÃƒÂµes autenticadas**:
   - Frontend coloca JWT no header: `Authorization: Bearer token...`
   - Backend valida com JwtStrategy
   - Se vÃƒÂ¡lido, deixa passar; se nÃƒÂ£o, rejeita com 401

3. **RecuperaÃƒÂ§ÃƒÂ£o de senha**:
   - Frontend envia email para `POST /sistema/auth/request-password-recovery`
   - Backend envia um token por e-mail
   - Frontend recebe token do usuÃƒÂ¡rio e envia para `POST /sistema/auth/reset-password`
   - Backend verifica se token nÃƒÂ£o expirou e muda a senha

4. **ValidaÃƒÂ§ÃƒÂ£o de e-mail**:
   - Frontend envia cÃƒÂ³digo para `POST /sistema/auth/validate-email`
   - Backend marca como validado no banco de dados

### Arquivos principais (nÃƒÂ£o ÃƒÂ© para copiar, apenas olhar)

**Backend**:
- `auth.module.ts` Ã¢â€ â€™ centraliza autenticaÃƒÂ§ÃƒÂ£o
- `auth.service.ts` Ã¢â€ â€™ lÃƒÂ³gica (login, validaÃƒÂ§ÃƒÂ£o de senha)
- `auth.controllers.ts` Ã¢â€ â€™ rotas HTTP
- `local.strategy.ts` Ã¢â€ â€™ lÃƒÂª email/senha do formulÃƒÂ¡rio
- `jwt.strategy.ts` Ã¢â€ â€™ lÃƒÂª token do header Authorization
- `jwt.service.ts` Ã¢â€ â€™ cria e valida tokens

**Frontend**:
- `Login.tsx` Ã¢â€ â€™ formulÃƒÂ¡rio que o usuÃƒÂ¡rio vÃƒÂª
- `useLogin.tsx` Ã¢â€ â€™ lÃƒÂ³gica para enviar dados para backend
- `useAuth.tsx` Ã¢â€ â€™ verifica se estÃƒÂ¡ logado
- `api.auth.ts` Ã¢â€ â€™ funÃƒÂ§ÃƒÂµes para chamadas HTTP
- `ProtectedRoute.tsx` Ã¢â€ â€™ bloqueia rotas nÃƒÂ£o autenticadas

### Debug rÃƒÂ¡pido

Se o login nÃƒÂ£o funciona:
1. Verifique se o backend estÃƒÂ¡ rodando (`npm run start:dev` em nest_academico)
2. Teste a rota `/sistema/auth/login` no Postman
3. Verifique se Email/Senha correspondem a um usuÃƒÂ¡rio no banco
4. Veja se a senha foi hash com bcrypt (tem $ na frente)

Se o token nÃƒÂ£o funciona:
1. Copie o token do response do login
2. VÃƒÂ¡ para `https://jwt.io`
3. Cole o token lÃƒÂ¡
4. Veja se o campo "sub" ou "email" estÃƒÂ¡ presente
5. Se expirou, veja a field "exp"

Se a rota protegida rejeita:
1. Copie o token do localStorage (F12 Ã¢â€ â€™ Application Ã¢â€ â€™ localStorage)
2. Envie como `Authorization: Bearer SEU_TOKEN`
3. Se der 401, o token pode estar expirado ou invÃƒÂ¡lido

### Fluxo visual do login (o que acontece passo a passo)

```
Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â              Ã¢â€Å’Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â
Ã¢â€â€š  FRONTEND REACT  Ã¢â€â€š              Ã¢â€â€š  BACKEND NESTJS  Ã¢â€â€š
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ              Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Ëœ
         Ã¢â€â€š                                  Ã¢â€â€š
         Ã¢â€â€š 1. UsuÃƒÂ¡rio digita email+senha    Ã¢â€â€š
         Ã¢â€â€š 2. Clica "Entrar"                Ã¢â€â€š
         Ã¢â€â€š                                  Ã¢â€â€š
         Ã¢â€â€š 3. POST /sistema/auth/login      Ã¢â€â€š
         Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬>Ã¢â€â€š
         Ã¢â€â€š    {email, senha}                Ã¢â€â€š
         Ã¢â€â€š                                  Ã¢â€â€š
         Ã¢â€â€š                   4. Valida email no banco
         Ã¢â€â€š                   5. Compara senha com bcrypt.compare()
         Ã¢â€â€š                   6. Se correto, gera JWT
         Ã¢â€â€š                                  Ã¢â€â€š
         Ã¢â€â€š    <Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¤
         Ã¢â€â€š {accessToken: "eyJhbGc..."}      Ã¢â€â€š
         Ã¢â€â€š                                  Ã¢â€â€š
         Ã¢â€â€š 7. Guarda token no localStorage  Ã¢â€â€š
         Ã¢â€â€š 8. Redireciona para /dashboard   Ã¢â€â€š
         Ã¢â€â€š                                  Ã¢â€â€š
         Ã¢â€â€š 9. Buscar dados em /api/usuarios Ã¢â€â€š
         Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬>Ã¢â€â€š
         Ã¢â€â€š Authorization: Bearer eyJhbGc... Ã¢â€â€š
         Ã¢â€â€š                                  Ã¢â€â€š
         Ã¢â€â€š                 10. Valida token (JwtStrategy)
         Ã¢â€â€š                 11. Se vÃƒÂ¡lido, retorna dados
         Ã¢â€â€š    <Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€Â¤
         Ã¢â€â€š    {usuarios: [...]}             Ã¢â€â€š
         Ã¢â€â€š                                  Ã¢â€â€š

Ã¢Å¾Å“ FIM: UsuÃƒÂ¡rio logado e consegue acessar dados protegidos!
```

---

## 11. Mapa do documento

Este documento contÃƒÂ©m as seÃƒÂ§ÃƒÂµes:

1. **IntroduÃƒÂ§ÃƒÂ£o**: O que ÃƒÂ© este documento
2. **Conceitos bÃƒÂ¡sicos**: JWT, bcrypt, Guards, Strategies em linguagem simples
3. **Estado atual**: O que jÃƒÂ¡ existe e o que falta
4. **PrÃƒÂ©-requisitos**: Como instalar as dependÃƒÂªncias
5. **Objetivo final**: O que o sistema deve fazer
6. **Como usar este tutorial**: Passo a passo para nÃƒÂ£o se perder
7. **Backend implementaÃƒÂ§ÃƒÂ£o**: Todos os arquivos NestJS detalhados com cÃƒÂ³digo
8. **Frontend implementaÃƒÂ§ÃƒÂ£o**: Todos os arquivos React detalhados com cÃƒÂ³digo
9. **PrÃƒÂ³ximos tÃƒÂ³picos**: O que estudar depois
10. **Colinha de referÃƒÂªncia**: Resumo rÃƒÂ¡pido para consulta

**Dica final**: Leia o conceito Ã¢â€ â€™ Veja o cÃƒÂ³digo Ã¢â€ â€™ Copie e cole Ã¢â€ â€™ Teste Ã¢â€ â€™ Se der erro, procure em "Troubleshooting".

---

## 12. Guia rÃƒÂ¡pido: o que faz cada arquivo?

### Backend (NestJS)

| Arquivo | O que faz? | Simples assim |
|---------|----------|---------------|
| `auth.module.ts` | Centraliza autenticaÃƒÂ§ÃƒÂ£o | "Ah, tudo de auth estÃƒÂ¡ aqui!" |
| `auth.service.ts` | LÃƒÂ³gica de login/senha | Verifica se email/senha batem |
| `auth.controllers.ts` | Rotas HTTP (`/login`, `/reset-password`) | "Por aqui entra e sai dados" |
| `local.strategy.ts` | LÃƒÂª email+senha do form | "Pega o que o usuÃƒÂ¡rio digitou" |
| `jwt.strategy.ts` | LÃƒÂª token do header Authorization | "Valida se o crachÃƒÂ¡ ÃƒÂ© real" |
| `jwt.service.ts` | Cria/valida tokens JWT | "Faz e verifica os crachÃƒÂ¡s" |
| `main.ts` | Inicia o servidor | "Liga tudo junto e pronto!" |

### Frontend (React)

| Arquivo | O que faz? | Simples assim |
|---------|----------|---------------|
| `Login.tsx` | A pÃƒÂ¡gina que o usuÃƒÂ¡rio vÃƒÂª | Tem os campos email/senha |
| `useLogin.tsx` | Envia email/senha pro backend | "Faz o POST para /login" |
| `useAuth.tsx` | Verifica se estÃƒÂ¡ logado | "Tem token no localStorage?" |
| `api.auth.ts` | FunÃƒÂ§ÃƒÂµes HTTP reutilizÃƒÂ¡veis | "MÃƒÂ©todos para chamar a API" |
| `config.axios.ts` | Configura axios | "Aqui coloca o token em toda requisiÃƒÂ§ÃƒÂ£o" |
| `ProtectedRoute.tsx` | Bloqueia rota sem login | "Sem token? Volta pro login!" |
| `Router.tsx` | Define quais rotas existem | "Tipo um mapa do site" |

---

## 13. PrÃƒÂ³ximos tÃƒÂ³picos depois da prova

Depois de terminar este fluxo de autenticaÃƒÂ§ÃƒÂ£o, os prÃƒÂ³ximos temas do curso sÃƒÂ£o:

- PaginaÃƒÂ§ÃƒÂ£o
- HATEOAS

Esses dois temas sÃƒÂ£o trabalhos separados e devem ficar para depois de concluir o sistema de autenticaÃƒÂ§ÃƒÂ£o.

---

## 14. Resumo rÃƒÂ¡pido do que fazer primeiro

1. Corrigir `auth.controllers.ts` e alinhar a rota de login.
2. Atualizar `AuthModule` para usar `PassportModule`.
3. Adicionar `ValidationPipe` em `main.ts`.
4. Ajustar `EmailService` e garantir envio de e-mail.
5. Expandir `AuthService` com validaÃƒÂ§ÃƒÂ£o de e-mail e recuperaÃƒÂ§ÃƒÂ£o de senha.
6. Atualizar o frontend com interceptor Axios e rotas protegidas.
7. Testar todo fluxo.

Se vocÃƒÂª seguir este tutorial passo a passo, terÃƒÂ¡ um sistema de autenticaÃƒÂ§ÃƒÂ£o completo e pronto para a prova.
