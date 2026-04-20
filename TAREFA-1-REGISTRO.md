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
| **Campo ID**  | Possui `codCidade` (código manual) e `idCidade` (ID automático) | Possui apenas `idUsuario` (ID automático) |
| **Quantidade de Campos** | 2 campos (codigo, nome) | 5 campos (id, nome, sobrenome, email, senha) |
| **Validação de Email**   | Não possui | Verifica se o e-mail já está cadastrado |
| **Validação de Senha**   | Não possui | Valida tamanho mínimo de 6 caracteres |

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