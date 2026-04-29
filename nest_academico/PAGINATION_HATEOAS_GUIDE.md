# Guia de Paginação e HATEOAS

Este documento explica como o sistema do projeto `nest_academico` usa Paginação e HATEOAS, e qual o passo a passo para replicar em outro sistema novo.

## 1. Estrutura de Paginação no código

### 1.1. Classe `Pageable`
Arquivo: `src/commons/pagination/page.response.ts`

- Recebe os parâmetros: `page`, `pageSize`, `props`, `order`.
- Normaliza os valores:
  - `page` menor que 1 vira 1.
  - `pageSize` maior que 100 vira 100.
  - `props` só é aceito se estiver na lista de campos permitidos.
  - `order` apenas `ASC` ou `DESC`.
- Expõe getters:
  - `offset = (page - 1) * pageSize`
  - `limit = pageSize`

Essa classe encapsula o comportamento de paginação para o serviço usar no query builder.

### 1.2. Classe `Page<T>`
Arquivo: `src/commons/pagination/page.sistema.ts`

- Armazena o resultado paginado com:
  - `content`: itens da página
  - `totalPages`: total de páginas
  - `totalElements`: total de registros
  - `pageSize`: tamanho da página
  - `page`: página atual
  - `lastPage`: alias para `totalPages`
- Método estático `Page.of(...)` calcula `totalPages` e cria a página.

### 1.3. Enum de valores padrão
Arquivo: `src/commons/enum/paginacao.enum.ts`

- `PAGINATION.PAGE = 1`
- `PAGINATION.PAGESIZE = 5`
- `PAGINATION.ASC = 'ASC'`
- `PAGINATION.DESC = 'DESC'`

Esses valores são usados no controlador quando o cliente não envia query params.

## 2. Fluxo de Paginação em `cidade`

### 2.1. Controller de listagem
Arquivo: `src/cidade/controllers/cidade.controller.findall.ts`

- Recebe query params:
  - `page`
  - `pageSize`
  - `props`
  - `order`
  - `searchTerm`
- Converte `page` e `pageSize` para número ou usa valores padrão.
- Chama o serviço `cidadeServiceFindAll.findAll(...)` com esses valores.
- Retorna um `Result<Page<CidadeResponse>>` com a resposta paginada.

### 2.2. Serviço de busca paginada
Arquivo: `src/cidade/service/cidade.service.findall.ts`

- Cria `new Pageable(page, pageSize, props, order, fieldsCidade)`.
- Monta query com TypeORM:
  - `.orderBy(props, order)`
  - `.offset(pageable.offset)`
  - `.limit(pageable.limit)`
- Se houver `search`, aplica `where(... LIKE ...)`.
- Executa `getManyAndCount()` para pegar lista e total.
- Converte para `CidadeResponse` e retorna `Page.of(cidades, totalElements, pageable)`.

### 2.3. Resultado final
O cliente recebe o objeto `Page` dentro do campo `dados` da resposta padrão.
O objeto inclui informação suficiente para criar navegação de página no frontend.

## 3. Estrutura de HATEOAS no código

### 3.1. Tipos e mensagens
Arquivo: `src/commons/mensagem/mensagem.ts`

- `Link` define `href` e `method`.
- `Result<T>` inclui optional `_link?: Record<string, Link>`.
- `MensagemSistema.showMensagem(...)` envia `_link` quando informado.

### 3.2. Geração de links HATEOAS
Arquivo: `src/commons/utils/hateoas.utils.ts`

Função `gerarLinks(req, entity, id?)`:
- Cria `baseUrl` com `protocol`, `host`, `ROTA_SISTEMA` e nome da entidade.
- Adiciona links básicos:
  - `listar` → `GET /rest/sistema/{entidade}/listar`
  - `criar` → `POST /rest/sistema/{entidade}/criar`
- Se `id` estiver presente, também adiciona:
  - `buscar` → `GET /.../buscar/{id}`
  - `alterar` → `PUT /.../alterar/{id}`
  - `excluir` → `PUT /.../excluir/{id}`

A função `geraPageLinks(req, page, entity)` já existe, mas atualmente retorna `null`.
Ela é o local onde se pode construir links de navegação de página (`self`, `next`, `prev`).

