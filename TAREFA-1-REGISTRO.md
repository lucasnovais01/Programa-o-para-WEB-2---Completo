## Primeira Atividade - Criar Registro de Usuário

---

### O que é Registro de Usuário

Registro de usuário é o processo de criar uma conta em um sistema ou aplicação. É através do registro que o sistema armazena as informações do novo usuário, permitindo que ele tenha acesso aos recursos e funcionalidades do sistema.

O registro geralmente envolve a coleta de dados pessoais do usuário, como nome, sobrenome, e-mail e senha. Esses dados são armazenados em um banco de dados e utilizados para autenticação e identificação do usuário em futuras interações com o sistema.

O processo de registro é fundamental para a segurança e personalização de qualquer aplicação, pois permite que o sistema reconheça cada usuário de forma única e ofereça uma experiência personalizada.

---

## Passo a Passo do Desenvolvimento

### 1. Backend (NestJS)

O desenvolvimento do backend foi iniciado seguindo o modelo do módulo de Cidade, que já estava funcionando perfeitamente. O objetivo era criar um módulo completo de usuário com todas as operações CRUD (Create, Read, Update, Delete).

#### 1.1. Criação da Estrutura de Pastas

Primeiramente, foi criada a estrutura de pastas do módulo de usuário dentro do diretório `nest_academico/src/usuario/`. A estrutura foi organizada da seguinte forma:

- **constants/**: Contém os arquivos de constantes do módulo (mensagens de erro, configurações)
- **controllers/**: Contém os controllers que expõem os endpoints da API
- **dto/**: Contém os Data Transfer Objects (request, response, converter)
- **entities/**: Contém a entidade do banco de dados
- **service/**: Contém a lógica de negócio do módulo

#### 1.2. Criação da Entidade (Entity)

A entidade `Usuario` foi criada no arquivo `entity/usuario.entity.ts`. Esta entidade define a estrutura da tabela no banco de dados MySQL. Os campos definidos foram:

- **idUsuario**: Campo primário gerado automaticamente (auto-increment)
- **nomeUsuario**: Nome do usuário (varchar 50)
- **sobrenomeUsuario**: Sobrenome do usuário (varchar 50)
- **emailUsuario**: E-mail do usuário (varchar 100)
- **senhaUsuario**: Senha do usuário (varchar 100)

A entidade estende `BaseEntity` que já vem do projeto base e fornece os campos de timestamp (`createdAt` e `updatedAt`) automaticamente.

#### 1.3. Criação dos DTOs (Data Transfer Objects)

Foram criados três tipos de DTOs:

**UsuarioRequest**: Define os dados que são recebidos na requisição de criação/atualização. Contém validações usando decorators do class-validator como `@IsNotEmpty()`, `@IsString()`, `@MaxLength()`.

**UsuarioResponse**: Define os dados que são retornados nas respostas da API. Utiliza `@Expose()` e `@ApiProperty()` para documentação Swagger.

**ConverterUsuario**: Classe utilitária que converte entre as diferentes representações (Request → Entity, Entity → Response).

#### 1.4. Criação dos Services (Lógica de Negócio)

Cada service foi criado com uma responsabilidade específica:

- **UsuarioServiceCreate**: Responsável por criar novos usuários. Inclui validação para verificar se o e-mail já está cadastrado.
- **UsuarioServiceFindAll**: Responsável por listar todos os usuários com suporte a paginação e ordenação.
- **UsuarioServiceFindOne**: Responsável por buscar um usuário específico pelo ID.
- **UsuarioServiceUpdate**: Responsável por atualizar os dados de um usuário existente.
- **UsuarioServiceRemove**: Responsável por excluir um usuário do banco de dados.

#### 1.5. Criação dos Controllers

Os controllers expõem os endpoints da API RESTful:

- **UsuarioControllerCreate**: Endpoint POST para criar usuário
- **UsuarioControllerFindAll**: Endpoint GET para listar usuários
- **UsuarioControllerFindOne**: Endpoint GET para buscar usuário por ID
- **UsuarioControllerUpdate**: Endpoint PUT para atualizar usuário
- **UsuarioControllerRemove**: Endpoint DELETE para excluir usuário

#### 1.6. Criação do Módulo

O arquivo `usuario.module.ts` foi criado para organizar todos os componentes do módulo. Ele importa o TypeOrmModule configurado com a entidade Usuario e registra todos os controllers e services.

#### 1.7. Registro do Módulo na Aplicação Principal

O módulo de usuário foi registrado no arquivo `app.module.ts` localizado em `nest_academico/src/app/app.module.ts`. A linha adicionada foi:

```typescript
import { UsuarioModule } from 'src/usuario/usuario.module';
```

E depois o `UsuarioModule` foi adicionado no array de `imports` do `@Module()`.

---

### 2. Testes no Postman

Após o desenvolvimento do backend, foram realizados testes utilizando o Postman para verificar se todos os endpoints estavam funcionando corretamente.

#### 2.1. Listar Usuários

**URL**: `http://localhost:8000/rest/sistema/usuario/listar`

**Método**: GET

**Parâmetros Query** (opcionais):
- `page`: Número da página (padrão: 1)
- `pageSize`: Quantidade de registros por página (padrão: 5)
- `props`: Campo para ordenação (ex: ID_USUARIO, NOME_USUARIO)
- `order`: Tipo de ordenação (ASC ou DESC)
- `searchTerm`: Termo de busca

**Resposta**: Retorna um objeto com os dados dos usuários paginados.

#### 2.2. Buscar Usuário por ID

**URL**: `http://localhost:8000/rest/sistema/usuario/buscar/{id}`

**Método**: GET

**Exemplo**: `http://localhost:8000/rest/sistema/usuario/buscar/1`

**Resposta**: Retorna os dados do usuário encontrado ou erro 404 se não existir.

#### 2.3. Criar Usuário

**URL**: `http://localhost:8000/rest/sistema/usuario/criar`

**Método**: POST

**Corpo da Requisição (JSON)**:

```json
{
  "nomeUsuario": "Carlos",
  "sobrenomeUsuario": "Silva",
  "emailUsuario": "carlos.silva@uni.com",
  "senhaUsuario": "123456"
}
```

**Resposta**: Retorna os dados do usuário criado com sucesso, incluindo o ID gerado automaticamente.

---

### 3. Frontend (React)

O desenvolvimento do frontend foi realizado seguindo o mesmo padrão do módulo de Cidade. Foram criadas as views, services, hooks e configurações necessárias para a interface de usuário.

#### 3.1. Configuração das Rotas

As rotas do módulo de usuário foram configuradas nos arquivos:

- **url.ts**: Arquivo que define as rotas do sistema. Adicionada a rota do módulo usuário.
- **Router.tsx**: Arquivo principal de rotas que inclui as novas rotas do usuário.

As rotas criadas foram:
- `/sistema/usuario/listar` - Lista de usuários
- `/sistema/usuario/criar` - Formulário de criação
- `/sistema/usuario/buscar/:idUsuario` - Consulta de usuário
- `/sistema/usuario/alterar/:idUsuario` - Formulário de alteração
- `/sistema/usuario/excluir/:idUsuario` - Confirmação de exclusão

#### 3.2. Configuração do Layout

No arquivo `Layout.tsx` localizado em `react_academico/src/components/layout/Layout.tsx`, foi adicionado o link para a página de listagem de usuários no menu de navegação.

#### 3.3. Criação dos Services

Foi criada a estrutura de services para o módulo de usuário em `react_academico/src/services/usuario/`:

- **api/api.usuario.ts**: Funções para comunicação com a API (GET, POST, PUT, DELETE)
- **constants/usuario.constants.ts**: Constantes do módulo (labels, mensagens de erro, configurações)
- **type/Usuario.ts**: Definição das interfaces TypeScript para o tipo Usuario
- **hook/useCriar.ts**: Hook para o formulário de criação de usuário
- **hook/useAlterar.ts**: Hook para o formulário de alteração de usuário

#### 3.4. Criação das Views

Foram criadas cinco views para o módulo de usuário:

- **Criar.tsx**: Formulário para cadastrar novo usuário com campos de nome, sobrenome, e-mail e senha
- **Listar.tsx**: Tabela com paginação, ordenação e busca para listar todos os usuários
- **Consultar.tsx**: Visualização dos dados de um usuário específico (somente leitura)
- **Alterar.tsx**: Formulário para editar os dados de um usuário existente
- **Excluir.tsx**: Tela de confirmação para excluir um usuário

Cada view foi desenvolvida seguindo o padrão do módulo de Cidade, com validações de campos e tratamento de erros.

---

### 4. Diferenças em Relação ao Módulo Cidade

Existem algumas diferenças importantes entre o módulo de Usuário e o módulo de Cidade:

#### 4.1. Diferenças no Backend

| Aspecto | Cidade | Usuário |
|---------|--------|---------|
| **Campo ID**  | Possui `codCidade` (código manual) e `idCidade` (ID automático)            | Enquanto Usuario possui apenas `idUsuario` (ID automático) |
| **Quantidade de Campos** | 2 campos (codigo, nome)   | 5 campos (id, nome, sobrenome, email, senha) |
| **Validação de Email**   | Não possui                | Verifica se o e-mail já está cadastrado |
| **Validação de Senha**   | Não possui                | Valida tamanho mínimo de 6 caracteres |

#### 4.2. Diferenças no Frontend

| Aspecto | Cidade | Usuário |
|---------|--------|---------|
| **Campos no Formulário** | Código e Nome | Nome, Sobrenome, E-mail, Senha |
| **Validações** | Apenas campos obrigatórios e tamanho | Validações completas incluindo e-mail e senha |
| **Tabela de Listagem** | 2 colunas (Código, Nome) | 4 colunas (ID, Nome, Sobrenome, E-mail) |
| **Campo de Código** | Visível e editável no formulário de alteração | Apenas leitura (gerado automaticamente) |

---

### Conclusão

O módulo de Registro de Usuário foi desenvolvido com sucesso, seguindo todas as boas práticas de desenvolvimento utilizadas no módulo de Cidade. O sistema agora permite cadastrar, listar, consultar, alterar e excluir usuários de forma completa, com validações tanto no frontend quanto no backend.


### Pós-modificações:

Após a conclusão inicial do módulo de Registro de Usuário, foram identificadas e corrigidas algumas inconsistências e melhorias necessárias:

#### 1. Correção do Campo de Senha no Backend

**Problema identificado**: O campo de senha no backend estava com o nome `senha` enquanto no frontend era `senhaUsuario`, causando inconsistência na comunicação entre as camadas.

**Solução**: O campo foi renomeado de `senha` para `senhaUsuario` em todos os arquivos do backend:
- `entity/usuario.entity.ts`
- `dto/converter/usuario.converter.ts`
- `dto/request/usuario.request.ts`
- `dto/response/usuario.response.ts`

**Justificativa**: Manter a consistência de nomenclatura entre frontend e backend, seguindo o padrão do projeto (nomeUsuario, sobrenomeUsuario, emailUsuario, senhaUsuario).

#### 2. Correção da Entity - Campo sobrenomeUsuario

**Problema identificado**: O campo `sobrenomeUsuario` estava declarado na entity sem a anotação `@Column`, o que causava erro de compilação TypeScript.

**Solução**: Adicionada a anotação `@Column` com as devidas configurações:

```typescript
@Column({
  name: 'SOBRENOME_USUARIO',
  type: 'varchar',
  length: 50,
})
sobrenomeUsuario: string = '';
```

#### 3. Correção dos Hooks do Frontend

**Problema identificado**: Os hooks `useCriar` e `useAlterar` estavam com validações do campo ID que não existem no formulário de criação.

**Solução**: Removida a validação do campo ID nos hooks, pois o ID é gerado automaticamente pelo banco de dados.

#### 4. Correção dos Botões de Navegação

**Problema identificado**: 
- O botão "Salvar" na tela de Criar não redirecionava para a lista após criar com sucesso
- O botão "Cancelar" não funcionava nas telas de Criar, Consultar e Excluir

**Solução**: 
- Adicionado `navigate(ROTA.USUARIO.LISTAR)` no `onSubmitForm` do hook useCriar
- Adicionada função `handleCancel` em todas as views (Criar, Consultar, Excluir) com redirecionamento para a lista

#### 5. Comentário do Campo Senha na Tela de Alterar

**Problema identificado**: O campo de senha estava aparecendo na tela de Alterar, mas a alteração de senha deve ser feita em um módulo separado (Tarefa 2 - Alterar Senha).

**Solução**: O campo de senha foi comentado no arquivo `Alterar.tsx`:

```tsx
{/* Vou deixar comentado a parte de alteração de senha pelo botão Alterar */}
{/* 
<div className="mb-2 mt-4">
  <label htmlFor="senhaUsuario" className="app-label">
    {USUARIO.LABEL.SENHA}:
  </label>
  <input
    id={USUARIO.FIELDS.SENHA}
    name={USUARIO.FIELDS.SENHA}
    value={model?.senhaUsuario}
    className={getInputClass(USUARIO.FIELDS.SENHA)}
    readOnly={false}
    disabled={false}
    autoComplete="off"
    onChange={(e) =>
      handleChangeField(USUARIO.FIELDS.SENHA, e.target.value)
    }
    onBlur={(e) => validateField(USUARIO.FIELDS.SENHA, e)}
  />
  {errors?.senhaUsuario && (
    <MensagemErro
      error={errors.senhaUsuario}
      mensagem={errors.senhaUsuarioMensagem}
    />
  )}
</div>
*/}
```

**Justificativa**: A alteração de senha é uma funcionalidade de segurança que requer validações específicas (como verificação de senha atual). Por isso, será implementada em um módulo separado (Tarefa 2 - Alterar Senha), seguindo as melhores práticas de segurança.

---

### 6. Segurança - Criptografia de Senha com bcrypt

#### O que é bcrypt?

**bcrypt** é uma biblioteca de segurança que transforma senhas em "hash" (uma string codificada que não pode ser revertida). 

**Por que usar?** Se alguém roubar o banco de dados, não vai conseguir ver as senhas dos usuários. As senhas ficam protegidas.

#### Como funciona o bcrypt?

1. **Criptografar (hash)**: Transforma "senha123" em algo como "$2b$10$Xy9..."
2. **Comparar**: Para verificar se a senha está correta, compara o hash armazenado com o hash da senha informada

#### Instalação do bcrypt

No terminal, dentro da pasta `nest_academico`:

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

#### Implementação no Código

**Passo 1**: No arquivo `usuario.converter.ts`, descomentar as linhas do bcrypt:

```typescript
// filepath: nest_academico/src/usuario/dto/converter/usuario.converter.ts
import { plainToInstance } from 'class-transformer';
import { hash } from 'bcrypt'; // ← Descomentar esta linha

