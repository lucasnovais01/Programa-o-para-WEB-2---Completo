# Quarta Atividade - Login

---

## O que é Login?

Login é o processo de autenticação que permite a um usuário acessar o sistema. O usuário fornece suas credenciais (e-mail e senha) e o sistema verifica se são válidas, criando uma sessão autenticada.

### O que é JWT?

JWT (JSON Web Token) é um padrão para criar tokens de acesso que permitem a autenticação stateless (sem estado). O token contém informações do usuário e é assinado digitalmente, podendo ser verificado sem precisar consultar o banco de dados a cada requisição.

Estrutura do JWT:
- **Header**: Tipo do token e algoritmo de assinatura
- **Payload**: Dados do usuário (ID, e-mail, etc.)
- **Signature**: Assinatura digital que garante a autenticidade

### Por que criar um módulo de Login?

O módulo de Login é fundamental para a segurança do sistema:
1. Autenticar usuários antes de permitir acesso a funcionalidades protegidas
2. Gerar tokens JWT para manter a sessão do usuário
3. Controlar o acesso às rotas e recursos do sistema

---

## Explicação Detalhada: Como o Login acessa o Banco de Dados?

### Visão Geral

O módulo de Login tem uma **estrutura de pastas diferente** do módulo de Usuario porque:
- O módulo de Usuario foi criado seguindo o padrão do professor (módulos separados para cada operação)
- O módulo de Login usa uma abordagem diferente (biblioteca Passport + JWT)

### Como o Login acessa o banco de dados?

O Login acessa o banco de dados através do **Repository da entidade Usuario**. Veja o exemplo:

```typescript
// No AuthService, injetamos o repositório de Usuario
constructor(
  @InjectRepository(Usuario)
  private usuarioRepository: Repository<Usuario>,  // <-- Aqui está o acesso ao banco
  private jwtService: JwtService,
) {}
```

**Passo a passo de como funciona**:

1. **O usuário envia e-mail e senha** (via frontend)
2. **O AuthService recebe esses dados** (LoginRequest)
3. **O service busca o usuário no banco** usando o repositório:
   ```typescript
   const usuario = await this.usuarioRepository.findOne({
     where: { emailUsuario: loginRequest.emailUsuario }
   });
   ```
4. **O service verifica a senha** usando bcrypt:
   ```typescript
   const senhaCorreta = await compare(loginRequest.senhaUsuario, usuario.senhaUsuario);
   ```
5. **Se tudo estiver certo, gera o token JWT** e retorna ao frontend

### Por que a estrutura é diferente?

| Módulo Usuario | Módulo Login |
|----------------|--------------|
| Segue o padrão do professor (CRUD completo) | Usa biblioteca Passport + JWT |
| 5 Controllers (Criar, Listar, Buscar, Alterar, Excluir) | 1 Controller (só login) |
| 5 Services (um para cada operação) | 1 Service (faz tudo) |
| Usa o padrão "Service separado para cada operação" | Usa biblioteca de autenticação |

**Nota**: O Login **reutiliza a entidade Usuario** que já existe! Não precisamos criar uma nova entidade, pois os dados do usuário (e-mail, senha) já estão na tabela de usuários.

---

## Passo a Passo do Desenvolvimento

### 1. Fluxo de Login

1. O usuário acessa a tela de login
2. O usuário informa seu e-mail e senha
3. O sistema verifica as credenciais no banco de dados
4. Se válidas, o sistema gera um token JWT e retorna ao frontend
5. O frontend armazena o token (localStorage ou sessionStorage)
6. O frontend inclui o token em todas as requisições subsequentes
7. O backend verifica o token em cada requisição protegida

### 2. Backend (NestJS)

O desenvolvimento do backend será realizado criando um novo módulo de autenticação.

#### 2.1. Instalação de Dependências

Primeiramente, instale as dependências necessárias para JWT e bcrypt:

```bash
cd nest_academico
npm install @nestjs/jwt @nestjs/passport passport passport-local passport-jwt bcrypt
npm install -D @types/passport-local @types/passport-jwt @types/bcrypt
```

