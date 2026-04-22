# Segunda Atividade - Alterar Senha

---

## O que é Alterar Senha?

Alterar senha é o processo pelo qual um usuário loggedo pode modificar sua senha de acesso ao sistema. É uma funcionalidade de segurança importante que permite ao usuário manter sua conta protegida, alterando sua senha periodicamente ou quando houver necessidade.

### Por que criar um módulo separado para alterar senha?

Existem algumas razões importantes para criar um módulo separado para alteração de senha, ao invés de incluir essa funcionalidade no formulário de alteração de dados do usuário:

1. **Segurança**: A alteração de senha requer validações específicas e adicionais, como:
   - Verificação da senha atual
   - Requisitos mínimos de segurança para a nova senha
   - Confirmação da nova senha

2. **Prática recomendada**: É uma prática de segurança comum separar as funcionalidades de alteração de dados pessoais e alteração de senha.

3. **UX (Experiência do Usuário)**: O formulário de alteração de senha pode ter um fluxo diferente, com confirmações adicionais.

---

## Passo a Passo do Desenvolvimento

### 1. Backend (NestJS)

O desenvolvimento do backend será realizado criando um novo módulo específico para alteração de senha, seguindo o mesmo padrão dos módulos existentes.

#### 1.1. Criação da Estrutura de Pastas

Primeiramente, será criada a estrutura de pastas do módulo de alterar senha dentro do diretório `nest_academico/src/alterar-senha/`. A estrutura será organizada da seguinte forma:

- **constants/**: Contém os arquivos de constantes do módulo (mensagens de erro, configurações)
- **controllers/**: Contém os controllers que expõem os endpoints da API
- **dto/**: Contém os Data Transfer Objects (request, response, converter)
- **entities/**: Contém a entidade do banco de dados (se necessário)
- **service/**: Contém a lógica de negócio do módulo

#### 1.2. Criação da Entidade (Entity) - SE NECESSÁRIO

Para a alteração de senha, não será necessário criar uma nova tabela no banco de dados. A alteração será feita na tabela de usuários já existente (`Usuario`). O service utilizará o repositório existente de usuários.

#### 1.3. Criação dos DTOs (Data Transfer Objects)

**Nota importante sobre DTOs**: O padrão do projeto usa 3 tipos de DTOs:
- **Request**: Define os dados que vêm do frontend (entrada)
- **Response**: Define os dados que vão para o frontend (saída)
- **Converter**: Converte entre diferentes formatos (opcional, para módulos mais complexos)

Para este módulo de Alterar Senha, vamos criar um Converter para manter o padrão do projeto, mesmo sendo simples. Isso ajuda a entender como o sistema funciona.

**Estrutura de pastas a criar**:
```
nest_academico/src/alterar-senha/dto/
├── request/
│   └── alterar-senha.request.ts
├── response/
│   └── alterar-senha.response.ts
└── converter/
    └── alterar-senha.converter.ts  ← Novo arquivo
```

**AlterarSenhaRequest**: Define os dados que são recebidos na requisição de alteração de senha. Os campos necessários serão:

- **senhaAtual**: A senha atual do usuário (para verificação)
- **novaSenha**: A nova senha que o usuário deseja definir
- **confirmarSenha**: Confirmação da nova senha (para evitar erros de digitação)

Exemplo de implementação:

```typescript
// filepath: nest_academico/src/alterar-senha/dto/request/alterar-senha.request.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// import { IsPasswordStrong } from '../../decorators/password-validator.decorator';
// O decorator IsPasswordStrong seria usado se você quisesse validar
// força de senha com regex (ex: pelo menos 1 letra maiúscula, 1 número, 1 caractere especial)
// Para este projeto simples, não usaremos regex de validação de senha

export class AlterarSenhaRequest {
  @IsNotEmpty({ message: 'A senha atual deve ser informada' })
  @IsString({ message: 'A senha atual deve ser um texto' })
  @ApiProperty({ description: 'Senha atual do usuário', example: 'senha123' })
  senhaAtual: string;

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

**AlterarSenhaResponse**: Define os dados que são retornados na resposta da API.

```typescript
// filepath: nest_academico/src/alterar-senha/dto/response/alterar-senha.response.ts
import { ApiProperty } from '@nestjs/swagger';

export class AlterarSenhaResponse {
  @ApiProperty({ description: 'Mensagem de sucesso ou erro', example: 'Senha alterada com sucesso' })
  mensagem: string;

  @ApiProperty({ description: 'Indica se a operação foi bem sucedida', example: true })
  sucesso: boolean;
}
```

**ConverterAlterarSenha**: Converte os dados de entrada para o formato esperado pelo service. Embora simples, vamos criar para manter o padrão do projeto.

```typescript
// filepath: nest_academico/src/alterar-senha/dto/converter/alterar-senha.converter.ts
import { plainToInstance } from 'class-transformer';
import { AlterarSenhaRequest } from '../request/alterar-senha.request';
import { AlterarSenhaResponse } from '../response/alterar-senha.response';

export class ConverterAlterarSenha {
  static toAlterarSenhaResponse(data: any): AlterarSenhaResponse {
    return plainToInstance(AlterarSenhaResponse, data, {
      excludeExtraneousValues: true,
    });
  }
}
```

#### 1.4. Criação do Service (Lógica de Negócio)

O service será responsável por toda a lógica de alteração de senha:

**AlterarSenhaService**: Responsável por:
1. Receber o ID do usuário (do token JWT ou parâmetro)
2. Validar a senha atual (comparar com a senha hashada no banco)
3. Validar que a nova senha e a confirmação são iguais
4. Validar requisitos de segurança da nova senha
5. Gerar o hash da nova senha
6. Atualizar a senha no banco de dados
7. Retornar sucesso ou erro

Exemplo de implementação (versão com código comentado para bcrypt):

```typescript
// filepath: nest_academico/src/alterar-senha/service/alterar-senha.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { compare, hash } from 'bcrypt'; // npm install bcrypt + npm install -D @types/bcrypt

import { Usuario } from '../../usuario/entity/usuario.entity';
import { AlterarSenhaRequest } from '../dto/request/alterar-senha.request';

@Injectable()
export class AlterarSenhaService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async alterarSenha(idUsuario: number, alterarSenhaRequest: AlterarSenhaRequest) {
    // 1. Buscar o usuário no banco de dados
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario }
    });

    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    /*
    // 2. Verificar se a senha atual está correta (com bcrypt)
    const senhaCorreta = await compare(alterarSenhaRequest.senhaAtual, usuario.senhaUsuario);
    
    if (!senhaCorreta) {
      throw new HttpException('Senha atual incorreta', HttpStatus.UNAUTHORIZED);
    }
    */

    // 2. Verificar se a senha atual está correta (sem bcrypt - temporário)
    if (alterarSenhaRequest.senhaAtual !== usuario.senhaUsuario) {
      throw new HttpException('Senha atual incorreta', HttpStatus.UNAUTHORIZED);
    }

    // 3. Verificar se a nova senha e a confirmação são iguais
    if (alterarSenhaRequest.novaSenha !== alterarSenhaRequest.confirmarSenha) {
      throw new HttpException('A nova senha e a confirmação não coincidem', HttpStatus.BAD_REQUEST);
    }

    // 4. Validar requisitos de segurança da nova senha
    if (alterarSenhaRequest.novaSenha.length < 6) {
      throw new HttpException('A nova senha deve ter no mínimo 6 caracteres', HttpStatus.BAD_REQUEST);
    }

    /*
    // 5. Gerar o hash da nova senha (com bcrypt)
    const novaSenhaHash = await hash(alterarSenhaRequest.novaSenha, 10);
    usuario.senhaUsuario = novaSenhaHash;
    */

    // 5. Salvar a nova senha (sem bcrypt - temporário)
    usuario.senhaUsuario = alterarSenhaRequest.novaSenha;

    // 6. Atualizar a senha no banco de dados
    await this.usuarioRepository.save(usuario);

    return {
      mensagem: 'Senha alterada com sucesso',
      sucesso: true
    };
  }
}
```

**Nota importante sobre bcrypt**: O bcrypt é uma biblioteca de hash de senhas. Ela transforma a senha em uma string hashada que não pode ser revertida. Para verificar se uma senha está correta, comparamos o hash armazenado com o hash da senha informada pelo usuário.

Para instalar o bcrypt no NestJS:
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

**Para ativar o bcrypt depois de instalado**:
1. Descomentar a linha de import: `import { compare, hash } from 'bcrypt';`
2. Descomentar o bloco de verificação de senha atual (versão com bcrypt)
3. Descomentar o bloco de geração de hash da nova senha
4. Comentar as linhas da versão sem bcrypt

#### 1.5. Criação do Controller

O controller expõe o endpoint da API RESTful:

```typescript
// filepath: nest_academico/src/alterar-senha/controllers/alterar-senha.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Put, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ROTA } from '../../commons/constants/url.sistema';
import { Result } from '../../commons/mensagem/mensagem';
import { MensagemSistema } from '../../commons/mensagem/mensagem.sistema';
import { gerarLinks } from '../../commons/utils/hateoas.utils';
import { AlterarSenhaService } from '../service/alterar-senha.service';
import { AlterarSenhaRequest } from '../dto/request/alterar-senha.request';
import { AlterarSenhaResponse } from '../dto/response/alterar-senha.response';

