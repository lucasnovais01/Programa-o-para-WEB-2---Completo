# Quarta Atividade — Login com JWT

> **Para quem é este tutorial?**
> Para quem já concluiu a Tarefa 1 (módulo de Registro de Usuário) e precisa agora
> implementar o Login com segurança (JWT). Leia devagar — cada bloco de código tem
> comentários explicando o *porquê*, não apenas o *o quê*.

---

## Índice

1. [O que vai ser construído?](#1-o-que-vai-ser-construído)
2. [Conceitos essenciais (leia antes de codificar)](#2-conceitos-essenciais)
3. [Backend — passo a passo](#3-backend--passo-a-passo)
4. [Frontend — passo a passo](#4-frontend--passo-a-passo)
5. [Testando no Postman](#5-testando-no-postman)
6. [Dúvidas frequentes](#6-dúvidas-frequentes)
7. [Resumo do que mudou em relação ao Registro](#7-resumo-do-que-mudou)

---

## 1. O que vai ser construído?

O fluxo completo é simples:

```
[Usuário digita e-mail + senha]
         ↓
[Frontend envia para o backend]
         ↓
[Backend verifica e-mail e senha no banco de dados]
         ↓
[Backend gera um "crachá digital" chamado JWT]
         ↓
[Frontend guarda esse crachá]
         ↓
[Em toda página protegida, o frontend mostra o crachá]
         ↓
[Backend verifica se o crachá é válido e libera o acesso]
```

---

## 2. Conceitos essenciais

### 2.1. O que é JWT?

**JWT** (JSON Web Token) é como um crachá de visitante num prédio.

- Quando você entra (faz login), a recepcionista (o backend) te entrega um crachá.
- Com esse crachá, você pode entrar em qualquer sala autorizada sem precisar se
  identificar de novo.
- O crachá tem prazo de validade — depois de 1 hora (por exemplo), ele expira e você
  precisa fazer login de novo.
- Ninguém consegue falsificar o crachá porque ele é assinado digitalmente.

```
JWT parece assim (é uma string longa dividida em 3 partes por pontos):
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdGVAZW1haWwuY29tIn0.assinatura
|------- CABEÇALHO (tipo e algoritmo) ---------|.|----- DADOS (id, e-mail) -----|.|- ASSINATURA -|
```

Você não precisa entender a estrutura interna — só precisa saber que o backend **gera**
e o frontend **guarda e envia** o JWT.

---

### 2.2. O que é bcrypt?

**bcrypt** é uma função que transforma a senha numa sequência embaralhada:

```
senha original:  minhasenha123
depois do hash:  $2b$10$Xyz9kLmNoPqRsTuVwXyZ...
```

- Esse processo é **irreversível** — não dá para descobrir a senha original a partir
  do hash.
- Na hora do login, o bcrypt **compara** a senha digitada com o hash guardado.
- Isso garante que, mesmo que alguém invada o banco de dados, não vai conseguir
  as senhas.

> **Já implementado na Tarefa 1:** se você seguiu o tutorial do Registro, o bcrypt
> já está instalado e já está gerando hash ao criar usuários. Aqui vamos apenas
> *usar* a função `compare` do bcrypt, que é nova.

---

### 2.3. O que é Passport?

**Passport** é uma biblioteca que ajuda o NestJS a "entender" tokens JWT nas
requisições. Pense nele como o segurança na porta que lê o crachá.

- Ele intercepta requisições para rotas protegidas.
- Lê o token do cabeçalho `Authorization`.
- Verifica se o token é válido e não expirou.
- Se estiver tudo certo, deixa a requisição passar.

---

### 2.4. Módulo separado ou dentro do módulo Usuario?

O módulo de autenticação (`auth`) **fica em uma pasta separada**, mas **não cria
uma nova tabela**. Ele reutiliza a entidade `Usuario` que já existe.

```
src/
├── usuario/          ← módulo da Tarefa 1 (não mexer)
│   └── entity/
│       └── usuario.entity.ts   ← entidade que o auth vai reutilizar
└── auth/             ← novo módulo que vamos criar agora
    ├── constants/
    ├── controllers/
    ├── dto/
    ├── guards/
    ├── strategies/
    └── service/
```

---

### 2.5. Sobre o módulo de "Alterar Senha"

> **Dúvida comum:** preciso criar um módulo separado chamado `alterar-senha`?

**Não.** A alteração de senha pode ficar dentro do módulo `auth` ou até dentro do
módulo `usuario`. Criar um módulo separado só para isso é desnecessário para este
projeto. A Tarefa 2 pede a **funcionalidade**, não uma pasta específica.

---

## 3. Backend — passo a passo

### Passo 1 — Instalar as dependências

Abra o terminal na pasta `nest_academico` e execute:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

> `bcrypt` provavelmente já está instalado da Tarefa 1. Não tem problema instalar
> de novo — o npm vai apenas confirmar que já está lá.

---

### Passo 2 — Criar a estrutura de pastas

Dentro de `nest_academico/src/`, crie a pasta `auth` com esta estrutura:

```
auth/
├── constants/
│   └── auth.constants.ts
├── controllers/
│   └── auth.controller.ts
├── dto/
│   ├── request/
│   │   └── login.request.ts
│   └── response/
│       └── login.response.ts
├── guards/
│   └── jwt-auth.guard.ts
├── strategies/
│   └── jwt.strategy.ts
├── service/
│   └── auth.service.ts
└── auth.module.ts
```

Você pode criar as pastas e arquivos vazios primeiro, depois ir preenchendo um por um.

---

### Passo 3 — Criar as constantes

```typescript
// filepath: nest_academico/src/auth/constants/auth.constants.ts

// Esta é a chave secreta usada para assinar e verificar os tokens JWT.
// IMPORTANTE: em um projeto real, nunca coloque a chave aqui — use variável de ambiente.
// Para fins acadêmicos, uma string fixa está ok.
export const JWT_SECRET = 'chave-secreta-do-projeto-academico';

// Tempo de validade do token. '1h' significa 1 hora.
export const JWT_EXPIRES_IN = '1h';
```

---

### Passo 4 — Criar os DTOs

**DTO de entrada (o que o usuário envia ao fazer login):**

```typescript
// filepath: nest_academico/src/auth/dto/request/login.request.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty({ message: 'O e-mail deve ser informado' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @ApiProperty({ description: 'E-mail do usuário', example: 'joao@email.com' })
  emailUsuario: string;

  @IsNotEmpty({ message: 'A senha deve ser informada' })
  @IsString()
  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  senhaUsuario: string;
}
```

**DTO de saída (o que o backend retorna após o login):**

```typescript
// filepath: nest_academico/src/auth/dto/response/login.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string; // O crachá JWT

  @ApiProperty({ example: 'Bearer' })
  tokenType: string; // Sempre "Bearer" — é o padrão

  @ApiProperty({ example: 3600 })
  expiresIn: number; // Tempo de expiração em segundos (3600 = 1 hora)

  @ApiProperty()
  usuario: {
    idUsuario: number;
    nomeUsuario: string;
    sobrenomeUsuario: string;
    emailUsuario: string;
  };
}
```

---

### Passo 5 — Criar o Service

Este é o arquivo mais importante. Ele faz três coisas:
1. Busca o usuário no banco pelo e-mail
2. Compara a senha digitada com o hash no banco
3. Gera e retorna o token JWT

```typescript
// filepath: nest_academico/src/auth/service/auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt'; // ← função para comparar senha com hash
import { Usuario } from '../../usuario/entity/usuario.entity'; // ← reutilizando entidade existente
import { LoginRequest } from '../dto/request/login.request';
import { LoginResponse } from '../dto/response/login.response';

@Injectable()
export class AuthService {

  // O NestJS injeta automaticamente o repositório de Usuario e o serviço JWT.
  // Não precisamos criar uma entidade "Auth" — usamos a mesma tabela de usuários.
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {

    // PASSO 1: Buscar o usuário pelo e-mail
    const usuario = await this.usuarioRepository.findOne({
      where: { emailUsuario: loginRequest.emailUsuario },
    });

    // PASSO 2: Se não encontrou o usuário, lançar erro genérico
    // (nunca diga "e-mail não encontrado" — isso revela quais e-mails estão cadastrados)
    if (!usuario) {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // PASSO 3: Comparar a senha digitada com o hash guardado no banco
    const senhaEstaCorreta = await compare(
      loginRequest.senhaUsuario,   // o que o usuário digitou agora
      usuario.senhaUsuario,        // o hash que está no banco de dados
    );

    if (!senhaEstaCorreta) {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // PASSO 4: Montar o "payload" — as informações que vão dentro do token JWT
    // Não coloque a senha aqui! Só informações que você precisará usar depois.
    const payload = {
      sub: usuario.idUsuario,          // "sub" é padrão JWT para identificar o usuário
      email: usuario.emailUsuario,
      nome: usuario.nomeUsuario,
    };

    // PASSO 5: Gerar o token JWT assinado
    const accessToken = await this.jwtService.signAsync(payload);

    // PASSO 6: Retornar o token e os dados básicos do usuário
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

  // Este método é usado pela estratégia JWT para validar tokens em rotas protegidas.
  // Ele recebe o ID do usuário que estava dentro do token e busca no banco.
  async buscarUsuarioPorId(idUsuario: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { idUsuario } });
  }
}
```

---

### Passo 6 — Criar a Estratégia JWT

Este arquivo ensina o Passport a "ler" e verificar o token JWT:

```typescript
// filepath: nest_academico/src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../service/auth.service';
import { JWT_SECRET } from '../constants/auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // Instrui o Passport a pegar o token do cabeçalho "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Se o token estiver expirado, rejeitar a requisição
      ignoreExpiration: false,
      // A mesma chave usada para assinar — necessária para verificar a assinatura
      secretOrKey: JWT_SECRET,
    });
  }

  // Este método é chamado automaticamente após o token ser validado.
  // O "payload" contém os dados que foram colocados no token quando foi gerado.
  async validate(payload: { sub: number; email: string; nome: string }) {
    const usuario = await this.authService.buscarUsuarioPorId(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    // O que for retornado aqui fica disponível como `request.user` nos controllers
    return usuario;
  }
}
```

---

### Passo 7 — Criar o Guard

O Guard é o "porteiro" que usa a estratégia JWT para proteger rotas:

```typescript
// filepath: nest_academico/src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Esta classe usa o AuthGuard do Passport com a estratégia 'jwt'.
// Para proteger uma rota, basta adicionar @UseGuards(JwtAuthGuard) no controller.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**Como usar o Guard em outro controller:**

```typescript
// Exemplo: protegendo o endpoint de listar usuários
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)  // ← adicione isto antes do método
@Get('listar')
async listar() {
  // Só usuários com token válido chegam aqui
}
```

---

### Passo 8 — Criar o Controller

```typescript
// filepath: nest_academico/src/auth/controllers/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';
import { AuthService } from '../service/auth.service';
import { LoginRequest } from '../dto/request/login.request';

@Controller(ROTA.AUTH.BASE)   // → prefixo: /sistema/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)     // retorna status 200 (não 201)
  @Post(ROTA.AUTH.LOGIN)       // → POST /sistema/auth/login
  async login(
    @Req() req: Request,
    @Body() loginRequest: LoginRequest,
  ): Promise<Result<any>> {
    const response = await this.authService.login(loginRequest);
    const _link = gerarLinks(req, 'auth', null);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Login realizado com sucesso',
      response,
      req.path,
      null,
      _link,
    );
  }
}
```

**Adicionar a rota no arquivo de constantes de URL:**

```typescript
// filepath: nest_academico/src/commons/constants/url.sistema.ts
export const ROTA = {
  // ... rotas existentes ...
  AUTH: {
    BASE: 'sistema/auth',
    LOGIN: 'login',
  },
};
```

---

### Passo 9 — Criar o Módulo

```typescript
// filepath: nest_academico/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entity/usuario.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWT_SECRET, JWT_EXPIRES_IN } from './constants/auth.constants';

@Module({
  imports: [
    // Permite que este módulo use o Repository<Usuario>
    TypeOrmModule.forFeature([Usuario]),

    // Configuração básica do Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configuração do JWT: chave secreta e tempo de expiração
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // exports permite que outros módulos usem o AuthService e o JwtStrategy
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

---

### Passo 10 — Registrar o módulo no App

```typescript
// filepath: nest_academico/src/app/app.module.ts
import { AuthModule } from 'src/auth/auth.module';  // ← adicionar esta linha

@Module({
  imports: [
    // ... outros módulos já existentes ...
    AuthModule,   // ← adicionar aqui
  ],
})
export class AppModule {}
```

---

## 4. Frontend — passo a passo

### Passo 1 — Adicionar o token ao Axios

Configure o Axios para incluir o token JWT em todas as requisições.
Encontre ou crie o arquivo de configuração do Axios:

```typescript
// filepath: react_academico/src/services/axios/config.axios.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8000/rest',
});

// Este "interceptor" roda antes de CADA requisição.
// Ele pega o token do localStorage e coloca no cabeçalho automaticamente.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    // O formato padrão é: "Authorization: Bearer eyJhbGci..."
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Este interceptor roda quando uma resposta de erro chega.
// Se o servidor retornar 401 (não autorizado), o token está inválido/expirado.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpa o token inválido e redireciona para o login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('usuario');
      window.location.href = '/login'; // ajuste para a rota de login do seu projeto
    }
    return Promise.reject(error);
  },
);
```

---

### Passo 2 — Criar a função de chamada à API de Login

```typescript
// filepath: react_academico/src/services/auth/api/api.auth.ts
import { http } from '../../axios/config.axios';

// Tipos para os dados que enviamos e recebemos
interface LoginRequest {
  emailUsuario: string;
  senhaUsuario: string;
}

interface UsuarioLogado {
  idUsuario: number;
  nomeUsuario: string;
  sobrenomeUsuario: string;
  emailUsuario: string;
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  usuario: UsuarioLogado;
}

// Chama o endpoint de login e retorna os dados
export const apiLogin = async (dados: LoginRequest): Promise<LoginResponse> => {
  const resposta = await http.post('/sistema/auth/login', dados);
  // O backend retorna o resultado dentro de um objeto "data" (padrão do projeto)
  return resposta.data.data;
};
```

---

### Passo 3 — Criar o Hook de Login

O hook contém toda a lógica do formulário de login:

```typescript
// filepath: react_academico/src/services/auth/hook/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiLogin } from '../api/api.auth';
import { ROTA } from '../../router/url'; // ajuste para o caminho correto

// Tipo dos erros de validação
interface ErrosLogin {
  emailUsuario?: boolean;
  emailUsuarioMensagem?: string;
  senhaUsuario?: boolean;
  senhaUsuarioMensagem?: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  // Estado do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estado de feedback
  const [erros, setErros] = useState<ErrosLogin>({});
  const [mensagemErroGeral, setMensagemErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Validação simples dos campos antes de enviar
  const validar = (): boolean => {
    const novosErros: ErrosLogin = {};

    if (!email) {
      novosErros.emailUsuario = true;
      novosErros.emailUsuarioMensagem = 'O e-mail é obrigatório';
    } else if (!email.includes('@')) {
      novosErros.emailUsuario = true;
      novosErros.emailUsuarioMensagem = 'Informe um e-mail válido';
    }

    if (!senha) {
      novosErros.senhaUsuario = true;
      novosErros.senhaUsuarioMensagem = 'A senha é obrigatória';
    }

    setErros(novosErros);
    // Retorna true se não houver erros
    return Object.keys(novosErros).length === 0;
  };

  // Função chamada ao clicar em "Entrar"
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // evita reload da página
    setMensagemErroGeral('');

    if (!validar()) return; // para aqui se houver erros de validação

    setCarregando(true);
    try {
      const resposta = await apiLogin({ emailUsuario: email, senhaUsuario: senha });

      // Guarda o token e os dados do usuário no localStorage
      localStorage.setItem('accessToken', resposta.accessToken);
      localStorage.setItem('usuario', JSON.stringify(resposta.usuario));

      // Redireciona para a página principal após login
      navigate(ROTA.USUARIO.LISTAR); // ajuste para a rota desejada
    } catch (erro: any) {
      // Se o backend retornou 401, mostra mensagem de credenciais inválidas
      const mensagem =
        erro.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
      setMensagemErroGeral(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return {
    email,
    setEmail,
    senha,
    setSenha,
    erros,
    mensagemErroGeral,
    carregando,
    handleSubmit,
  };
};
```

---

### Passo 4 — Criar a tela de Login

```tsx
// filepath: react_academico/src/views/auth/Login.tsx
import { Link } from 'react-router-dom';
import { useLogin } from '../../services/auth/hook/useLogin';
import { ROTA } from '../../services/router/url'; // ajuste para o caminho correto

export default function Login() {
  const {
    email,
    setEmail,
    senha,
    setSenha,
    erros,
    mensagemErroGeral,
    carregando,
    handleSubmit,
  } = useLogin();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h2 className="mb-4 text-center">Login</h2>

          {/* Mensagem de erro geral (credenciais inválidas, etc.) */}
          {mensagemErroGeral && (
            <div className="alert alert-danger">{mensagemErroGeral}</div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Campo e-mail */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                id="email"
                type="email"
                className={`form-control ${erros.emailUsuario ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {erros.emailUsuario && (
                <div className="invalid-feedback">{erros.emailUsuarioMensagem}</div>
              )}
            </div>

            {/* Campo senha */}
            <div className="mb-3">
              <label htmlFor="senha" className="form-label">Senha</label>
              <input
                id="senha"
                type="password"
                className={`form-control ${erros.senhaUsuario ? 'is-invalid' : ''}`}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {erros.senhaUsuario && (
                <div className="invalid-feedback">{erros.senhaUsuarioMensagem}</div>
              )}
            </div>

            {/* Link para recuperar senha */}
            <div className="mb-3">
              <Link to={ROTA.RECUPERAR_SENHA?.SOLICITAR ?? '/recuperar-senha'}>
                Esqueci minha senha
              </Link>
            </div>

            {/* Botão de login */}
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>

            {/* Link para cadastro */}
            <div className="mt-3 text-center">
              <span>Não tem conta? </span>
              <Link to={ROTA.USUARIO.CRIAR}>Cadastre-se</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
```

---

### Passo 5 — Adicionar a rota de Login no Router

```tsx
// filepath: react_academico/src/services/router/Router.tsx
import Login from '../../views/auth/Login';

// Dentro do seu componente de rotas, adicione:
<Route path={ROTA.AUTH.LOGIN} element={<Login />} />
```

**Adicionar a constante no arquivo de rotas do frontend:**

```typescript
// filepath: react_academico/src/services/router/url.ts
export const ROTA = {
  // ... rotas existentes ...
  AUTH: {
    LOGIN: '/login',
  },
};
```

---

### Passo 6 — Criar o componente de Rota Protegida

Este componente redireciona para o login quando o usuário não está autenticado:

```tsx
// filepath: react_academico/src/components/auth/RotaProtegida.tsx

// O que este componente faz:
// - Verifica se há um token no localStorage
// - Se houver → renderiza a página normalmente
// - Se não houver → redireciona para /login

import { Navigate } from 'react-router-dom';
import { ROTA } from '../../services/router/url';

interface Props {
  children: React.ReactNode;
}

export default function RotaProtegida({ children }: Props) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to={ROTA.AUTH.LOGIN} replace />;
  }

  return <>{children}</>;
}
```

**Como usar em uma rota existente:**

```tsx
// filepath: react_academico/src/services/router/Router.tsx
import RotaProtegida from '../../components/auth/RotaProtegida';
import ListarUsuario from '../../views/usuario/Listar';

// Antes:
<Route path={ROTA.USUARIO.LISTAR} element={<ListarUsuario />} />

// Depois (com proteção):
<Route
  path={ROTA.USUARIO.LISTAR}
  element={
    <RotaProtegida>
      <ListarUsuario />
    </RotaProtegida>
  }
/>
```

---

### Passo 7 — Adicionar botão de Logout no Layout

Encontre o arquivo `Layout.tsx` e adicione um botão de logout no menu:

```tsx
// Em qualquer lugar do menu de navegação no Layout.tsx

// Função de logout — chama antes de adicionar o botão
const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('usuario');
  window.location.href = '/login'; // redireciona para o login
};

// Botão de logout
<button
  onClick={handleLogout}
  className="btn btn-outline-danger btn-sm"
>
  Sair
</button>
```

---

## 5. Testando no Postman

### 5.1. Login com sucesso

- **Método:** POST
- **URL:** `http://localhost:8000/rest/sistema/auth/login`
- **Body (JSON):**

```json
{
  "emailUsuario": "joao@email.com",
  "senhaUsuario": "senha123"
}
```

**Resposta esperada (200 OK):**

```json
{
  "status": 200,
  "message": "Login realizado com sucesso",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "usuario": {
      "idUsuario": 1,
      "nomeUsuario": "João",
      "sobrenomeUsuario": "Silva",
      "emailUsuario": "joao@email.com"
    }
  }
}
```

### 5.2. Login com senha errada

**Resposta esperada (401 Unauthorized):**

```json
{
  "statusCode": 401,
  "message": "E-mail ou senha inválidos"
}
```

### 5.3. Testando uma rota protegida

Após fazer login, copie o `accessToken` da resposta. No Postman:

1. Vá para a aba **Authorization**
2. Selecione **Bearer Token**
3. Cole o token no campo
4. Faça a requisição normalmente

Se o token estiver correto, a rota responderá normalmente.
Se o token estiver errado ou faltando, receberá **401 Unauthorized**.

---

## 6. Dúvidas frequentes

**Q: Preciso criar uma tabela `auth` no banco de dados?**
> Não. O módulo `auth` não cria tabela nova. Ele usa a tabela `usuario` que já existe.

**Q: O token JWT precisa ser armazenado em algum lugar no banco de dados?**
> Não. O JWT é "stateless" — o backend não precisa guardá-lo. Ele apenas verifica a
> assinatura do token quando recebe uma requisição.

**Q: Por que não dizer "e-mail não encontrado" em vez de "e-mail ou senha inválidos"?**
> Por segurança. Se dissermos qual está errado, alguém pode testar vários e-mails até
> descobrir quais estão cadastrados no sistema.

**Q: Posso colocar a chave JWT direto no código?**
> Para fins acadêmicos, sim. Em projetos reais, use variáveis de ambiente (arquivo `.env`).

**Q: Preciso de `passport-local` além de `passport-jwt`?**
> Não. `passport-local` é opcional — ele serve para autenticação com estratégia
> "username/password", mas como estamos usando JWT diretamente no service, não precisamos.

**Q: O que acontece quando o token expira?**
> O backend retorna 401. O interceptor do Axios (Passo 1 do frontend) detecta isso,
> limpa o localStorage e redireciona para o login automaticamente.

---

## 7. Resumo do que mudou em relação ao Registro

| Aspecto | Tarefa 1 — Registro | Tarefa 4 — Login |
|---|---|---|
| **Tabela no banco** | Cria usuário | Não cria nada (lê usuário) |
| **Retorno** | Dados do usuário | Token JWT + dados do usuário |
| **Senha** | Gera hash com `bcrypt.hash` | Compara com `bcrypt.compare` |
| **Número de services** | 5 (um por operação) | 1 (faz tudo) |
| **Autenticação necessária?** | Não | Não (é ela que gera a autenticação) |
| **Novidade no frontend** | Formulário de cadastro | Formulário de login + guarda token |

---

## Ordem recomendada de implementação

Se ainda não sabe por onde começar, siga esta ordem:

1. ✅ Instale as dependências (Passo 1 do backend)
2. ✅ Crie as pastas vazias (Passo 2)
3. ✅ Crie as constantes (`auth.constants.ts`)
4. ✅ Crie os DTOs (request e response)
5. ✅ Crie o `AuthService`
6. ✅ Crie a `JwtStrategy`
7. ✅ Crie o `JwtAuthGuard`
8. ✅ Crie o `AuthController`
9. ✅ Crie o `AuthModule`
10. ✅ Registre no `AppModule`
11. ✅ Teste no Postman (antes de fazer o frontend)
12. ✅ Configure o Axios no frontend
13. ✅ Crie `api.auth.ts`, `useLogin.ts` e `Login.tsx`
14. ✅ Adicione a rota de login no Router
15. ✅ Adicione `RotaProtegida` nas rotas que precisam de autenticação

---

*Após concluir este tutorial, você terá implementado os requisitos das Atividades 1 e 2
relacionados a Login, JWT e proteção de rotas.*
