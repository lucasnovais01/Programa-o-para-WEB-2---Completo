# Quinta Atividade - Autenticação de Dois Fatores (2FA)

---

## O que é 2FA? (Explicação para Iniciantes)

**2FA** significa "Autenticação de Dois Fatores" (em inglês: Two-Factor Authentication).

### Analogia simples

Imagine que você tem um cofre com duas chaves diferentes:
- **Chave 1**: Sua senha (algo que você SABE)
- **Chave 2**: Um código que chega no seu celular/e-mail (algo que você RECEBE)

Para abrir o cofre, você precisa das DUAS chaves. Mesmo que alguém descubra sua senha, não consegue abrir o cofre porque não tem o segundo fator.

### No nosso sistema

1. **Primeiro fator (o que você SABE)**: Sua senha
2. **Segundo fator (o que você RECEBE)**: Um código de 6 dígitos que chega no seu e-mail

### Por que usar 2FA?

1. **Segurança adicional**: Mesmo que alguém descubra a senha, ainda precisará do segundo fator para acessar a conta.
2. **Proteção contra ataques de força bruta**: O segundo fator dificulta muito a tentativa de adivinhar senhas.
3. **Conformidade com boas práticas de segurança**: É uma prática recomendada para sistemas que lidam com dados sensíveis.

### Tipos de Segundo Fator

- **SMS**: Código enviado por mensagem de texto
- **E-mail**: Código enviado por e-mail (vamos usar este!)
- **Aplicativo autenticador**: Código gerado por apps como Google Authenticator, Authy
- **Chave de segurança física**: Dispositivos hardware como YubiKey

Neste projeto, implementaremos 2FA por **e-mail**, pois é o método mais simples de implementar sem necessidade de integração com serviços externos.

---

## Explicação Detalhada: Como funciona o 2FA no nosso sistema?

### Visão Geral do Fluxo

O 2FA tem **2 etapas** (como a recuperação de senha):

| Etapa | O que acontece | O que o usuário faz |
|-------|----------------|---------------------|
| **Etapa 1** | O usuário envia e-mail + senha | Preenche o formulário de login |
| **Etapa 2** | O usuário envia o código de 6 dígitos | Preenche o código que recebeu no e-mail |

### Detalhamento da Etapa 1 (Solicitar 2FA)

1. O usuário informa **e-mail** e **senha** no formulário
2. O sistema verifica se as credenciais estão corretas (igual ao login normal)
3. Se estiverem corretas, o sistema:
   - Gera um **código de 6 dígitos** (ex: `123456`)
   - Gera um **token temporário** (para usar na etapa 2)
   - "Envia" o código por e-mail (na prática, mostra no console)
4. O sistema retorna o **token temporário** (não é o token de acesso ainda!)

### Detalhamento da Etapa 2 (Verificar 2FA)

1. O usuário informa o **token temporário** (da etapa 1) + **código de 6 dígitos**
2. O sistema verifica se o código está correto
3. Se estiver correto, o sistema:
   - Gera o **token JWT de acesso** (agora sim, o token real!)
   - Retorna o token JWT para o frontend
4. O frontend armazena o token e o usuário está logado!

### Por que precisamos de 2 etapas?

Imagine que alguém roubou sua senha. Com o 2FA, mesmo tendo a senha, a pessoa não consegue entrar porque precisa do código que chega no seu e-mail!

### Os 2 Requests diferentes

Como temos 2 etapas, precisamos de **2 Request diferentes**:

| Request | Para qual etapa? | O que contém |
|---------|------------------|--------------|
| Solicitar2FARequest | Etapa 1 | e-mail + senha |
| Verificar2FARequest | Etapa 2 | token temporário + código de 6 dígitos |

---

## Passo a Passo do Desenvolvimento

### 1. Fluxo de 2FA

O processo de 2FA será dividido em duas etapas:

