# Sexta Atividade - Validar E-mail

---

## O que é Validar E-mail? (Explicação para Iniciantes)

**Validar e-mail** é o processo de verificar se o endereço de e-mail que você colocou no cadastro realmente funciona e pertence a você.

### Analogia simples

É como quando você se cadastra em um site e eles enviam um e-mail saying "Clique aqui para confirmar seu e-mail". Isso serve para provar que você realmente tem acesso a aquele e-mail.

### Por que validar o e-mail?

1. **Autenticidade**: Garante que o usuário realmente tem acesso ao e-mail fornecido.
2. **Comunicação**: Permite que o sistema envie comunicações importantes para o usuário.
3. **Recuperação de conta**: O e-mail validado é essencial para recuperação de senha.
4. **Prevenção de fraudes**: Impede que usuários usem e-mails falsos ou de terceiros.
5. **Conformidade**: Algumas regulamentações exigem verificação de e-mail.

---

## Explicação Detalhada: Como funciona a validação de e-mail?

### Visão Geral do Fluxo

A validação de e-mail tem **2 etapas**:

| Etapa | Quando acontece | O que acontece |
|-------|-----------------|----------------|
| **Etapa 1** | Quando o usuário se cadastra | Sistema cria usuário com "e-mail não validado" e envia token por e-mail |
| **Etapa 2** | Quando o usuário clica no link do e-mail | Sistema valida o token e marca o e-mail como "validado" |

### Detalhamento da Etapa 1 (Cadastro)

1. O usuário preenche o formulário de cadastro (nome, e-mail, senha, etc.)
2. O sistema cria o usuário no banco de dados
3. O sistema define `emailValidado = false` (ainda não validado)
4. O sistema gera um **token de validação** (uma string aleatória)
5. O sistema "envia" o token por e-mail (na prática, mostra no console)
6. O sistema retorna sucesso no cadastro, mas avisa que o e-mail precisa ser validado

### Detalhamento da Etapa 2 (Validação)

1. O usuário acessa o link do e-mail (algo como `https://site.com/validar-email?token=abc123`)
2. O sistema verifica se o token é válido
3. O sistema verifica se o token não expirou (geralmente 24 horas)
4. O sistema atualiza o banco de dados: `emailValidado = true`
5. O sistema invalida o token (para não ser usado novamente)
6. O usuário vê uma mensagem de sucesso

### O que muda no banco de dados?

Na tabela de usuários, adicionamos 3 novos campos:

| Campo | Para que serve |
|-------|----------------|
| `emailValidado` | Boolean que indica se o e-mail foi validado (true/false) |
| `tokenValidacaoEmail` | Token que foi enviado por e-mail |
| `tokenValidacaoExpiracao` | Data/hora que o token expira |

### Por que precisamos modificar a entidade de Usuario?

Porque a validação de e-mail está relacionada ao usuário. Precisamos guardar:
- Se o e-mail já foi validado ou não
- O token atual (para poder validar)
- Quando o token expira

---

## Passo a Passo do Desenvolvimento

### 1. Fluxo de Validação de E-mail

O processo de validação de e-mail será dividido em duas etapas:

**Etapa 1: Solicitação de Validação (no cadastro)**
1. O usuário se cadastra no sistema
2. O sistema cria o usuário com um status de "e-mail não verificado"
3. O sistema gera um token de validação e envia por e-mail
4. O sistema retorna sucesso no cadastro, mas indica que o e-mail precisa ser validado

**Etapa 2: Confirmação do E-mail**
1. O usuário acessa o link enviado por e-mail (contendo o token)
2. O sistema verifica se o token é válido
3. O sistema atualiza o status do usuário para "e-mail verificado"
4. O sistema invalida o token usado
5. O usuário é redirecionado para uma página de sucesso

### 2. Backend (NestJS)

O desenvolvimento do backend será realizado criando um novo módulo de validação de e-mail.

#### 2.1. Criação da Estrutura de Pastas

Crie a estrutura de pastas do módulo de validação de e-mail dentro do diretório `nest_academico/src/validar-email/`:

