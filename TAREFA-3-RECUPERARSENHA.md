# Terceira Atividade - Recuperar Senha

---

## O que é Recuperar Senha?

Recuperar senha é o processo pelo qual um usuário que esqueceu sua senha pode redefini-la para recuperar o acesso à sua conta. Este processo geralmente envolve verificar a identidade do usuário através de um método alternativo (geralmente e-mail) e permitir que ele crie uma nova senha.

### Por que criar um módulo separado para recuperar senha?

Existem algumas razões importantes para criar um módulo separado para recuperação de senha:

1. **Segurança**: O processo de recuperação de senha requer validações específicas e diferentes da alteração de senha normal:
   - Verificação de identidade através de token único
   - Tempo limite para uso do token (expiração)
   - Limitação de tentativas de recuperação

2. **Fluxo diferente**: A recuperação de senha é iniciada sem o usuário estar logado, enquanto a alteração de senha requer autenticação.

3. **Prática recomendada**: É uma prática de segurança comum separar as funcionalidades de alteração e recuperação de senha.

---

## Explicação Detalhada: Por que temos 2 tipos de Request?

### Visão Geral

Na Tarefa 3 (Recuperar Senha), temos **2 Request diferentes** porque o processo de recuperação de senha tem **2 etapas diferentes**, e cada etapa precisa de dados diferentes:

### Etapa 1: Solicitar Recuperação (SolicitarRecuperacaoRequest)

**Quando o usuário usa**: Quando ele clica em "Esqueci minha senha" e informa seu e-mail.

**Dados necessários**: 
- `emailUsuario`: O e-mail que ele usou para se cadastrar (ex: `novais.oliveira@aluno.ifsp.edu.br`)

**O que acontece no backend**:
1. O sistema busca no banco de dados se existe algum usuário com esse e-mail
2. Se existir, o sistema gera um token de recuperação
3. O sistema "envia" esse token por e-mail (na prática, mostra no console)
4. O sistema retorna uma mensagem dizendo "Se o e-mail estiver cadastrado, você receberá um link"

**Por que não revelar se o e-mail existe?**: Por segurança! Se alguém tentar descobrir quais e-mails estão cadastrados no sistema, não deve conseguir. Por isso, mesmo que o e-mail não exista, retornamos a mesma mensagem.

### Etapa 2: Redefinir Senha (RedefinirSenhaRequest)

**Quando o usuário usa**: Quando ele clica no link do e-mail e precisa definir uma nova senha.

**Dados necessários**:
- `token`: O token que veio no link do e-mail
- `novaSenha`: A nova senha que ele quer usar
- `confirmarSenha`: A mesma nova senha digitada novamente (para confirmar que não errou)

**O que acontece no backend**:
1. O sistema verifica se o token é válido
2. O sistema verifica se o token não expirou (geralmente 30 minutos)
3. O sistema verifica se a nova senha e a confirmação são iguais
4. O sistema gera o hash da nova senha
5. O sistema atualiza a senha no banco de dados
6. O sistema invalida o token (para não ser usado novamente)

### Resumo da Diferença

| Etapa | Request | Quando usar | Dados necessários |
|-------|---------|-------------|-------------------|
| 1 | SolicitarRecuperacaoRequest | "Esqueci minha senha" | só o e-mail |
| 2 | RedefinirSenhaRequest | Clicou no link do e-mail | token + nova senha + confirmação |

### Nota sobre Regex e Validação de Senha

**Neste projeto, não vamos usar regex para validar força de senha** (ex: "a senha deve ter pelo menos 1 letra maiúscula, 1 número e 1 caractere especial").

**Por que não usamos regex?**
- O projeto é para fins acadêmicos e o professor não pediu essa funcionalidade
- O foco é no fluxo de recuperação de senha, não na validação avançada de senha

**Se você quisesse usar regex**, você faria no **DTO de request**, usando o decorator `@Matches()` do class-validator:

```typescript
// Exemplo de como seria se usássemos regex:
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/, {
  message: 'A senha deve ter pelo menos 6 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial'
})
novaSenha: string;
```

**Onde o regex seria colocado?**
- No **DTO de request** (`redefinir-senha.request.ts`) - é onde validamos os dados que vêm do frontend
- O regex **NÃO vai no banco de dados** - o banco só armazena a senha (já em hash), não valida formato
- O regex **NÃO vai no frontend** - mas o frontend também pode fazer validações para dar feedback mais rápido ao usuário

---

## Passo a Passo do Desenvolvimento

### 1. Fluxo de Recuperação de Senha

O processo de recuperação de senha será dividido em duas etapas:

**Etapa 1: Solicitação de Recuperação**
1. O usuário acessa a tela de "Esqueci minha senha"
2. O usuário informa seu e-mail de cadastro (ex: `novais.oliveira@aluno.ifsp.edu.br`)
3. O sistema verifica se o e-mail existe no banco de dados
4. O sistema gera um token de recuperação e envia por e-mail
5. O sistema exibe uma mensagem informando que um e-mail foi enviado

**Etapa 2: Redefinição de Senha**
1. O usuário acessa o link enviado por e-mail (contendo o token)
2. O sistema verifica se o token é válido e não expirou
3. O usuário informa a nova senha e confirmação
4. O sistema valida os dados e atualiza a senha
5. O sistema invalida o token usado
6. O usuário é redirecionado para a tela de login

### 2. Backend (NestJS)

O desenvolvimento do backend será realizado criando um novo módulo específico para recuperação de senha.

#### 2.1. Criação da Estrutura de Pastas

Primeiramente, será criada a estrutura de pastas do módulo de recuperar senha dentro do diretório `nest_academico/src/recuperar-senha/`. A estrutura será organizada da seguinte forma:

- **constants/**: Contém os arquivos de constantes do módulo
- **controllers/**: Contém os controllers que expõem os endpoints da API
- **dto/**: Contém os Data Transfer Objects (request, response)
  - **request/**: Contém os arquivos de request (entrada de dados)
  - **response/**: Contém os arquivos de response (saída de dados)
- **service/**: Contém a lógica de negócio do módulo

**Nota sobre a estrutura**: Neste módulo, não precisamos de um Converter porque os dados são simples. A conversão é feita diretamente no Service. O Converter é mais útil em módulos complexos como Usuario e Cidade, onde há muitos campos para mapear.

**Por que só 1 Controller e 1 Service?**
- **Controller**: Neste módulo, só precisamos de um controller porque ele vai ter 2 métodos (um para cada etapa):
  - `solicitarRecuperacao()` - Etapa 1
  - `redefinirSenha()` - Etapa 2
- **Service**: Só precisamos de um service porque a lógica das 2 etapas está relacionada (recuperação de senha). Se fossem operações muito diferentes, seria melhor separar.

#### 2.2. Criação dos DTOs (Data Transfer Objects)

**Entendendo os DTOs neste módulo**:

Como este módulo tem 2 etapas, precisamos de **2 Request diferentes** (um para cada etapa) e **2 Response diferentes** (um para cada etapa):

| DTO | Para qual etapa? | O que contém |
|-----|------------------|--------------|
| SolicitarRecuperacaoRequest | Etapa 1 (solicitar) | só o e-mail |
| SolicitarRecuperacaoResponse | Etapa 1 (resposta) | mensagem + token temporário |
| RedefinirSenhaRequest | Etapa 2 (redefinir) | token + nova senha + confirmação |
| RedefinirSenhaResponse | Etapa 2 (resposta) | mensagem de sucesso |

**SolicitarRecuperacaoRequest**: Define os dados para solicitar a recuperação de senha.

```typescript
// filepath: nest_academico/src/recuperar-senha/dto/request/solicitar-recuperacao.request.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SolicitarRecuperacaoRequest {
  @IsNotEmpty({ message: 'O e-mail deve ser informado' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @ApiProperty({ description: 'E-mail do usuário', example: 'usuario@email.com' })
  emailUsuario: string;
}
```

**SolicitarRecuperacaoResponse**: Resposta da solicitação de recuperação.

```typescript
// filepath: nest_academico/src/recuperar-senha/dto/response/solicitar-recuperacao.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class SolicitarRecuperacaoResponse {
  @ApiProperty({ description: 'Mensagem de sucesso', example: 'E-mail de recuperação enviado com sucesso' })
  mensagem: string;

  @ApiProperty({ description: 'Indica se a operação foi bem sucedida', example: true })
  sucesso: boolean;
}
```

**RedefinirSenhaRequest**: Define os dados para redefinir a senha.

```typescript
// filepath: nest_academico/src/recuperar-senha/dto/request/redefinir-senha.request.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RedefinirSenhaRequest {
  @IsNotEmpty({ message: 'O token deve ser informado' })
  @IsString({ message: 'O token deve ser um texto' })
  @ApiProperty({ description: 'Token de recuperação de senha', example: 'abc123def456' })
  token: string;

  @IsNotEmpty({ message: 'A nova senha deve ser informada' })
  @IsString({ message: 'A nova senha deve ser um texto' })
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres' })
  @MaxLength(20, { message: 'A nova senha deve ter no máximo 20 caracteres' })
  @ApiProperty({ description: 'Nova senha do usuário', example: 'novaSenha123' })
  novaSenha: string;

  @IsNotEmpty({ message: 'A confirmação de senha deve ser informada' })
  @IsString({ message: 'A confirmação de senha deve ser um texto' })
  @ApiProperty({ description: 'Confirmação da nova senha', example: 'novaSenha123' })
  confirmarSenha: string;
}
```

**RedefinirSenhaResponse**: Resposta da redefinição de senha.

```typescript
// filepath: nest_academico/src/recuperar-senha/dto/response/redefinir-senha.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class RedefinirSenhaResponse {
  @ApiProperty({ description: 'Mensagem de sucesso ou erro', example: 'Senha redefinida com sucesso' })
  mensagem: string;

  @ApiProperty({ description: 'Indica se a operação foi bem sucedida', example: true })
  sucesso: boolean;
}
```

#### 2.3. Criação do Service (Lógica de Negócio)

O service será responsável por toda a lógica de recuperação de senha:

**RecuperarSenhaService**: Responsável por:
1. Gerar token de recuperação
2. Enviar e-mail com o token
3. Validar token de recuperação
4. Redefinir a senha do usuário

Exemplo de implementação:

```typescript
// filepath: nest_academico/src/recuperar-senha/service/recuperar-senha.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';
import { Usuario } from '../../usuario/entity/usuario.entity';
import { SolicitarRecuperacaoRequest } from '../dto/request/solicitar-recuperacao.request';
import { RedefinirSenhaRequest } from '../dto/request/redefinir-senha.request';

@Injectable()
export class RecuperarSenhaService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // Tempo de expiração do token em minutos
  private readonly TOKEN_EXPIRATION = 30;

  async solicitarRecuperacao(solicitarRecuperacaoRequest: SolicitarRecuperacaoRequest) {
    // 1. Buscar o usuário pelo e-mail
    const usuario = await this.usuarioRepository.findOne({
      where: { emailUsuario: solicitarRecuperacaoRequest.emailUsuario }
    });

    // 2. Se o usuário não existir, não revelar isso por segurança
    // Retornar sucesso mesmo assim para evitar enumeração de e-mails
    if (!usuario) {
      return {
        mensagem: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação',
        sucesso: true
      };
    }

    // 3. Gerar token de recuperação
    const token = randomBytes(32).toString('hex');
    const tokenExpiracao = new Date();
    tokenExpiracao.setMinutes(tokenExpiracao.getMinutes() + this.TOKEN_EXPIRATION);

    // 4. Armazenar o token no banco de dados (pode adicionar campos na entidade ou criar uma tabela separada)
    // Por enquanto, vamos supor que a entidade Usuario tem campos para isso:
    // usuario.tokenRecuperacao = token;
    // usuario.tokenExpiracao = tokenExpiracao;
    // await this.usuarioRepository.save(usuario);

    // 5. Enviar e-mail com o token (implementação simplificada)
    console.log(`Token de recuperação: ${token}`);
    console.log(`Este token expira em ${this.TOKEN_EXPIRATION} minutos`);

    // Em produção, você usaria um serviço de e-mail como Nodemailer
    // await this.enviarEmail(usuario.emailUsuario, token);

    return {
      mensagem: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação',
      sucesso: true
    };
  }

  async redefinirSenha(redefinirSenhaRequest: RedefinirSenhaRequest) {
    // 1. Validar se a nova senha e a confirmação são iguais
    if (redefinirSenhaRequest.novaSenha !== redefinirSenhaRequest.confirmarSenha) {
      throw new HttpException('A nova senha e a confirmação não coincidem', HttpStatus.BAD_REQUEST);
    }

    // 2. Buscar o usuário pelo token
    // const usuario = await this.usuarioRepository.findOne({
    //   where: { tokenRecuperacao: redefinirSenhaRequest.token }
    // });

    // 3. Verificar se o token é válido
    // if (!usuario) {
    //   throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
    // }

    // 4. Verificar se o token não expirou
    // if (usuario.tokenExpiracao && new Date() > usuario.tokenExpiracao) {
    //   throw new HttpException('Token expirado. Solicite uma nova recuperação de senha.', HttpStatus.BAD_REQUEST);
    // }

    // 5. Gerar o hash da nova senha
    // const novaSenhaHash = await hash(redefinirSenhaRequest.novaSenha, 10);

    // 6. Atualizar a senha e limpar o token
    // usuario.senhaUsuario = novaSenhaHash;
    // usuario.tokenRecuperacao = null;
    // usuario.tokenExpiracao = null;
    // await this.usuarioRepository.save(usuario);

    return {
      mensagem: 'Senha redefinida com sucesso',
      sucesso: true
    };
  }
}
```

**Nota sobre a implementação**: Para uma implementação completa, você precisará:
1. Adicionar campos na entidade `Usuario` para armazenar o token e sua expiração
2. Implementar o envio de e-mail (usando Nodemailer ou outro serviço)
3. Criar uma página para o usuário redefinir a senha (com o token na URL)

#### 2.4. Criação do Controller

O controller expõe os endpoints da API RESTful:

```typescript
// filepath: nest_academico/src/recuperar-senha/controllers/recuperar-senha.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, Put, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';
import { RecuperarSenhaService } from '../service/recuperar-senha.service';
import { SolicitarRecuperacaoRequest } from '../dto/request/solicitar-recuperacao.request';
import { RedefinirSenhaRequest } from '../dto/request/redefinir-senha.request';

@Controller(ROTA.RECUPERAR_SENHA.BASE)
export class RecuperarSenhaController {
  constructor(private readonly recuperarSenhaService: RecuperarSenhaService) {}

  @HttpCode(HttpStatus.OK)
  @Post(ROTA.RECUPERAR_SENHA.SOLICITAR)
  async solicitarRecuperacao(
    @Req() res: Request,
    @Body() solicitarRecuperacaoRequest: SolicitarRecuperacaoRequest,
  ): Promise<Result<any>> {
    const response = await this.recuperarSenhaService.solicitarRecuperacao(solicitarRecuperacaoRequest);
    const _link = gerarLinks(res, 'recuperar-senha', null);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Solicitação de recuperação de senha processada',
      response,
      res.path,
      null,
      _link,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.RECUPERAR_SENHA.REDEFINIR)
  async redefinirSenha(
    @Req() res: Request,
    @Body() redefinirSenhaRequest: RedefinirSenhaRequest,
  ): Promise<Result<any>> {
    const response = await this.recuperarSenhaService.redefinirSenha(redefinirSenhaRequest);
    const _link = gerarLinks(res, 'recuperar-senha', null);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Senha redefinida com sucesso',
      response,
      res.path,
      null,
      _link,
    );
  }
}
```

#### 2.5. Definição das Rotas no Backend

As rotas precisam ser definidas no arquivo de constantes do sistema:

```typescript
// filepath: nest_academico/src/commons/constants/url.sistema.ts
export const ROTA = {
  // ... outras rotas
  RECUPERAR_SENHA: {
    BASE: 'sistema/recuperar-senha',
    SOLICITAR: 'solicitar',
    REDEFINIR: 'redefinir',
  },
};
```

#### 2.6. Criação do Módulo

O arquivo `recuperar-senha.module.ts` será criado para organizar todos os componentes do módulo:

```typescript
// filepath: nest_academico/src/recuperar-senha/recuperar-senha.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entity/usuario.entity';
import { RecuperarSenhaController } from './controllers/recuperar-senha.controller';
import { RecuperarSenhaService } from './service/recuperar-senha.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [RecuperarSenhaController],
  providers: [RecuperarSenhaService],
  exports: [RecuperarSenhaService],
})
export class RecuperarSenhaModule {}
```

#### 2.7. Registro do Módulo na Aplicação Principal

O módulo de recuperar senha será registrado no arquivo `app.module.ts`:

```typescript
// filepath: nest_academico/src/app/app.module.ts
import { RecuperarSenhaModule } from 'src/recuperar-senha/recuperar-senha.module';

@Module({
  imports: [
    // ... outros módulos
    RecuperarSenhaModule,
  ],
  // ...
})
export class AppModule {}
```

#### 2.8. URLs do Backend para Testes no Postman

**Solicitar Recuperação de Senha**

- **URL**: `http://localhost:8000/rest/sistema/recuperar-senha/solicitar`
- **Método**: POST
- **Corpo da Requisição (JSON)**:

```json
{
  "emailUsuario": "usuario@email.com"
}
```

**Resposta de Sucesso**:
```json
{
  "mensagem": "Se o e-mail estiver cadastrado, você receberá um link de recuperação",
  "sucesso": true
}
```

**Redefinir Senha**

- **URL**: `http://localhost:8000/rest/sistema/recuperar-senha/redefinir`
- **Método**: PUT
- **Corpo da Requisição (JSON)**:

```json
{
  "token": "abc123def456",
  "novaSenha": "novaSenha456",
  "confirmarSenha": "novaSenha456"
}
```

**Resposta de Sucesso**:
```json
{
  "mensagem": "Senha redefinida com sucesso",
  "sucesso": true
}
```

---

### 3. Frontend (React)

O desenvolvimento do frontend será realizado criando as interfaces para recuperação de senha.

#### 3.1. Configuração das Rotas

As rotas do módulo de recuperar senha serão configuradas nos arquivos:

- **url.ts**: Arquivo que define as rotas do sistema. Adicionar as rotas do módulo recuperar senha.
- **Router.tsx**: Arquivo principal de rotas que inclui as novas rotas.

As rotas criadas serão:
- `/sistema/recuperar-senha/solicitar` - Formulário para solicitar recuperação
- `/sistema/recuperar-senha/redefinir/:token` - Formulário para redefinir a senha

#### 3.2. Criação dos Services

Será criada a estrutura de services para o módulo de recuperar senha em `react_academico/src/services/recuperar-senha/`:

- **api/api.recuperar-senha.ts**: Funções para comunicação com a API
- **constants/recuperar-senha.constants.ts**: Constantes do módulo
- **type/RecuperarSenha.ts**: Definição das interfaces TypeScript

Exemplo de API:

```typescript
// filepath: react_academico/src/services/recuperar-senha/api/api.recuperar-senha.ts
import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';

export interface SolicitarRecuperacaoRequest {
  emailUsuario: string;
}

export interface RedefinirSenhaRequest {
  token: string;
  novaSenha: string;
  confirmarSenha: string;
}

export const apiSolicitarRecuperacao = async (dados: SolicitarRecuperacaoRequest) => {
  const response = await http.post(ROTA.RECUPERAR_SENHA.SOLICITAR, dados);
  return response;
};

export const apiRedefinirSenha = async (dados: RedefinirSenhaRequest) => {
  const response = await http.put(ROTA.RECUPERAR_SENHA.REDEFINIR, dados);
  return response;
};
```

#### 3.3. Criação dos Hooks

Serão criados dois hooks: um para solicitar recuperação e outro para redefinir a senha.

**Hook para Solicitar Recuperação**:

```typescript
// filepath: react_academico/src/services/recuperar-senha/hook/useSolicitarRecuperacao.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiSolicitarRecuperacao, SolicitarRecuperacaoRequest } from "../api/api.recuperar-senha";
import { RECUPERAR_SENHA } from "../constants/recuperar-senha.constants";

export const useSolicitarRecuperacao = () => {
  const navigate = useNavigate();
  
  const [model, setModel] = useState<SolicitarRecuperacaoRequest>({
    emailUsuario: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChangeField = (name: keyof SolicitarRecuperacaoRequest, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (name: keyof SolicitarRecuperacaoRequest, value: string) => {
    let messages: string[] = [];

    if (name === 'emailUsuario') {
      if (!value || value.trim().length === 0) {
        messages.push(RECUPERAR_SENHA.INPUT_ERROR.EMAIL.BLANK);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        messages.push(RECUPERAR_SENHA.INPUT_ERROR.EMAIL.INVALID);
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

    if (!model.emailUsuario || model.emailUsuario.trim().length === 0) {
      newErrors.emailUsuario = true;
      newErrors.emailUsuarioMensagem = [RECUPERAR_SENHA.INPUT_ERROR.EMAIL.BLANK];
      isFormValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.emailUsuario)) {
      newErrors.emailUsuario = true;
      newErrors.emailUsuarioMensagem = [RECUPERAR_SENHA.INPUT_ERROR.EMAIL.INVALID];
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

    try {
      await apiSolicitarRecuperacao(model);
      setSuccessMessage('Se o e-mail estiver cadastrado, você receberá um link de recuperação em breve.');
      setModel({ emailUsuario: '' });
    } catch (error: any) {
      console.log(error);
      // Por segurança, não revelar se o e-mail existe ou não
      setSuccessMessage('Se o e-mail estiver cadastrado, você receberá um link de recuperação em breve.');
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROTA.LOGIN);
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
    successMessage,
    handleChangeField,
    validateField,
    onSubmitForm,
    handleCancel,
    getInputClass,
  };
};
```

**Hook para Redefinir Senha**:

```typescript
// filepath: react_academico/src/services/recuperar-senha/hook/useRedefinirSenha.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiRedefinirSenha, RedefinirSenhaRequest } from "../api/api.recuperar-senha";
import { RECUPERAR_SENHA } from "../constants/recuperar-senha.constants";

export const useRedefinirSenha = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [model, setModel] = useState<RedefinirSenhaRequest>({
    token: token || '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChangeField = (name: keyof RedefinirSenhaRequest, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (name: keyof RedefinirSenhaRequest, value: string) => {
    let messages: string[] = [];

    switch (name) {
      case 'novaSenha':
        if (!value || value.trim().length === 0) {
          messages.push(RECUPERAR_SENHA.INPUT_ERROR.NOVA_SENHA.BLANK);
        } else if (value.length < 6) {
          messages.push(RECUPERAR_SENHA.INPUT_ERROR.NOVA_SENHA.MIN_LEN);
        }
        break;
      case 'confirmarSenha':
        if (!value || value.trim().length === 0) {
          messages.push(RECUPERAR_SENHA.INPUT_ERROR.CONFIRMAR_SENHA.BLANK);
        } else if (value !== model.novaSenha) {
          messages.push(RECUPERAR_SENHA.INPUT_ERROR.CONFIRMAR_SENHA.NOT_MATCH);
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

    if (!model.novaSenha || model.novaSenha.trim().length === 0) {
      newErrors.novaSenha = true;
      newErrors.novaSenhaMensagem = [RECUPERAR_SENHA.INPUT_ERROR.NOVA_SENHA.BLANK];
      isFormValid = false;
    } else if (model.novaSenha.length < 6) {
      newErrors.novaSenha = true;
      newErrors.novaSenhaMensagem = [RECUPERAR_SENHA.INPUT_ERROR.NOVA_SENHA.MIN_LEN];
      isFormValid = false;
    }

    if (!model.confirmarSenha || model.confirmarSenha.trim().length === 0) {
      newErrors.confirmarSenha = true;
      newErrors.confirmarSenhaMensagem = [RECUPERAR_SENHA.INPUT_ERROR.CONFIRMAR_SENHA.BLANK];
      isFormValid = false;
    } else if (model.confirmarSenha !== model.novaSenha) {
      newErrors.confirmarSenha = true;
      newErrors.confirmarSenhaMensagem = [RECUPERAR_SENHA.INPUT_ERROR.CONFIRMAR_SENHA.NOT_MATCH];
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

    try {
      await apiRedefinirSenha(model);
      setSuccessMessage('Senha redefinida com sucesso! Você será redirecionado para a tela de login.');
      setTimeout(() => {
        navigate(ROTA.LOGIN);
      }, 3000);
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Erro ao redefinir senha");
      }
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
    successMessage,
    handleChangeField,
    validateField,
    onSubmitForm,
    getInputClass,
  };
};
```

#### 3.4. Criação das Views

Serão criadas duas views: uma para solicitar recuperação e outra para redefinir a senha.

**View para Solicitar Recuperação**:

```tsx
// filepath: react_academico/src/views/recuperar-senha/SolicitarRecuperacao.tsx
import { FaPaperPlane } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useSolicitarRecuperacao } from "../../services/recuperar-senha/hook/useSolicitarRecuperacao";
import { RECUPERAR_SENHA } from "../../services/recuperar-senha/constants/recuperar-senha.constants";

export default function SolicitarRecuperacaoSenha() {
  const {
    model,
    errors,
    successMessage,
    handleChangeField,
    validateField,
    onSubmitForm,
    handleCancel,
    getInputClass,
  } = useSolicitarRecuperacao();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Recuperar Senha</h2>
        <p className="text-muted">
          Informe seu e-mail de cadastro para receber um link de recuperação de senha.
        </p>
        
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="emailUsuario" className="app-label">
              {RECUPERAR_SENHA.LABEL.EMAIL}:
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

          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Enviar link de recuperação"
            >
              <span className="btn-icon">
                <i>
                  <FaPaperPlane />
                </i>
              </span>
              Enviar
            </button>
            <button
              id="cancel"
              type="button"
              className="btn btn-cancel"
              title="Cancelar"
              onClick={handleCancel}
            >
              <span className="btn-icon">
                <i>
                  <MdCancel />
                </i>
              </span>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**View para Redefinir Senha**:

```tsx
// filepath: react_academico/src/views/recuperar-senha/RedefinirSenha.tsx
import { FaSave } from "react-icons/fa";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useRedefinirSenha } from "../../services/recuperar-senha/hook/useRedefinirSenha";
import { RECUPERAR_SENHA } from "../../services/recuperar-senha/constants/recuperar-senha.constants";

export default function RedefinirSenha() {
  const {
    model,
    errors,
    successMessage,
    handleChangeField,
    validateField,
    onSubmitForm,
    getInputClass,
  } = useRedefinirSenha();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Nova Senha</h2>
        <p className="text-muted">
          Informe a nova senha que você deseja usar para acessar sua conta.
        </p>
        
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="novaSenha" className="app-label">
              {RECUPERAR_SENHA.LABEL.NOVA_SENHA}:
            </label>
            <input
              id="novaSenha"
              name="novaSenha"
              type="password"
              value={model.novaSenha}
              className={getInputClass('novaSenha')}
              autoComplete="off"
              onChange={(e) => handleChangeField('novaSenha', e.target.value)}
              onBlur={(e) => validateField('novaSenha', e.target.value)}
            />
            {errors?.novaSenha && (
              <MensagemErro
                error={errors.novaSenha}
                mensagem={errors.novaSenhaMensagem}
              />
            )}
          </div>

          <div className="mb-2 mt-4">
            <label htmlFor="confirmarSenha" className="app-label">
              {RECUPERAR_SENHA.LABEL.CONFIRMAR_SENHA}:
            </label>
            <input
              id="confirmarSenha"
              name="confirmarSenha"
              type="password"
              value={model.confirmarSenha}
              className={getInputClass('confirmarSenha')}
              autoComplete="off"
              onChange={(e) => handleChangeField('confirmarSenha', e.target.value)}
              onBlur={(e) => validateField('confirmarSenha', e.target.value)}
            />
            {errors?.confirmarSenha && (
              <MensagemErro
                error={errors.confirmarSenha}
                mensagem={errors.confirmarSenhaMensagem}
              />
            )}
          </div>

          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Salvar nova senha"
            >
              <span className="btn-icon">
                <i>
                  <FaSave />
                </i>
              </span>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

### 4. Diferenças em Relação ao Módulo de Alterar Senha

| Aspecto | Alterar Senha | Recuperar Senha |
|---------|---------------|-----------------|
| **Contexto** | Usuário logado | Usuário não logado |
| **Verificação de identidade** | Senha atual | Token por e-mail |
| **Fluxo** | Direto (formulário) | Dois passos (solicitar + redefinir) |
| **URL da API** | PUT /alterar-senha/alterar/{id} | POST /recuperar-senha/solicitar e PUT /recuperar-senha/redefinir |

---

### 5. Observações Importantes

1. **Segurança - Não revelar existência de e-mail**: Por segurança, o sistema deve retornar a mesma mensagem tanto quando o e-mail existe quanto quando não existe. Isso evita que atacantes descubram quais e-mails estão cadastrados no sistema.

2. **Token de recuperação**: O token deve ser único, aleatório e ter um tempo de expiração (geralmente 30 minutos a 1 hora).

3. **Envio de e-mail**: Em produção, você precisará de um serviço de envio de e-mails (como Nodemailer, SendGrid, etc.).

4. **Validação no Backend**: Embora o frontend faça validações, o backend deve sempre validar novamente todos os dados recebidos.

5. **Invalidação do token**: Após usar o token para redefinir a senha, ele deve ser invalidado para evitar reutilização.

6. **Logging**: É uma boa prática registrar quando um usuário solicita recuperação de senha e quando a senha é redefinida.

---

### 6. Próximos Passos

Após implementar a recuperação de senha, você poderá implementar:

1. **Login (Tarefa 4)**: Sistema de autenticação com JWT
2. **2FA (Tarefa 5)**: Autenticação de dois fatores
3. **Validar Email (Tarefa 6)**: Verificação de e-mail do usuário

---

### Conclusão

O módulo de Recuperar Senha foi desenvolvido seguindo o mesmo padrão dos módulos existentes no projeto. A principal diferença é que esta funcionalidade não requer autenticação prévia e utiliza um sistema de token enviado por e-mail para verificar a identidade do usuário.

Esta funcionalidade é essencial para a usabilidade do sistema, permitindo que usuários que esqueceram sua senha possam recuperar o acesso à sua conta de forma segura.