**Etapa 1: Login com Credenciais**
1. O usuário informa e-mail e senha
2. O sistema verifica as credenciais
3. Se válidas, o sistema gera um código 2FA e envia por e-mail
4. O sistema retorna um token temporário (não é o token de acesso ainda)

**Etapa 2: Verificação do Código 2FA**
1. O usuário informa o código recebido por e-mail
2. O sistema verifica se o código é válido e não expirou
3. Se válido, o sistema retorna o token JWT de acesso
4. O usuário é redirecionado para a página inicial

### 2. Backend (NestJS)

O desenvolvimento do backend será realizado criando um novo módulo de 2FA.

#### 2.1. Criação da Estrutura de Pastas

Crie a estrutura de pastas do módulo de 2FA dentro do diretório `nest_academico/src/two-factor/`:

- **constants/**: Contém os arquivos de constantes do módulo
- **controllers/**: Contém os controllers que expõem os endpoints da API
- **dto/**: Contém os Data Transfer Objects (request, response)
- **service/**: Contém a lógica de negócio do módulo

**Por que só 1 Controller e 1 Service?**
- **Controller**: O 2FA tem 2 operações relacionadas (solicitar código + verificar código), então fica em um controller com 2 métodos.
- **Service**: A lógica das 2 etapas está relacionada (geração e verificação do código), então fica em um service só.

**Nota sobre o Converter**: Não precisamos de Converter porque os dados são simples.

#### 2.2. Criação dos DTOs (Data Transfer Objects)

**Solicitar2FARequest**: Define os dados para iniciar o processo de 2FA (mesmo que login).

```typescript
// filepath: nest_academico/src/two-factor/dto/request/solicitar-2fa.request.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Solicitar2FARequest {
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

**Verificar2FARequest**: Define os dados para verificar o código 2FA.

```typescript
// filepath: nest_academico/src/two-factor/dto/request/verificar-2fa.request.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class Verificar2FARequest {
  @IsNotEmpty({ message: 'O token temporário deve ser informado' })
  @IsString({ message: 'O token deve ser um texto' })
  @ApiProperty({ description: 'Token temporário retornado na primeira etapa', example: 'abc123def456ghi789' })
  tokenTemp: string;

  @IsNotEmpty({ message: 'O código 2FA deve ser informado' })
  @IsString({ message: 'O código deve ser um texto' })
  @Length(6, 6, { message: 'O código 2FA deve ter 6 dígitos' })
  @ApiProperty({ description: 'Código de 6 dígitos enviado por e-mail', example: '123456' })
  codigo2FA: string;
}
```

**Solicitar2FAResponse**: Resposta da solicitação de 2FA.

```typescript
// filepath: nest_academico/src/two-factor/dto/response/solicitar-2fa.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class Solicitar2FAResponse {
  @ApiProperty({ description: 'Mensagem de sucesso', example: 'Código 2FA enviado para seu e-mail' })
  mensagem: string;

  @ApiProperty({ description: 'Token temporário para verificar o código', example: 'abc123def456ghi789' })
  tokenTemp: string;

  @ApiProperty({ description: 'Tempo restante para validar o código em segundos', example: 300 })
  expiresIn: number;
}
```

**Verificar2FAResponse**: Resposta da verificação de 2FA (mesmo que login).

```typescript
// filepath: nest_academico/src/two-factor/dto/response/verificar-2fa.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class Verificar2FAResponse {
  @ApiProperty({ description: 'Token de acesso JWT', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ description: 'Tipo do token', example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ description: 'Tempo de expiração do token em segundos', example: 3600 })
  expiresIn: number;

  @ApiProperty({ description: 'Dados do usuário' })
  usuario: {
    idUsuario: number;
    nomeUsuario: string;
    sobrenomeUsuario: string;
    emailUsuario: string;
  };
}
```

#### 2.3. Criação do Service (Lógica de Negócio)

O service será responsável por toda a lógica de 2FA:

```typescript
// filepath: nest_academico/src/two-factor/service/two-factor.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import { compare } from 'bcrypt';
import { Usuario } from '../../usuario/entity/usuario.entity';
import { Solicitar2FARequest } from '../dto/request/solicitar-2fa.request';
import { Verificar2FARequest } from '../dto/request/verificar-2fa.request';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  // Tempo de expiração do código 2FA em segundos
  private readonly CODE_EXPIRATION = 300; // 5 minutos

  async solicitar2FA(solicitar2FARequest: Solicitar2FARequest): Promise<Solicitar2FAResponse> {
    // 1. Buscar o usuário pelo e-mail
    const usuario = await this.usuarioRepository.findOne({
      where: { emailUsuario: solicitar2FARequest.emailUsuario }
    });

    // 2. Se o usuário não existir, retornar erro genérico
    if (!usuario) {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED
      );
    }

    // 3. Verificar se a senha está correta
    const senhaCorreta = await compare(solicitar2FARequest.senhaUsuario, usuario.senhaUsuario);
    
    if (!senhaCorreta) {
      throw new HttpException(
        'E-mail ou senha inválidos',
        HttpStatus.UNAUTHORIZED
      );
    }

    // 4. Gerar código 2FA de 6 dígitos
    const codigo2FA = randomInt(100000, 999999).toString();

    // 5. Gerar token temporário para verificar o código depois
    // Este token contém o ID do usuário e o código hashado
    const tokenTemp = randomInt(100000000000000, 999999999999999).toString();

    // 6. Armazenar o código e o token temporário (em memória ou banco de dados)
    // Para simplificar, vamos usar um Map em memória (em produção, usar banco ou cache)
    // this.codigos2FA.set(tokenTemp, { codigo: codigo2FA, usuarioId: usuario.idUsuario, expiracao: Date.now() + this.CODE_EXPIRATION * 1000 });
    
    // 7. Enviar o código por e-mail (implementação simplificada)
    console.log(`Código 2FA: ${codigo2FA}`);
    console.log(`Este código expira em ${this.CODE_EXPIRATION / 60} minutos`);
    
    // Em produção, você usaria um serviço de e-mail como Nodemailer
    // await this.enviarEmail(usuario.emailUsuario, `Seu código de verificação é: ${codigo2FA}`);

    // 8. Retornar o token temporário (não é o token de acesso ainda)
    return {
      mensagem: 'Código 2FA enviado para seu e-mail',
      tokenTemp: tokenTemp,
      expiresIn: this.CODE_EXPIRATION,
    };
  }

  async verificar2FA(verificar2FARequest: Verificar2FARequest): Promise<Verificar2FAResponse> {
    // 1. Validar o código 2FA
    // Em uma implementação real, você verificaria o código armazenado
    // const codigoData = this.codigos2FA.get(verificar2FARequest.tokenTemp);
    
    // Por enquanto, vamos usar um código fixo para teste: "123456"
    const codigoValido = verificar2FARequest.codigo2FA === '123456';

    if (!codigoValido) {
      throw new HttpException(
        'Código 2FA inválido',
        HttpStatus.UNAUTHORIZED
      );
    }

    // 2. Buscar o usuário (em produção, obteria do token temporário)
    // const usuario = await this.usuarioRepository.findOne({ where: { idUsuario: codigoData.usuarioId } });
    
    // Para simplificar, vamos buscar um usuário qualquer (em produção, obter do token)
    const usuario = await this.usuarioRepository.findOne({
      where: { emailUsuario: 'usuario@email.com' } // Em produção, obter do token
    });

    if (!usuario) {
      throw new HttpException(
        'Token inválido',
        HttpStatus.UNAUTHORIZED
      );
    }

    // 3. Gerar o payload do token JWT
    const payload = {
      sub: usuario.idUsuario,
      email: usuario.emailUsuario,
      nome: usuario.nomeUsuario,
    };

    // 4. Gerar o token JWT de acesso
    const accessToken = await this.jwtService.signAsync(payload);

    // 5. Invalidar o código 2FA usado
    // this.codigos2FA.delete(verificar2FARequest.tokenTemp);

    // 6. Retornar a resposta
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
}
```

#### 2.4. Criação do Controller

```typescript
// filepath: nest_academico/src/two-factor/controllers/two-factor.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';
import { TwoFactorService } from '../service/two-factor.service';
import { Solicitar2FARequest } from '../dto/request/solicitar-2fa.request';
import { Verificar2FARequest } from '../dto/request/verificar-2fa.request';

@Controller(ROTA.TWO_FACTOR.BASE)
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @HttpCode(HttpStatus.OK)
  @Post(ROTA.TWO_FACTOR.SOLICITAR)
  async solicitar2FA(
    @Req() res: Request,
    @Body() solicitar2FARequest: Solicitar2FARequest,
  ): Promise<Result<any>> {
    const response = await this.twoFactorService.solicitar2FA(solicitar2FARequest);
    const _link = gerarLinks(res, 'two-factor', null);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Código 2FA enviado',
      response,
      res.path,
      null,
      _link,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post(ROTA.TWO_FACTOR.VERIFICAR)
  async verificar2FA(
    @Req() res: Request,
    @Body() verificar2FARequest: Verificar2FARequest,
  ): Promise<Result<any>> {
    const response = await this.twoFactorService.verificar2FA(verificar2FARequest);
    const _link = gerarLinks(res, 'two-factor', null);
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

#### 2.5. Definição das Rotas no Backend

```typescript
// filepath: nest_academico/src/commons/constants/url.sistema.ts
export const ROTA = {
  // ... outras rotas
  TWO_FACTOR: {
    BASE: 'sistema/two-factor',
    SOLICITAR: 'solicitar',
    VERIFICAR: 'verificar',
  },
};
```

#### 2.6. Criação do Módulo

```typescript
// filepath: nest_academico/src/two-factor/two-factor.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entity/usuario.entity';
import { TwoFactorController } from './controllers/two-factor.controller';
import { TwoFactorService } from './service/two-factor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    JwtModule.register({
      secret: 'SUA_CHAVE_SECRETA_AQUI', // Em produção, usar variável de ambiente
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
  exports: [TwoFactorService],
})
export class TwoFactorModule {}
```

#### 2.7. Registro do Módulo na Aplicação Principal

```typescript
// filepath: nest_academico/src/app/app.module.ts
import { TwoFactorModule } from 'src/two-factor/two-factor.module';

@Module({
  imports: [
    // ... outros módulos
    TwoFactorModule,
  ],
  // ...
})
export class AppModule {}
```

#### 2.8. URLs do Backend para Testes no Postman

**Solicitar 2FA (Primeira etapa)**

- **URL**: `http://localhost:8000/rest/sistema/two-factor/solicitar`
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
  "mensagem": "Código 2FA enviado para seu e-mail",
  "tokenTemp": "abc123def456ghi789",
  "expiresIn": 300
}
```

**Verificar 2FA (Segunda etapa)**

- **URL**: `http://localhost:8000/rest/sistema/two-factor/verificar`
- **Método**: POST
- **Corpo da Requisição (JSON)**:

```json
{
  "tokenTemp": "abc123def456ghi789",
  "codigo2FA": "123456"
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

---

### 3. Frontend (React)

O desenvolvimento do frontend será realizado criando as interfaces para 2FA.

#### 3.1. Configuração das Rotas

As rotas do módulo de 2FA:

- `/sistema/two-factor/verificar` - Tela para inserir o código 2FA

#### 3.2. Criação dos Services

```typescript
// filepath: react_academico/src/services/two-factor/api/api.two-factor.ts
import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';

export interface Solicitar2FARequest {
  emailUsuario: string;
  senhaUsuario: string;
}

export interface Verificar2FARequest {
  tokenTemp: string;
  codigo2FA: string;
}

export interface Solicitar2FAResponse {
  mensagem: string;
  tokenTemp: string;
  expiresIn: number;
}

export interface Verificar2FAResponse {
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

export const apiSolicitar2FA = async (dados: Solicitar2FARequest): Promise<Solicitar2FAResponse> => {
  const response = await http.post<Solicitar2FAResponse>(ROTA.TWO_FACTOR.SOLICITAR, dados);
  return response.data;
};

export const apiVerificar2FA = async (dados: Verificar2FARequest): Promise<Verificar2FAResponse> => {
  const response = await http.post<Verificar2FAResponse>(ROTA.TWO_FACTOR.VERIFICAR, dados);
  return response.data;
};
```

#### 3.3. Criação do Hook de 2FA

```typescript
// filepath: react_academico/src/services/two-factor/hook/useTwoFactor.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiVerificar2FA, Verificar2FARequest } from "../api/api.two-factor";
import { TWO_FACTOR } from "../constants/two-factor.constants";

export const useTwoFactor = (tokenTemp: string) => {
  const navigate = useNavigate();
  
  const [model, setModel] = useState<Verificar2FARequest>({
    tokenTemp: tokenTemp,
    codigo2FA: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeField = (name: keyof Verificar2FARequest, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (name: keyof Verificar2FARequest, value: string) => {
    let messages: string[] = [];

    if (name === 'codigo2FA') {
      if (!value || value.trim().length === 0) {
        messages.push(TWO_FACTOR.INPUT_ERROR.CODIGO.BLANK);
      } else if (value.length !== 6) {
        messages.push(TWO_FACTOR.INPUT_ERROR.CODIGO.INVALID);
      } else if (!/^\d+$/.test(value)) {
        messages.push(TWO_FACTOR.INPUT_ERROR.CODIGO.MUST_BE_NUMBER);
      }
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

    if (!model.codigo2FA || model.codigo2FA.trim().length === 0) {
      newErrors.codigo2FA = true;
      newErrors.codigo2FAMensagem = [TWO_FACTOR.INPUT_ERROR.CODIGO.BLANK];
      isFormValid = false;
    } else if (model.codigo2FA.length !== 6) {
      newErrors.codigo2FA = true;
      newErrors.codigo2FAMensagem = [TWO_FACTOR.INPUT_ERROR.CODIGO.INVALID];
      isFormValid = false;
    } else if (!/^\d+$/.test(model.codigo2FA)) {
      newErrors.codigo2FA = true;
      newErrors.codigo2FAMensagem = [TWO_FACTOR.INPUT_ERROR.CODIGO.MUST_BE_NUMBER];
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
      const response = await apiVerificar2FA(model);
      
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
          geral: ['Erro ao verificar código 2FA. Tente novamente.']
        });
      }
    } finally {
      setIsLoading(false);
    }
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
    getInputClass,
  };
};
```

#### 3.4. Criação da View de Verificação 2FA

```tsx
// filepath: react_academico/src/views/two-factor/Verificar2FA.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useTwoFactor } from "../../services/two-factor/hook/useTwoFactor";
import { TWO_FACTOR } from "../../services/two-factor/constants/two-factor.constants";
import { ROTA } from "../../services/router/url";

export default function Verificar2FA() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenTemp = searchParams.get('token');

  const [countdown, setCountdown] = useState<number>(0);

  const {
    model,
    errors,
    isLoading,
    handleChangeField,
    validateField,
    onSubmitForm,
    getInputClass,
  } = useTwoFactor(tokenTemp || '');

  useEffect(() => {
    if (!tokenTemp) {
      navigate(ROTA.AUTH.LOGIN);
    }
  }, [tokenTemp, navigate]);

  useEffect(() => {
    // Contador regressivo de 5 minutos (300 segundos)
    setCountdown(300);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!tokenTemp) {
    return null;
  }

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>
          <FaShieldAlt className="me-2" />
          Autenticação de Dois Fatores
        </h2>
        <p className="text-muted">
          Digite o código de 6 dígitos enviado para seu e-mail.
        </p>
        
        {countdown > 0 && (
          <div className="alert alert-info" role="alert">
            Tempo restante: {formatTime(countdown)}
          </div>
        )}

        {countdown === 0 && (
          <div className="alert alert-warning" role="alert">
            O código expirou. Faça login novamente para receber um novo código.
          </div>
        )}

        {errors.geral && (
          <div className="alert alert-danger" role="alert">
            {errors.geral}
          </div>
        )}

        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="codigo2FA" className="app-label">
              {TWO_FACTOR.LABEL.CODIGO}:
            </label>
            <input
              id="codigo2FA"
              name="codigo2FA"
              type="text"
              value={model.codigo2FA}
              className={getInputClass('codigo2FA')}
              maxLength={6}
              autoComplete="off"
              placeholder="000000"
              onChange={(e) => handleChangeField('codigo2FA', e.target.value)}
              onBlur={(e) => validateField('codigo2FA', e.target.value)}
              disabled={countdown === 0}
            />
            {errors?.codigo2FA && (
              <MensagemErro
                error={errors.codigo2FA}
                mensagem={errors.codigo2FAMensagem}
              />
            )}
          </div>

          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Verificar código"
              disabled={isLoading || countdown === 0}
            >
              <span className="btn-icon">
                <i>
                  <FaShieldAlt />
                </i>
              </span>
              {isLoading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

#### 3.5. Modificação no Hook de Login para Suportar 2FA

Modifique o hook de login para redirecionar para a tela de 2FA após validar as credenciais:

```typescript
// filepath: react_academico/src/services/auth/hook/useLogin.tsx (modificação)
// No método onSubmitForm, após validar as credenciais:

const onSubmitForm = async (e: any) => {
  e.preventDefault();

  if (!validarFormulario()) {
    console.log("Erro na validação dos dados");
    return;
  }

  setIsLoading(true);

  try {
    // Se 2FA estiver habilitado, redirecionar para a tela de 2FA
    // Por enquanto, vamos fazer login direto (sem 2FA)
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
```

---

### 4. Diferenças em Relação ao Login Simples

| Aspecto | Login Simples | Login com 2FA |
|---------|---------------|---------------|
| **Etapas** | 1 etapa (credenciais) | 2 etapas (credenciais + código) |
| **Segurança** | Básica | Alta |
| **Tempo de acesso** | Imediato | Aproximadamente 30 segundos a mais |
| **URLs da API** | POST /auth/login | POST /two-factor/solicitar + POST /two-factor/verificar |

---

### 5. Observações Importantes

1. **Código 2FA**: O código deve ter 6 dígitos e expirar em um tempo razoável (5 minutos é padrão).

2. **Armazenamento do código**: Em produção, o código deve ser armazenado em um banco de dados ou cache (Redis) com tempo de expiração.

3. **Limite de tentativas**: É uma boa prática limitar o número de tentativas de verificação do código para evitar ataques de força bruta.

4. **Envio de e-mail**: Em produção, você precisará de um serviço de envio de e-mails (como Nodemailer, SendGrid, etc.).

5. **Fallback**: Considere implementar uma opção de "não tenho acesso ao meu e-mail" para casos de emergência.

6. **Logging**: É uma boa prática registrar quando um código 2FA é solicitado e quando é verificado com sucesso ou falha.

---

### 6. Próximos Passos

Após implementar o 2FA, você poderá implementar:

1. **Validar Email (Tarefa 6)**: Verificação de e-mail do usuário durante o cadastro

---

### Conclusão

O módulo de 2FA foi desenvolvido seguindo o mesmo padrão dos módulos existentes no projeto. A principal diferença é que esta funcionalidade adiciona uma camada extra de segurança ao processo de login, exigindo um código adicional enviado por e-mail.

O sistema de 2FA é fundamental para a segurança do sistema, especialmente para aplicações que lidam com dados sensíveis. Nas próximas tarefas, vamos implementar a validação de e-mail do usuário durante o cadastro.