- **constants/**: Contém os arquivos de constantes do módulo
- **controllers/**: Contém os controllers que expõem os endpoints da API
- **dto/**: Contém os Data Transfer Objects (request, response)
- **service/**: Contém a lógica de negócio do módulo

**Por que só 1 Controller e 1 Service?**
- **Controller**: O módulo de validação de e-mail só tem uma operação (validar o token), então precisa de apenas 1 controller.
- **Service**: A lógica é simples (verificar token e atualizar status), então fica em um service só.

**Nota sobre o Converter**: Não precisamos de Converter porque os dados são simples.

#### 2.2. Preparação da Entidade de Usuário

Antes de implementar o módulo, você precisará adicionar campos na entidade de usuário para armazenar o status de validação e o token:

```typescript
// filepath: nest_academico/src/usuario/entity/usuario.entity.ts (modificação)
import { BaseEntity } from '../../commons/entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'USUARIO' })
export class Usuario extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'ID_USUARIO' })
  idUsuario: number;

  @Column({ name: 'NOME_USUARIO', type: 'varchar', length: 50 })
  nomeUsuario: string = '';

  @Column({ name: 'SOBRENOME_USUARIO', type: 'varchar', length: 50 })
  sobrenomeUsuario: string = '';

  @Column({ name: 'EMAIL_USUARIO', type: 'varchar', length: 100, unique: true })
  emailUsuario: string = '';

  @Column({ name: 'SENHA_USUARIO', type: 'varchar', length: 100 })
  senhaUsuario: string = '';

  // Novos campos para validação de e-mail
  @Column({ name: 'EMAIL_VALIDADO', type: 'boolean', default: false })
  emailValidado: boolean = false;

  @Column({ name: 'TOKEN_VALIDACAO_EMAIL', type: 'varchar', length: 255, nullable: true })
  tokenValidacaoEmail: string | null = null;

  @Column({ name: 'TOKEN_VALIDACAO_EXPIRACAO', type: 'datetime', nullable: true })
  tokenValidacaoExpiracao: Date | null = null;
}
```

#### 2.3. Criação dos DTOs (Data Transfer Objects)

**ValidarEmailRequest**: Define os dados para validar o e-mail.

```typescript
// filepath: nest_academico/src/validar-email/dto/request/validar-email.request.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidarEmailRequest {
  @IsNotEmpty({ message: 'O token deve ser informado' })
  @IsString({ message: 'O token deve ser um texto' })
  @ApiProperty({ description: 'Token de validação de e-mail', example: 'abc123def456' })
  token: string;
}
```

**ValidarEmailResponse**: Define os dados retornados na validação.

```typescript
// filepath: nest_academico/src/validar-email/dto/response/validar-email.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class ValidarEmailResponse {
  @ApiProperty({ description: 'Mensagem de sucesso ou erro', example: 'E-mail validado com sucesso' })
  mensagem: string;

  @ApiProperty({ description: 'Indica se a operação foi bem sucedida', example: true })
  sucesso: boolean;
}
```

#### 2.4. Criação do Service (Lógica de Negócio)

O service será responsável por toda a lógica de validação de e-mail:

```typescript
// filepath: nest_academico/src/validar-email/service/validar-email.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Usuario } from '../../usuario/entity/usuario.entity';
import { ValidarEmailRequest } from '../dto/request/validar-email.request';

@Injectable()
export class ValidarEmailService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // Tempo de expiração do token em horas
  private readonly TOKEN_EXPIRATION_HOURS = 24;

  async validarEmail(validarEmailRequest: ValidarEmailRequest): Promise<ValidarEmailResponse> {
    // 1. Buscar o usuário pelo token de validação
    const usuario = await this.usuarioRepository.findOne({
      where: { tokenValidacaoEmail: validarEmailRequest.token }
    });

    // 2. Se o token não existir, retornar erro
    if (!usuario) {
      throw new HttpException(
        'Token de validação inválido',
        HttpStatus.BAD_REQUEST
      );
    }

    // 3. Verificar se o token não expirou
    if (usuario.tokenValidacaoExpiracao && new Date() > usuario.tokenValidacaoExpiracao) {
      throw new HttpException(
        'Token de validação expirado. Solicite uma nova validação de e-mail.',
        HttpStatus.BAD_REQUEST
      );
    }

    // 4. Verificar se o e-mail já foi validado
    if (usuario.emailValidado) {
      return {
        mensagem: 'E-mail já foi validado anteriormente',
        sucesso: true
      };
    }

    // 5. Atualizar o status do usuário
    usuario.emailValidado = true;
    usuario.tokenValidacaoEmail = null;
    usuario.tokenValidacaoExpiracao = null;
    await this.usuarioRepository.save(usuario);

    return {
      mensagem: 'E-mail validado com sucesso',
      sucesso: true
    };
  }

  // Método para gerar e enviar token de validação (chamado após o cadastro)
  async enviarTokenValidacao(usuario: Usuario): Promise<void> {
    // 1. Gerar token de validação
    const token = randomBytes(32).toString('hex');
    const tokenExpiracao = new Date();
    tokenExpiracao.setHours(tokenExpiracao.getHours() + this.TOKEN_EXPIRATION_HOURS);

    // 2. Armazenar o token no banco de dados
    usuario.tokenValidacaoEmail = token;
    usuario.tokenValidacaoExpiracao = tokenExpiracao;
    await this.usuarioRepository.save(usuario);

    // 3. Enviar e-mail com o link de validação
    // O link deve ser algo como: https://seusite.com/validar-email?token=abc123def456
    const linkValidacao = `http://localhost:5173/sistema/validar-email?token=${token}`;
    
    console.log(`Link de validação de e-mail: ${linkValidacao}`);
    console.log(`Este link expira em ${this.TOKEN_EXPIRATION_HOURS} horas`);
    
    // Em produção, você usaria um serviço de e-mail como Nodemailer
    // await this.enviarEmail(
    //   usuario.emailUsuario,
    //   `Bem-vindo! Clique no link para validar seu e-mail: ${linkValidacao}`
    // );
  }
}
```

#### 2.5. Modificação no Service de Criação de Usuário

Modifique o service de criação de usuário para enviar o token de validação:

```typescript
// filepath: nest_academico/src/usuario/service/usuario.service.create.ts (modificação)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { Usuario } from '../entity/usuario.entity';
import { UsuarioRequest } from '../dto/request/usuario.request';
import { UsuarioResponse } from '../dto/response/usuario.response';
import { ConverterUsuario } from '../dto/converter/usuario.converter';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UsuarioServiceCreate {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(usuarioRequest: UsuarioRequest): Promise<UsuarioResponse> {
    // 1. Verificar se o e-mail já está cadastrado
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { emailUsuario: usuarioRequest.emailUsuario }
    });

    if (usuarioExistente) {
      throw new HttpException(
        'E-mail já está cadastrado',
        HttpStatus.BAD_REQUEST
      );
    }

    // 2. Criar o usuário com senha hashada
    const senhaHash = await hash(usuarioRequest.senhaUsuario, 10);
    
    const usuario = ConverterUsuario.requestToEntity(usuarioRequest);
    usuario.senhaUsuario = senhaHash;
    usuario.emailValidado = false; // E-mail ainda não validado

    // 3. Salvar o usuário
    const usuarioSalvo = await this.usuarioRepository.save(usuario);

    // 4. Enviar token de validação de e-mail
    // (implemente a lógica aqui ou chame o método do ValidarEmailService)
    // await this.validarEmailService.enviarTokenValidacao(usuarioSalvo);

    return ConverterUsuario.entityToResponse(usuarioSalvo);
  }
}
```

#### 2.6. Criação do Controller

```typescript
// filepath: nest_academico/src/validar-email/controllers/validar-email.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';
import { ValidarEmailService } from '../service/validar-email.service';
import { ValidarEmailRequest } from '../dto/request/validar-email.request';

@Controller(ROTA.VALIDAR_EMAIL.BASE)
export class ValidarEmailController {
  constructor(private readonly validarEmailService: ValidarEmailService) {}

  @HttpCode(HttpStatus.OK)
  @Post(ROTA.VALIDAR_EMAIL.VALIDAR)
  async validarEmail(
    @Req() res: Request,
    @Body() validarEmailRequest: ValidarEmailRequest,
  ): Promise<Result<any>> {
    const response = await this.validarEmailService.validarEmail(validarEmailRequest);
    const _link = gerarLinks(res, 'validar-email', null);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Validação de e-mail processada',
      response,
      res.path,
      null,
      _link,
    );
  }
}
```

#### 2.7. Definição das Rotas no Backend

```typescript
// filepath: nest_academico/src/commons/constants/url.sistema.ts
export const ROTA = {
  // ... outras rotas
  VALIDAR_EMAIL: {
    BASE: 'sistema/validar-email',
    VALIDAR: 'validar',
  },
};
```

#### 2.8. Criação do Módulo

```typescript
// filepath: nest_academico/src/validar-email/validar-email.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entity/usuario.entity';
import { ValidarEmailController } from './controllers/validar-email.controller';
import { ValidarEmailService } from './service/validar-email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [ValidarEmailController],
  providers: [ValidarEmailService],
  exports: [ValidarEmailService],
})
export class ValidarEmailModule {}
```

#### 2.9. Registro do Módulo na Aplicação Principal

```typescript
// filepath: nest_academico/src/app/app.module.ts
import { ValidarEmailModule } from 'src/validar-email/validar-email.module';

@Module({
  imports: [
    // ... outros módulos
    ValidarEmailModule,
  ],
  // ...
})
export class AppModule {}
```

#### 2.10. URLs do Backend para Testes no Postman

**Validar E-mail**

- **URL**: `http://localhost:8000/rest/sistema/validar-email/validar`
- **Método**: POST
- **Corpo da Requisição (JSON)**:

```json
{
  "token": "abc123def456"
}
```

**Resposta de Sucesso**:
```json
{
  "mensagem": "E-mail validado com sucesso",
  "sucesso": true
}
```

**Resposta de Erro (token expirado)**:
```json
{
  "statusCode": 400,
  "message": "Token de validação expirado. Solicite uma nova validação de e-mail.",
  "error": "Bad Request"
}
```

---

### 3. Frontend (React)

O desenvolvimento do frontend será realizado criando a interface para validação de e-mail.

#### 3.1. Configuração das Rotas

As rotas do módulo de validação de e-mail:

- `/sistema/validar-email` - Página de validação de e-mail (com token na URL)

#### 3.2. Criação dos Services

```typescript
// filepath: react_academico/src/services/validar-email/api/api.validar-email.ts
import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';

export interface ValidarEmailRequest {
  token: string;
}

export interface ValidarEmailResponse {
  mensagem: string;
  sucesso: boolean;
}

export const apiValidarEmail = async (dados: ValidarEmailRequest): Promise<ValidarEmailResponse> => {
  const response = await http.post<ValidarEmailResponse>(ROTA.VALIDAR_EMAIL.VALIDAR, dados);
  return response.data;
};
```

#### 3.3. Criação do Hook de Validação de E-mail

```typescript
// filepath: react_academico/src/services/validar-email/hook/useValidarEmail.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiValidarEmail } from "../api/api.validar-email";
import { ROTA } from "../../router/url";

export const useValidarEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token de validação não encontrado');
      setIsValid(false);
      return;
    }

    const validarEmail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiValidarEmail({ token });
        setIsValid(true);
      } catch (err: any) {
        console.log(err);
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Erro ao validar e-mail. Tente novamente.');
        }
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    validarEmail();
  }, [token]);

  const handleRedirectToLogin = () => {
    navigate(ROTA.AUTH.LOGIN);
  };

  return {
    isLoading,
    isValid,
    error,
    handleRedirectToLogin,
  };
};
```

#### 3.4. Criação da View de Validação de E-mail

```tsx
// filepath: react_academico/src/views/validar-email/ValidarEmail.tsx
import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";
import { useValidarEmail } from "../../services/validar-email/hook/useValidarEmail";

export default function ValidarEmail() {
  const {
    isLoading,
    isValid,
    error,
    handleRedirectToLogin,
  } = useValidarEmail();

  if (isLoading) {
    return (
      <div className="display">
        <div className="card animated fadeInDown">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <h3 className="mt-3">Validando seu e-mail...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="display">
        <div className="card animated fadeInDown">
          <div className="text-center">
            <FaTimesCircle className="text-danger" size={64} />
            <h3 className="mt-3 text-danger">Erro na Validação</h3>
            <p className="text-muted">{error}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={handleRedirectToLogin}
            >
              Voltar para Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isValid) {
    return (
      <div className="display">
        <div className="card animated fadeInDown">
          <div className="text-center">
            <FaCheckCircle className="text-success" size={64} />
            <h3 className="mt-3 text-success">E-mail Validado!</h3>
            <p className="text-muted">
              Seu e-mail foi validado com sucesso. Agora você pode fazer login no sistema.
            </p>
            <button
              className="btn btn-success mt-3"
              onClick={handleRedirectToLogin}
            >
              <FaEnvelope className="me-2" />
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
```

#### 3.5. Modificação na View de Criar Usuário

Adicione uma mensagem indicando que o usuário precisa validar seu e-mail:

```tsx
// filepath: react_academico/src/views/usuario/Criar.tsx (modificação)
// No método onSubmitForm, após criar o usuário com sucesso:

const onSubmitForm = async (e: any) => {
  e.preventDefault();

  if (!validarFormulario()) {
    console.log("Erro na validação dos dados");
    return;
  }

  try {
    const response = await apiPostUsuario(model);
    console.log(response);
    
    // Mostrar mensagem de sucesso com instrução de validar e-mail
    alert("Usuário criado com sucesso! Verifique seu e-mail para validar sua conta.");
    
    // Redireciona para a lista de usuários
    navigate(ROTA.USUARIO.LISTAR);
  } catch (error: any) {
    console.log(error);
    // Tratar erros de criação
  }
};
```

---

### 4. Diferenças em Relação ao Módulo de Registro

| Aspecto | Registro de Usuário | Validar E-mail |
|---------|---------------------|----------------|
| **Objetivo** | Criar novo usuário | Verificar posse do e-mail |
| **Momento** | No cadastro | Após o cadastro |
| **Status do usuário** | Criado com emailValidado = false | Atualiza para emailValidado = true |
| **URL da API** | POST /sistema/usuario/criar | POST /sistema/validar-email/validar |

---

### 5. Observações Importantes

1. **Token de validação**: O token deve ser único, aleatório e ter um tempo de expiração razoável (24 horas é padrão).

2. **Envio de e-mail**: Em produção, você precisará de um serviço de envio de e-mails (como Nodemailer, SendGrid, etc.).

3. **Invalidação do token**: Após usar o token para validar o e-mail, ele deve ser invalidado para evitar reutilização.

4. **Reenvio de token**: Considere implementar uma funcionalidade para o usuário solicitar um novo token de validação se o anterior expirou.

5. **Proteção de rotas**: Algumas rotas do sistema podem exigir que o usuário tenha o e-mail validado para acessar.

6. **Logging**: É uma boa prática registrar quando um token de validação é enviado e quando o e-mail é validado.

---

### 6. Fluxo Completo do Usuário

1. **Cadastro**: O usuário se cadastra no sistema
2. **E-mail enviado**: O sistema envia um e-mail com o link de validação
3. **Validação**: O usuário acessa o link e valida seu e-mail
4. **Login**: O usuário pode fazer login normalmente
5. **Recuperação de senha**: O sistema só permite recuperação de senha para usuários com e-mail validado

---

### Conclusão

O módulo de Validar E-mail foi desenvolvido seguindo o mesmo padrão dos módulos existentes no projeto. A principal diferença é que esta funcionalidade adiciona uma camada de segurança ao processo de cadastro, verificando que o usuário realmente tem acesso ao e-mail fornecido.

O sistema de validação de e-mail é fundamental para a segurança e usabilidade do sistema, permitindo:
- Garantir que o usuário tenha acesso ao e-mail fornecido
- Possibilitar a recuperação de senha de forma segura
- Enviar comunicações importantes para o usuário
- Prevenir fraudes e uso de e-mails falsos

Com a conclusão desta tarefa, você terá implementado todas as funcionalidades de segurança do sistema:
- ✅ Registro de Usuário
- ✅ Alterar Senha
- ✅ Recuperar Senha
- ✅ Login com JWT
- ✅ Autenticação de Dois Fatores (2FA)
- ✅ Validar E-mail

O sistema está completo e pronto para uso!