@Controller(ROTA.ALTERAR_SENHA.BASE)
export class AlterarSenhaController {
  constructor(private readonly alterarSenhaService: AlterarSenhaService) {}

  @HttpCode(HttpStatus.OK)
  @Put(ROTA.ALTERAR_SENHA.ALTERAR)
  async alterarSenha(
    @Req() res: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() alterarSenhaRequest: AlterarSenhaRequest,
  ): Promise<Result<AlterarSenhaResponse>> {
    const response = await this.alterarSenhaService.alterarSenha(id, alterarSenhaRequest);
    const _link = gerarLinks(res, 'alterar-senha', id);
    return MensagemSistema.showMensagem(
      HttpStatus.OK,
      'Senha alterada com sucesso !',
      response,
      res.path,
      null,
      _link,
    );
  }
}
```

#### 1.6. Definição das Rotas no Backend

As rotas precisam ser definidas no arquivo de constantes do sistema:

```typescript
// filepath: nest_academico/src/commons/constants/url.sistema.ts
export const ROTA = {
  // ... outras rotas
  ALTERAR_SENHA: {
    BASE: 'sistema/alterar-senha',
    ALTERAR: 'alterar',
  },
};
```

#### 1.7. Criação do Módulo

O arquivo `alterar-senha.module.ts` será criado para organizar todos os componentes do módulo:

```typescript
// filepath: nest_academico/src/alterar-senha/alterar-senha.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entity/usuario.entity';
import { AlterarSenhaController } from './controllers/alterar-senha.controller';
import { AlterarSenhaService } from './service/alterar-senha.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [AlterarSenhaController],
  providers: [AlterarSenhaService],
  exports: [AlterarSenhaService],
})
export class AlterarSenhaModule {}
```

#### 1.8. Registro do Módulo na Aplicação Principal

O módulo de alterar senha será registrado no arquivo `app.module.ts`:

```typescript
// filepath: nest_academico/src/app/app.module.ts
import { AlterarSenhaModule } from 'src/alterar-senha/alterar-senha.module';

@Module({
  imports: [
    // ... outros módulos
    AlterarSenhaModule,
  ],
  // ...
})
export class AppModule {}
```

#### 1.9. URLs do Backend para Testes no Postman

Após o desenvolvimento, os testes podem ser realizados no Postman:

**Alterar Senha**

- **URL**: `http://localhost:8000/rest/sistema/alterar-senha/alterar/{id}`
- **Método**: PUT
- **Corpo da Requisição (JSON)**:

```json
{
  "senhaAtual": "senha123",
  "novaSenha": "novaSenha456",
  "confirmarSenha": "novaSenha456"
}
```

**Resposta de Sucesso**:
```json
{
  "mensagem": "Senha alterada com sucesso",
  "sucesso": true
}
```

**Resposta de Erro (senha atual incorreta)**:
```json
{
  "statusCode": 401,
  "message": "Senha atual incorreta",
  "error": "Unauthorized"
}
```

---

### 2. Frontend (React)

O desenvolvimento do frontend será realizado criando a interface para alteração de senha.

#### 2.1. Configuração das Rotas

As rotas do módulo de alterar senha serão configuradas nos arquivos:

- **url.ts**: Arquivo que define as rotas do sistema. Adicionar a rota do módulo alterar senha.
- **Router.tsx**: Arquivo principal de rotas que inclui as novas rotas do usuário.

As rotas criadas serão:
- `/sistema/alterar-senha/:idUsuario` - Formulário de alteração de senha

#### 2.2. Criação dos Services

Será criada a estrutura de services para o módulo de alterar senha em `react_academico/src/services/alterar-senha/`:

- **api/api.alterar-senha.ts**: Funções para comunicação com a API
- **constants/alterar-senha.constants.ts**: Constantes do módulo (labels, mensagens de erro)
- **type/AlterarSenha.ts**: Definição das interfaces TypeScript

Exemplo de API:

```typescript
// filepath: react_academico/src/services/alterar-senha/api/api.alterar-senha.ts
import { http } from '../../axios/config.axios';
import { ROTA } from '../../router/url';

export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export const apiAlterarSenha = async (idUsuario: string, dados: AlterarSenhaRequest) => {
  const response = await http.put(
    `${ROTA.ALTERAR_SENHA.ALTERAR}/${idUsuario}`,
    dados
  );
  return response;
};
```

#### 2.3. Criação do Hook

Será criado o hook para o formulário de alteração de senha:

```typescript
// filepath: react_academico/src/services/alterar-senha/hook/useAlterarSenha.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiAlterarSenha, AlterarSenhaRequest } from "../api/api.alterar-senha";
import { ALTERAR_SENHA } from "../constants/alterar-senha.constants";

export const useAlterarSenha = () => {
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const navigate = useNavigate();
  
  const [model, setModel] = useState<AlterarSenhaRequest>({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleChangeField = (name: keyof AlterarSenhaRequest, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (name: keyof AlterarSenhaRequest, value: string) => {
    let messages: string[] = [];

    switch (name) {
      case 'senhaAtual':
        if (!value || value.trim().length === 0) {
          messages.push(ALTERAR_SENHA.INPUT_ERROR.SENHA_ATUAL.BLANK);
        }
        break;
      case 'novaSenha':
        if (!value || value.trim().length === 0) {
          messages.push(ALTERAR_SENHA.INPUT_ERROR.NOVA_SENHA.BLANK);
        }
        if (value && value.length < 6) {
          messages.push(ALTERAR_SENHA.INPUT_ERROR.NOVA_SENHA.MIN_LEN);
        }
        break;
      case 'confirmarSenha':
        if (!value || value.trim().length === 0) {
          messages.push(ALTERAR_SENHA.INPUT_ERROR.CONFIRMAR_SENHA.BLANK);
        }
        if (value && value !== model.novaSenha) {
          messages.push(ALTERAR_SENHA.INPUT_ERROR.CONFIRMAR_SENHA.NOT_MATCH);
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

    // Validar senha atual
    if (!model.senhaAtual || model.senhaAtual.trim().length === 0) {
      newErrors.senhaAtual = true;
      newErrors.senhaAtualMensagem = [ALTERAR_SENHA.INPUT_ERROR.SENHA_ATUAL.BLANK];
      isFormValid = false;
    }

    // Validar nova senha
    if (!model.novaSenha || model.novaSenha.trim().length === 0) {
      newErrors.novaSenha = true;
      newErrors.novaSenhaMensagem = [ALTERAR_SENHA.INPUT_ERROR.NOVA_SENHA.BLANK];
      isFormValid = false;
    } else if (model.novaSenha.length < 6) {
      newErrors.novaSenha = true;
      newErrors.novaSenhaMensagem = [ALTERAR_SENHA.INPUT_ERROR.NOVA_SENHA.MIN_LEN];
      isFormValid = false;
    }

    // Validar confirmação de senha
    if (!model.confirmarSenha || model.confirmarSenha.trim().length === 0) {
      newErrors.confirmarSenha = true;
      newErrors.confirmarSenhaMensagem = [ALTERAR_SENHA.INPUT_ERROR.CONFIRMAR_SENHA.BLANK];
      isFormValid = false;
    } else if (model.confirmarSenha !== model.novaSenha) {
      newErrors.confirmarSenha = true;
      newErrors.confirmarSenhaMensagem = [ALTERAR_SENHA.INPUT_ERROR.CONFIRMAR_SENHA.NOT_MATCH];
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

    if (!idUsuario) {
      return;
    }

    try {
      const response = await apiAlterarSenha(idUsuario, model);
      console.log(response);
      alert("Senha alterada com sucesso!");
      navigate(ROTA.USUARIO.LISTAR);
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Erro ao alterar senha");
      }
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROTA.USUARIO.LISTAR);
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
    handleChangeField,
    validateField,
    onSubmitForm,
    handleCancel,
    getInputClass,
  };
};
```

#### 2.4. Criação da View

Será criada a view para o formulário de alteração de senha:

```tsx
// filepath: react_academico/src/views/alterar-senha/AlterarSenha.tsx
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { useAlterarSenha } from "../../services/alterar-senha/hook/useAlterarSenha";
import { ALTERAR_SENHA } from "../../services/alterar-senha/constants/alterar-senha.constants";

export default function AlterarSenhaUsuario() {
  const {
    model,
    errors,
    handleChangeField,
    validateField,
    onSubmitForm,
    handleCancel,
    getInputClass,
  } = useAlterarSenha();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Alterar Senha</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="senhaAtual" className="app-label">
              {ALTERAR_SENHA.LABEL.SENHA_ATUAL}:
            </label>
            <input
              id="senhaAtual"
              name="senhaAtual"
              type="password"
              value={model.senhaAtual}
              className={getInputClass('senhaAtual')}
              autoComplete="off"
              onChange={(e) => handleChangeField('senhaAtual', e.target.value)}
              onBlur={(e) => validateField('senhaAtual', e.target.value)}
            />
            {errors?.senhaAtual && (
              <MensagemErro
                error={errors.senhaAtual}
                mensagem={errors.senhaAtualMensagem}
              />
            )}
          </div>

          <div className="mb-2 mt-4">
            <label htmlFor="novaSenha" className="app-label">
              {ALTERAR_SENHA.LABEL.NOVA_SENHA}:
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
              {ALTERAR_SENHA.LABEL.CONFIRMAR_SENHA}:
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
              title="Alterar a senha do usuário"
            >
              <span className="btn-icon">
                <i>
                  <FaSave />
                </i>
              </span>
              Salvar
            </button>
            <button
              id="cancel"
              type="button"
              className="btn btn-cancel"
              title="Cancelar a alteração de senha"
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

#### 2.5. CSS da Tela

Não será necessário criar um CSS específico para esta tela, pois será utilizado o CSS padrão existente no projeto (mesmo padrão das outras telas de formulário).

---

### 3. Diferenças em Relação ao Módulo de Registro

| Aspecto | Registro de Usuário | Alterar Senha |
|---------|---------------------|---------------|
| **Objetivo** | Criar novo usuário | Alterar senha de usuário existente |
| **Campos do formulário** | Nome, Sobrenome, E-mail, Senha | Senha Atual, Nova Senha, Confirmar Senha |
| **Validações específicas** | Campos obrigatórios, formato de e-mail | Verificação de senha atual, confirmação de nova senha |
| **Quantidade de campos** | 4 campos | 3 campos |
| **Necessidade de autenticação** | Não (pode ser público) | Sim (usuário deve estar logado) |
| **URL da API** | POST /sistema/usuario/criar | PUT /sistema/alterar-senha/alterar/{id} |

---

### 4. Fluxo de Alteração de Senha

1. O usuário acessa a tela de alteração de senha (pode ser através de um botão no perfil ou no menu)
2. O usuário preenche os campos:
   - Senha atual (para confirmar identidade)
   - Nova senha (nova senha desejada)
   - Confirmar senha (repetir a nova senha)
3. O sistema valida:
   - Se a senha atual está correta
   - Se a nova senha atende aos requisitos de segurança
   - Se a nova senha e a confirmação são iguais
4. Se tudo estiver válido, o sistema:
   - Gera o hash da nova senha
   - Atualiza no banco de dados
   - Retorna sucesso para o usuário
5. O usuário é redirecionado para a lista de usuários ou página inicial

---

### 5. Observações Importantes

1. **Segurança**: A senha nunca deve ser armazenada em texto plano no banco de dados. Sempre utilize hash (bcrypt).

2. **Validação no Backend**: Embora o frontend faça validações, o backend deve sempre validar novamente todos os dados recebidos.

3. **Feedback ao Usuário**: É importante mostrar mensagens claras de sucesso ou erro para o usuário.

4. **Token JWT**: Em uma implementação real, o ID do usuário viria do token JWT de autenticação, não de um parâmetro na URL. Isso será implementado na tarefa de Login.

5. **Logging**: É uma boa prática registrar quando um usuário altera sua senha, para fins de auditoria.

---

### Conclusão

O módulo de Alterar Senha foi desenvolvido seguindo o mesmo padrão dos módulos existentes no projeto. A principal diferença é que esta funcionalidade requer validações específicas de segurança, como a verificação da senha atual e a confirmação da nova senha.

Esta funcionalidade é essencial para a segurança do sistema e será integrada com o sistema de Login nas próximas tarefas.