#### 2.2. Criação da Estrutura de Pastas

Crie a estrutura de pastas do módulo de autenticação dentro do diretório `nest_academico/src/auth/`:

- **constants/**: Contém os arquivos de constantes do módulo
- **controllers/**: Contém os controllers que expõem os endpoints da API
- **dto/**: Contém os Data Transfer Objects (request, response)
- **guards/**: Contém os guards de autenticação (proteção de rotas)
- **strategies/**: Contém as estratégias de autenticação (JWT, Local)
- **service/**: Contém a lógica de negócio do módulo

**Por que só 1 Controller e 1 Service?**
- **Controller**: O login só tem uma operação (fazer login), então precisamos de apenas 1 controller com 1 método.
- **Service**: O service faz tudo: busca o usuário no banco, verifica a senha, e gera o token JWT. Tudo relacionado, então fica em um só service.

**Nota sobre o Converter**: Neste módulo, não precisamos de Converter porque os dados são simples. A conversão é feita diretamente no Service.

#### 2.3. Criação dos DTOs (Data Transfer Objects)

**LoginRequest**: Define os dados para login.

```typescript
// filepath: nest_academico/src/auth/dto/request/login.request.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty({ message: 'O e-mail deve ser informado' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @ApiProperty({ description: 'E-mail do usuário', example: 'usuario@email.com' })
  emailUsuario: string;

  @IsNotEmpty({ message: 'A senha deve ser informada' })
  @IsString({ message: 'A senha deve ser um texto' })
  @ApiProperty({ description: 'Senha do usuário', example: 'senha123' })
  senhaUsuario: string;
}
```

**LoginResponse**: Define os dados retornados no login.

```typescript
// filepath: nest_academico/src/auth/dto/response/login.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({ description: 'Token de acesso JWT', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ description: 'Tipo do token', example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ description: 'Tempo de expiração do token em segundos', example: 3600 })
  expiresIn: number;

  @ApiProperty({ description: 'Dados do usuário', example: { idUsuario: 1, nomeUsuario: 'João' } })
  usuario: {
    idUsuario: number;
    nomeUsuario: string;
    sobrenomeUsuario: string;
    emailUsuario: string;
  };
}
```

#### 2.4. Criação do Service de Autenticação

O service será responsável por verificar as credenciais e gerar o token JWT:

```typescript
// filepath: nest_academico/src/auth/service/auth.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { Usuario } from '../../usuario/entity/usuario.entity';
import { LoginRequest } from '../dto/request/login.request';
import { LoginResponse } from '../dto/response/login.response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    // 1. Buscar o usuário pelo e-mail
    const usuario = await this.usuarioRepository.findOne({
      where: { emailUsuario: loginRequest.emailUsuario }
    });

    // 2. Se o usuário não existir, retornar erro genérico
    if (!usuario) {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED
      );
    }

    // 3. Verificar se a senha está correta
    const senhaCorreta = await compare(loginRequest.senhaUsuario, usuario.senhaUsuario);
    
    if (!senhaCorreta) {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED
      );
    }

    // 4. Gerar o payload do token
    const payload = {
      sub: usuario.idUsuario,
      email: usuario.emailUsuario,
      nome: usuario.nomeUsuario,
    };

    // 5. Gerar o token JWT
    const accessToken = await this.jwtService.signAsync(payload);

    // 6. Retornar a resposta
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hora em segundos
      usuario: {
        idUsuario: usuario.idUsuario,
        nomeUsuario: usuario.nomeUsuario,
        sobrenomeUsuario: usuario.sobrenomeUsuario,
        emailUsuario: usuario.emailUsuario,
      },
    };
  }

  async validateUser(userId: number): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: userId }
    });
    return usuario;
  }
}
```

#### 2.5. Criação da Estratégia JWT

A estratégia JWT é usada para validar o token em requisições protegidas:

```typescript
// filepath: nest_academico/src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUA_CHAVE_SECRETA_AQUI', // Em produção, usar variável de ambiente
    });
  }

  async validate(payload: any) {
    const usuario = await this.authService.validateUser(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException();
    }
    return usuario;
  }
}
```

#### 2.6. Criação do Guard de Autenticação

O guard é usado para proteger rotas que requerem autenticação:

```typescript
// filepath: nest_academico/src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
```

#### 2.7. Criação do Controller

O controller expõe o endpoint de login:

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

@Controller(ROTA.AUTH.BASE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post(ROTA.AUTH.LOGIN)
  async login(
    @Req() res: Request,
    @Body() loginRequest: LoginRequest,
  ): Promise<Result<any>> {
    const response = await this.authService.login(loginRequest);
    const _link = gerarLinks(res, 'auth', null);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Login realizado com sucesso',
      response,
      res.path,
      null,
      _link,
    );
  }
}
```

#### 2.8. Definição das Rotas no Backend

```typescript
// filepath: nest_academico/src/commons/constants/url.sistema.ts
export const ROTA = {
  // ... outras rotas
  AUTH: {
    BASE: 'sistema/auth',
    LOGIN: 'login',
  },
};
```

#### 2.9. Criação do Módulo de Autenticação

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

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'SUA_CHAVE_SECRETA_AQUI', // Em produção, usar variável de ambiente
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

#### 2.10. Registro do Módulo na Aplicação Principal

```typescript
// filepath: nest_academico/src/app/app.module.ts
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    // ... outros módulos
    AuthModule,
  ],
  // ...
})
export class AppModule {}
```

#### 2.11. URLs do Backend para Testes no Postman

**Login**

- **URL**: `http://localhost:8000/rest/sistema/auth/login`
- **Método**: POST
- **Corpo da Requisição (JSON)**:

```json
{
  "emailUsuario": "usuario@email.com",
  "senhaUsuario": "senha123"
}
```

**Resposta de Sucesso**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "usuario": {
    "idUsuario": 1,
    "nomeUsuario": "João",
    "sobrenomeUsuario": "Silva",
    "emailUsuario": "usuario@email.com"
  }
}
```

**Resposta de Erro**:
```json
{
  "statusCode": 401,
  "message": "E-mail ou senha inválidos",
  "error": "Unauthorized"
}
```

---

### 3. Frontend (React)

O desenvolvimento do frontend será realizado criando a interface de login.

#### 3.1. Configuração do Axios para Enviar Token

Configure o axios para incluir o token em todas as requisições:

```typescript
// filepath: react_academico/src/services/axios/config.axios.ts
import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8000/rest',
});

// Interceptor para adicionar o token em todas as requisições
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('accessToken');
      window.location.href = '/sistema/auth/login';
    }
    return Promise.reject(error);
  }
);
```

#### 3.2. Configuração das Rotas

As rotas do módulo de autenticação:

- `/sistema/auth/login` - Tela de login

#### 3.3. Criação dos Services

```typescript
// filepath: react_academico/src/services/auth/api/api.auth.ts
import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';

export interface LoginRequest {
  emailUsuario: string;
  senhaUsuario: string;
}

export interface LoginResponse {
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

export const apiLogin = async (dados: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>(ROTA.AUTH.LOGIN, dados);
  return response.data;
};
```

#### 3.4. Criação do Hook de Login

```typescript
// filepath: react_academico/src/services/auth/hook/useLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiLogin, LoginRequest } from "../api/api.auth";
import { AUTH } from "../constants/auth.constants";

export const useLogin = () => {
  const navigate = useNavigate();
  
  const [model, setModel] = useState<LoginRequest>({
    emailUsuario: '',
    senhaUsuario: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeField = (name: keyof LoginRequest, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (name: keyof LoginRequest, value: string) => {
    let messages: string[] = [];

    switch (name) {
      case 'emailUsuario':
        if (!value || value.trim().length === 0) {
          messages.push(AUTH.INPUT_ERROR.EMAIL.BLANK);
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          messages.push(AUTH.INPUT_ERROR.EMAIL.INVALID);
        }
        break;
      case 'senhaUsuario':
        if (!value || value.trim().length === 0) {
          messages.push(AUTH.INPUT_ERROR.SENHA.BLANK);
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${name}Mensagem`]: messages.length > 0 ? messages : undefined,
    }));
  };

  const validarFormulario = (): boolean => {
    const newErrors: any = {};
    let isFormValid = true;

    if (!model.emailUsuario || model.emailUsuario.trim().length === 0) {
      newErrors.emailUsuario = true;
      newErrors.emailUsuarioMensagem = [AUTH.INPUT_ERROR.EMAIL.BLANK];
      isFormValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.emailUsuario)) {
      newErrors.emailUsuario = true;
      newErrors.emailUsuarioMensagem = [AUTH.INPUT_ERROR.EMAIL.INVALID];
      isFormValid = false;
    }

    if (!model.senhaUsuario || model.senhaUsuario.trim().length === 0) {
      newErrors.senhaUsuario = true;
      newErrors.senhaUsuarioMensagem = [AUTH.INPUT_ERROR.SENHA.BLANK];
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const onSubmitForm = async (e: any) => {
    e.preventDefault();

    if (!validarFormulario()) {
      console.log("Erro na validação dos dados");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiLogin(model);
      
      // Armazenar o token no localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      // Redirecionar para a página inicial ou dashboard
      navigate(ROTA.DASHBOARD);
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message) {
        setErrors({
          geral: [error.response.data.message]
        });
      } else {
        setErrors({
          geral: ['Erro ao realizar login. Tente novamente.']
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    navigate(ROTA.AUTH.LOGIN);
  };

  const getInputClass = (name: string): string => {
    if (errors[name]) {
      return "form-control is-invalid app-label input-error mt-2";
    }
    return "form-control app-label mt-2";
  };

  return {
    model,
    errors,
    isLoading,
    handleChangeField,
    validateField,
    onSubmitForm,
    logout,
    getInputClass,
  };
};
```

#### 3.5. Criação da View de Login

```tsx
// filepath: react_academico/src/views/auth/Login.tsx
import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useLogin } from "../../services/auth/hook/useLogin";
import { AUTH } from "../../services/auth/constants/auth.constants";
import { ROTA } from "../../services/router/url";

export default function Login() {
  const {
    model,
    errors,
    isLoading,
    handleChangeField,
    validateField,
    onSubmitForm,
    getInputClass,
  } = useLogin();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Login</h2>
        
        {errors.geral && (
          <div className="alert alert-danger" role="alert">
            {errors.geral}
          </div>
        )}

        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="emailUsuario" className="app-label">
              {AUTH.LABEL.EMAIL}:
            </label>
            <input
              id="emailUsuario"
              name="emailUsuario"
              type="email"
              value={model.emailUsuario}
              className={getInputClass('emailUsuario')}
              autoComplete="off"
              onChange={(e) => handleChangeField('emailUsuario', e.target.value)}
              onBlur={(e) => validateField('emailUsuario', e.target.value)}
            />
            {errors?.emailUsuario && (
              <MensagemErro
                error={errors.emailUsuario}
                mensagem={errors.emailUsuarioMensagem}
              />
            )}
          </div>

          <div className="mb-2 mt-4">
            <label htmlFor="senhaUsuario" className="app-label">
              {AUTH.LABEL.SENHA}:
            </label>
            <input
              id="senhaUsuario"
              name="senhaUsuario"
              type="password"
              value={model.senhaUsuario}
              className={getInputClass('senhaUsuario')}
              autoComplete="off"
              onChange={(e) => handleChangeField('senhaUsuario', e.target.value)}
              onBlur={(e) => validateField('senhaUsuario', e.target.value)}
            />
            {errors?.senhaUsuario && (
              <MensagemErro
                error={errors.senhaUsuario}
                mensagem={errors.senhaUsuarioMensagem}
              />
            )}
          </div>

          <div className="mb-2 mt-4">
            <Link to={ROTA.RECUPERAR_SENHA.SOLICITAR} className="text-decoration-none">
              Esqueci minha senha
            </Link>
          </div>

          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Entrar"
              disabled={isLoading}
            >
              <span className="btn-icon">
                <i>
                  <FaSignInAlt />
                </i>
              </span>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-muted">
              Não tem uma conta?{" "}
              <Link to={ROTA.USUARIO.CRIAR}>Cadastre-se</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
```

#### 3.6. Criação de um Hook para Verificar se o Usuário está Logado

```typescript
// filepath: react_academico/src/services/auth/hook/useAuth.tsx
import { useState, useEffect } from "react";
import { ROTA } from "../../router/url";

export interface UsuarioLogado {
  idUsuario: number;
  nomeUsuario: string;
  sobrenomeUsuario: string;
  emailUsuario: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const usuarioStr = localStorage.getItem('usuario');
    
    if (token && usuarioStr) {
      setIsAuthenticated(true);
      setUsuario(JSON.parse(usuarioStr));
    } else {
      setIsAuthenticated(false);
      setUsuario(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUsuario(null);
    window.location.href = ROTA.AUTH.LOGIN;
  };

  return {
    isAuthenticated,
    usuario,
    logout,
  };
};
```

---

### 4. Protegendo Rotas no Frontend

Crie um componente para proteger rotas que requerem autenticação:

```tsx
// filepath: react_academico/src/components/auth/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/auth/hook/useAuth";
import { ROTA } from "../../services/router/url";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROTA.AUTH.LOGIN} replace />;
  }

  return <>{children}</>;
}
```

Exemplo de uso no Router:

```tsx
// filepath: react_academico/src/services/router/Router.tsx
import ProtectedRoute from "../../components/auth/ProtectedRoute";

// ...

<Route
  path={ROTA.USUARIO.LISTAR}
  element={
    <ProtectedRoute>
      <ListarUsuario />
    </ProtectedRoute>
  }
/>
```

---

### 5. Diferenças em Relação ao Módulo de Registro

| Aspecto | Registro de Usuário | Login |
|---------|---------------------|-------|
| **Objetivo** | Criar novo usuário | Autenticar usuário existente |
| **Campos do formulário** | Nome, Sobrenome, E-mail, Senha | E-mail, Senha |
| **Retorno** | Dados do usuário criado | Token JWT + dados do usuário |
| **Necessidade de autenticação** | Não | Não |
| **URL da API** | POST /sistema/usuario/criar | POST /sistema/auth/login |

---

### 6. Observações Importantes

1. **Segurança - Não revelar existência de e-mail**: Na resposta de erro de login, não revele se o e-mail existe ou não. Use uma mensagem genérica "E-mail ou senha inválidos".

2. **Armazenamento do token**: O token JWT deve ser armazenado de forma segura. O localStorage é conveniente mas vulnerável a XSS. Em aplicações mais críticas, considere usar httpOnly cookies.

3. **Tempo de expiração**: O token deve ter um tempo de expiração razoável (geralmente 1 hora a 7 dias).

4. **Renovação de token**: Considere implementar um sistema de refresh token para permitir renovação sem necessidade de novo login.

5. **Validação no Backend**: Sempre valide o token em todas as rotas protegidas usando o JwtAuthGuard.

6. **Logout**: O frontend deve remover o token do armazenamento ao fazer logout.

---

### 7. Próximos Passos

Após implementar o Login, você poderá implementar:

1. **2FA (Tarefa 5)**: Autenticação de dois fatores (envio de código por e-mail)
2. **Validar Email (Tarefa 6)**: Verificação de e-mail do usuário
3. **Proteção de rotas**: Proteger as rotas do sistema para que apenas usuários logados possam acessar

---

### Conclusão

O módulo de Login foi desenvolvido seguindo o mesmo padrão dos módulos existentes no projeto. A principal diferença é que esta funcionalidade gera um token JWT para manter a sessão do usuário autenticado.

O sistema de autenticação com JWT é fundamental para a segurança do sistema, permitindo controlar o acesso às rotas e recursos protegidos. Nas próximas tarefas, vamos implementar funcionalidades adicionais de segurança como 2FA e validação de e-mail.