### 3.3. Uso em controladores
Vários controladores usam `gerarLinks(...)` e retornam `_link` no `MensagemSistema.showMensagem(...)`.
Exemplos:
- `src/cidade/controllers/cidade.controller.create.ts`
- `src/cidade/controllers/cidade.controller.findone.ts`
- `src/cidade/controllers/cidade.controller.update.ts`
- `src/cidade/controllers/cidade.controller.remove.ts`
- `src/usuario/controllers/usuario.controller.*`

Isso significa que a resposta de cada recurso traz rotas possíveis para o próximo passo.

## 4. Como replicar este padrão em outro sistema novo

### Passo 1: criar a base de rotas e constantes
- Defina constantes de rota semelhantes a `ROTA_SISTEMA` e `ROTA`.
- Tenha um padrão claro para as URLs das entidades:
  - `/rest/sistema/{entidade}/listar`
  - `/rest/sistema/{entidade}/criar`
  - `/rest/sistema/{entidade}/buscar/{id}`
  - `/rest/sistema/{entidade}/alterar/{id}`
  - `/rest/sistema/{entidade}/excluir/{id}`

### Passo 2: criar a classe de paginação `Pageable`
- Armazene `page`, `pageSize`, `props`, `order`.
- Exponha `offset` e `limit`.
- Valide o `props` em uma lista de campos permitidos.
- Proteja `pageSize` para evitar valores muito grandes.

### Passo 3: criar a classe de resposta `Page<T>`
- Guarde `content`, `totalPages`, `totalElements`, `pageSize`, `page`, `lastPage`.
- Implemente `Page.of(content, totalElements, pageable)`.

### Passo 4: adaptar o serviço de listagem
- No serviço de listagem, use `offset` e `limit` no select.
- Use `getManyAndCount()` ou equivalente do ORM para totalizar.
- Retorne um objeto `Page<T>` com os registros convertidos.

### Passo 5: ler query params no controlador
- Leia `page`, `pageSize`, `props`, `order`, `searchTerm`.
- Converta os valores para número ou use defaults.
- Chame o serviço paginado.
- Retorne a resposta padrão com o `dados` contendo a página.

### Passo 6: gerar HATEOAS para cada resposta
- Crie um utilitário que gere links baseado em `req`, `entity`, `id`.
- Insira `_link` na resposta padrão.
- Para respostas de listagem, adicione links de navegação de página quando disponível.

### Passo 7: implementar links de página
- Complete `geraPageLinks(req, page, entity)` para gerar:
  - `self`: link para página atual
  - `next`: link para próxima página, se existir
  - `prev`: link para página anterior, se existir
- Use `page.page`, `page.totalPages`, `page.pageSize` e query params atuais.

## 5. Observações específicas do projeto atual
- O sistema já implementa completamente a paginação técnica: controller, serviço, `Pageable`, `Page`.
- A parte de HATEOAS clássico está presente para operações de CRUD em `_link`.
- A função de links específicos para paginação (`geraPageLinks`) está definida mas ainda não populada.

## 6. Exemplo de endpoint de listagem com paginação
Request:
- `GET /rest/sistema/cidade/listar?page=1&pageSize=5&props=nomeCidade&order=ASC`

Resposta esperada:
- `dados` com objeto `Page<CidadeResponse>`
- `dados.content` lista de cidades
- `dados.totalElements` total de cidades
- `dados.totalPages` número de páginas
- `dados.page` página atual
- opcional `_link` com rotas HATEOAS

## 7. Pontos para reproduzir no novo sistema
- usar `page` e `pageSize` como query params
- encapsular offsets e limites em uma classe de paginação
- manter um objeto de resposta padrão com `_link`
- gerar links HATEOAS via utilitário centralizado
- usar rotas de CRUD consistentes por entidade

---

### Referências diretas no código atual
- `nest_academico/src/commons/pagination/page.response.ts`
- `nest_academico/src/commons/pagination/page.sistema.ts`
- `nest_academico/src/commons/enum/paginacao.enum.ts`
- `nest_academico/src/cidade/controllers/cidade.controller.findall.ts`
- `nest_academico/src/cidade/service/cidade.service.findall.ts`
- `nest_academico/src/commons/utils/hateoas.utils.ts`
- `nest_academico/src/commons/mensagem/mensagem.sistema.ts`
- `nest_academico/src/commons/mensagem/mensagem.ts`