import { Usuario } from 'src/usuario/entity/usuario.entity';
import { UsuarioRequest } from '../request/usuario.request';
import { UsuarioResponse } from '../response/usuario.response';

export class ConverterUsuario {
  // Versão com bcrypt (descomentar)
  static async toUsuario(usuarioRequest: UsuarioRequest) {
    const usuario = new Usuario();

    if (usuarioRequest.idUsuario != null) {
      usuario.idUsuario = usuarioRequest.idUsuario;
    }
    usuario.nomeUsuario = usuarioRequest.nomeUsuario;
    usuario.sobrenomeUsuario = usuarioRequest.sobrenomeUsuario;
    usuario.emailUsuario = usuarioRequest.emailUsuario;

    // Criptografar a senha antes de salvar
    const saltRounds = 10;
    usuario.senhaUsuario = await hash(usuarioRequest.senhaUsuario, saltRounds);

    return usuario;
  }

  // Versão sem bcrypt (comentar)
  /*
  static toUsuario(usuarioRequest: UsuarioRequest) {
    const usuario = new Usuario();
    // ... código existente ...
    usuario.senhaUsuario = usuarioRequest.senhaUsuario;
    return usuario;
  }
  */
}
```

**Passo 2**: No arquivo `usuario.service.create.ts`, mudar para async:

```typescript
// filepath: nest_academico/src/usuario/service/usuario.service.create.ts
async create(usuarioRequest: UsuarioRequest): Promise<UsuarioResponse> {
  // Usar a versão async do toUsuario
  let usuario = await ConverterUsuario.toUsuario(usuarioRequest);
  // ... resto do código ...
}
```

**Passo 3**: No arquivo `usuario.service.update.ts`, mudar para async:

```typescript
// filepath: nest_academico/src/usuario/service/usuario.service.update.ts
async update(idUsuario: number, usuarioRequest: UsuarioRequest): Promise<UsuarioResponse> {
  // Usar a versão async do toUsuario
  let usuario = await ConverterUsuario.toUsuario(usuarioRequest);
  // ... resto do código ...
}
```

#### Observações Importantes

1. **Salt Rounds**: O número `10` em `hash(senha, 10)` é o "salt rounds". Quanto maior, mais seguro, mas mais lento. O padrão é 10.

2. **Senhas no Banco**: Depois de implementar o bcrypt, as senhas no banco vão parecer "$2b$10$Xy9..." - isso é normal e significa que estão protegidas.

3. **Testes**: Após implementar o bcrypt, você precisará criar um novo usuário para testar, pois as senhas antigas não vão funcionar (não estão em hash).

---

### Conclusão das Pós-modificações

Todas as correções foram realizadas mantendo o padrão do código do professor e seguindo as boas práticas de desenvolvimento. O módulo de Registro de Usuário está funcionando corretamente e pronto para as próximas tarefas (Alterar Senha, Recuperar Senha, Login, 2FA, Validar Email).

---

### Novas Alterações - Campos Confirmar Senha e Segurança

Após a conclusão das correções anteriores, foram implementadas mais duas funcionalidades importantes solicitadas na atividade:

#### 6. Adição do Campo Confirmar Senha no Frontend

**Problema identificado**: A atividade solicitava que houvesse um campo de "confirmar senha" no formulário de cadastro, para verificar se o usuário digitou a senha corretamente.

**Solução**: 
- Adicionado o campo `confirmarSenhaUsuario` no arquivo `type/Usuario.ts`
- Adicionadas as configurações do campo no arquivo `constants/usuario.constants.ts` (FIELDS, LABEL, INPUT_ERROR)
- Adicionado o campo no formulário `Criar.tsx` com validação
- Adicionada validação no hook `useCriar.tsx` para verificar se a senha e a confirmação são iguais

**Justificativa**: O campo de confirmar senha é uma validação de segurança do frontend que verifica se a senha digitada foi escrita corretamente, evitando erros de digitação. O backend não armazena este campo, pois a verificação é feita apenas no momento do cadastro.

**Código adicionado no Criar.tsx**:
```tsx
{/* 
  O campo confirmarSenha é uma validação de segurança do frontend.
  Ele verifica se a senha digitada foi escrita corretamente, 
  evitando erros de digitação. O backend não armazena este campo,
  pois a verificação é feita apenas no momento do cadastro.
*/}
<Input
  label={USUARIO.LABEL.CONFIRMAR_SENHA}
  id={USUARIO.FIELDS.CONFIRMAR_SENHA}
  name={USUARIO.FIELDS.CONFIRMAR_SENHA}
  type="password"
  value={model?.confirmarSenhaUsuario}
  onChange={(e) =>
    handleChangeField(USUARIO.FIELDS.CONFIRMAR_SENHA, e.target.value)
  }
  onBlur={(e) => validateField(USUARIO.FIELDS.CONFIRMAR_SENHA, e)}
  error={errors.confirmarSenhaUsuario}
  errorMensagem={errors.confirmarSenhaUsuarioMensagem}
/>
```

#### 7. Ocultação da Senha no Formulário (type="password")

**Problema identificado**: A atividade solicitava que a senha fosse armazenada de forma segura, e a primeira etapa disso é não exibir a senha em texto plano no formulário.

**Solução**: Adicionado `type="password"` nos campos de senha e confirmar senha no arquivo `Criar.tsx`.

**Justificativa**: O uso de `type="password"` faz com que os caracteres da senha sejam substituídos por asteriscos ou pontos, ocultando a senha enquanto o usuário digita. Isso é uma prática de segurança básica que impede que pessoas próximas vejam a senha digitada.

**Código adicionado**:
```tsx
<Input
  label={USUARIO.LABEL.SENHA}
  id={USUARIO.FIELDS.SENHA}
  name={USUARIO.FIELDS.SENHA}
  type="password"  {/* Adicionado para ocultar a senha */}
  value={model?.senhaUsuario}
  // ...
/>
```

#### 8. Comentário sobre Funcionalidade de Mostrar/Ocultar Senha

**Problema identificado**: Seria interessante ter um botão para mostrar/ocultar a senha, mas isso ainda não foi implementado.

**Solução**: Adicionado um comentário no código indicando que esta funcionalidade pode ser implementada no futuro:

```tsx
{/* 
  Funcionalidade de mostrar/ocultar senha (ícone de olho) ainda não implementada.
  Esta funcionalidade permitiria ao usuário visualizar a senha digitada
  ao clicar no ícone de olho, melhorando a experiência do usuário.
  Implementação futura: adicionar um botão com ícone de olho ao lado do campo de senha.
*/}
```

#### 9. Ajuste nas Validações de Tamanho Mínimo

**Problema identificado**: As validações de tamanho mínimo para nome e sobrenome estavam muito longas (6 caracteres), dificultando o cadastro de nomes curtos.

**Solução**: Ajuste realizado nos arquivos de constants:
- Backend (`nest_academico/src/usuario/constants/usuario.constants.ts`): Adicionadas constantes específicas para senha (`MIN_LEN_SENHA = 6`, `MAX_LEN_SENHA = 20`)
- Frontend (`react_academico/src/services/usuario/constants/usuario.constants.ts`): Alterado o `MIN_LEN` de 6 para 3 nos campos de nome e sobrenome

**Justificativa**: Nomes e sobrenomes podem ser curtos (como "Ana" ou "Jo"), então o mínimo de 3 caracteres é mais adequado. Para senhas, o mínimo de 6 caracteres é uma prática de segurança recomendada.

---

### Conclusão Final

O módulo de Registro de Usuário está completo com todas as funcionalidades solicitadas:
- ✅ Cadastro de usuários com validação completa
- ✅ Campos: nome, sobrenome, email, senha, confirmar senha
- ✅ Validações no frontend e backend
- ✅ Senha oculta no formulário (type="password")
- ✅ Confirmação de senha para evitar erros
- ✅ Navegação correta entre telas
- ✅ Documentação completa para as próximas tarefas