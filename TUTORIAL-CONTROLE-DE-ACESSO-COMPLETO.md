# TUTORIAL COMPLETO — Prova: Controle de Acesso

> Baseado no código real do projeto `Sistema_de_aprendizagem-escola.rar` (nest_academico + react_academico). Cada trecho abaixo foi tirado do seu código, incluindo os comentários que você e seu professor deixaram. Não é teoria genérica — é o seu sistema, explicado.

---

## 1. Visão geral da arquitetura

```
react_academico (porta 3000)  --HTTP-->  nest_academico (porta configurada em PORT, padrão 5000)
        |                                          |
   localStorage                              MySQL (TypeORM)
   (accessToken + usuario)                   tabela `usuario`
```

- **Backend**: NestJS + Passport (`passport-local` para login, `passport-jwt` para validar token) + `@nestjs/jwt`.
- **Frontend**: React + Vite + Axios, guardando sessão em `localStorage` (não usa cookies).
- **Banco**: MySQL via TypeORM, com `entities: [__dirname + '/../**/*.entity.{ts,js}']` — ou seja, **todo** arquivo terminado em `.entity.ts` é carregado automaticamente, mesmo que você não importe ele em lugar nenhum. Isso importa porque seu projeto tem duas entidades de usuário (ver seção 6.1).

---

## 2. Mapa de arquivos (o que faz cada um)

### Backend (`nest_academico/src/auth`)

| Arquivo | Responsabilidade |
|---|---|
| `auth.module.ts` | Registra Strategies, Guards, Service e o `JwtModule` (token de acesso) |
| `controllers/auth.controllers.ts` | Expõe `POST /auth/session/login` e `GET /auth/google` |
| `config/strategy/local/local.strategy.ts` | Lê `emailUsuario`/`senhaUsuario` do corpo da requisição e delega ao `AuthService` |
| `service/auth.service.ts` | Busca usuário, compara senha com bcrypt, monta cookie, gera token |
| `service/jwt.service.ts` | Cria e verifica tokens JWT (access/refresh/verification) |
| `config/guard/local.auth.guard.ts` | `LocalAuthGuard` — dispara o Passport Local antes do `login()` |
| `config/guard/jwt.access.guard.ts` | Protege rotas exigindo token válido (lê de **cookie**, não do header) |
| `guards/local.auth.guard.ts` | ⚠️ Arquivo duplicado e **vazio** — não é usado em lugar nenhum, ignore-o |

### Backend (`nest_academico/src/usuario`)

| Arquivo | Responsabilidade |
|---|---|
| `entities/usuario.entity.ts` | **Entidade real** usada pelo projeto (`@Entity('usuario')`) |
| `entity/usuario.entity.ts` | ⚠️ Entidade **órfã**, de uma versão antiga (`@Entity('USUARIO')`), ninguém importa ela no código — mas o TypeORM carrega ela do mesmo jeito por causa do glob `**/*.entity.ts` |
| `service/usuario.service.ts` | CRUD de usuário, hashing de senha com bcrypt, checagem de e-mail duplicado |

### Frontend (`react_academico/src`)

| Arquivo | Responsabilidade |
|---|---|
| `services/auth/api/api.auth.ts` | Faz `POST /auth/session/login` via Axios |
| `services/auth/hook/useLogin.tsx` | Estado do formulário, validação, chama a API, grava `localStorage`, redireciona |
| `services/auth/hook/useAuth.tsx` | Lê `localStorage`, expõe `isAuthenticated`/`usuario`/`logout`, escuta evento `auth-change` |
| `services/axios/config.axios.ts` | Instância do Axios (`baseURL`, headers) — **sem interceptor de token** |
| `components/auth/ProtectedRoute.tsx` | Componente que bloqueia rota sem login — **existe mas não está conectado ao Router** |
| `services/router/Router.tsx` | Define todas as rotas da aplicação |
| `views/auth/Login.tsx` | Tela de login (formulário + botão Google) |

---

## 3. Fluxo de Login passo a passo (com código real)

### 3.1 Usuário digita e clica "Entrar"

`Login.tsx` usa o hook `useLogin`:

```tsx
<form onSubmit={(e) => onSubmitForm(e)}>
  <input
    id="emailUsuario"
    name="emailUsuario"
    value={model.emailUsuario}
    onChange={(e) => handleChangeField('emailUsuario', e.target.value)}
  />
  <input
    id="senhaUsuario"
    name="senhaUsuario"
    type="password"
    value={model.senhaUsuario}
    onChange={(e) => handleChangeField('senhaUsuario', e.target.value)}
  />
  <button type="submit">Entrar</button>
</form>
```

### 3.2 `useLogin.tsx` valida e chama a API

```ts
const onSubmitForm = async (e: any) => {
  e.preventDefault();
  if (!validarFormulario()) return;
  setIsLoading(true);

  try {
    const response = await apiLogin(model);

    localStorage.setItem('accessToken', response.accessToken);
    if (response.usuario) {
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
    }

    window.dispatchEvent(new CustomEvent('auth-change'));
    navigate(ROTA.DASHBOARD);
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || 'Erro ao realizar login. Tente novamente.';
    setErrors({ geral: errorMessage });
  } finally {
    setIsLoading(false);
  }
};
```

Pontos-chave para a prova:
- A validação de campos roda **antes** de chamar a API (`validarFormulario()`), então erro 400 do back só aparece se os campos já passaram pela validação do front.
- O evento `auth-change` é disparado manualmente porque o evento nativo `storage` do navegador **não dispara na mesma aba** que fez a alteração — só em outras abas. Por isso o projeto criou esse evento customizado.

### 3.3 `api.auth.ts` faz a requisição HTTP

```ts
const AUTH_API_LOGIN = '/auth/session/login';

export const apiLogin = async (dados: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>(AUTH_API_LOGIN, dados);
  return response.data;
};
```

`http` vem de `config.axios.ts`:

```ts
export const http = axios.create({
  baseURL: REST_CONFIG.BASE_URL, // 'http://localhost:8000'
  timeout: 15000,
  headers: { "Content-type": "application/json", Accept: "application/json" },
  withCredentials: false,
});
```

### 3.4 Backend recebe em `POST /auth/session/login`

```ts
@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('/session/login')
  async login(@Req() req: Request) {
    const usuario = req.user as Usuario;

    const { accessToken, expireInAccessToken } =
      await this.authService.getJwtAccessToken({ idUsuario: usuario.idUsuario } as any);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: expireInAccessToken,
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

O decorator `@UseGuards(LocalAuthGuard)` faz o Passport rodar **antes** do corpo do método `login`. Se a estratégia local falhar (usuário não existe ou senha errada), o método `login` nunca chega a executar — o Passport já responde com erro.

### 3.5 `LocalAuthGuard` aciona a `LocalStrategy`

```ts
// config/guard/local.auth.guard.ts
export class LocalAuthGuard extends AuthGuard('local') {}
```

```ts
// config/strategy/local/local.strategy.ts
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'emailUsuario',
      passwordField: 'senhaUsuario',
    });
  }

  async validate(emailUsuario: string, senhaUsuario: string): Promise<Usuario | null> {
    const usuario = await this.authService.getAuthenticatedUser(emailUsuario, senhaUsuario);
    return usuario;
  }
}
```

**Por que `usernameField`/`passwordField` estão no `super()`?** Por padrão, o `passport-local` procura campos chamados `username` e `password` no corpo da requisição. Como este projeto usa `emailUsuario` e `senhaUsuario` (para bater com a entidade `Usuario`), é preciso avisar a estratégia disso explicitamente — senão ela nunca vai achar os campos e sempre vai falhar a autenticação.

O retorno de `validate()` é o que o Passport coloca em `req.user` (usado no passo 3.4).

### 3.6 `AuthService.getAuthenticatedUser` valida credenciais

```ts
async getAuthenticatedUser(email: string, senha: string): Promise<Usuario> {
  const usuario = await this.findByEmail(email);
  const matching = await this.verificarSenha(senha, usuario.senhaUsuario);

  if (!matching) {
    throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
  }
  return usuario;
}

async findByEmail(email: string): Promise<Usuario> {
  const usuario = await this.usuarioRepository
    .createQueryBuilder('usuario')
    .where('usuario.emailUsuario = :email', { email })
    .getOne();

  if (!usuario) {
    throw new HttpException('Usuário não cadastrado', HttpStatus.NOT_FOUND);
  }
  return usuario;
}

async verificarSenha(senha: string, hashedSenha: string): Promise<boolean> {
  const isSenhaMatching = await bcrypt.compare(senha, hashedSenha);
  if (!isSenhaMatching) {
    throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
  }
  return true;
}
```

Pontos-chave para a prova:
- `findByEmail` filtra por `usuario.emailUsuario`, exatamente o nome da propriedade na entidade TypeORM (não o nome da coluna no banco, que é `EMAIL` — o TypeORM faz esse mapeamento sozinho).
- `bcrypt.compare(senha_pura, hash_do_banco)` — nunca se descriptografa um hash, só se compara.
- Se o e-mail não existe: 404. Se a senha está errada: 400. Isso é importante porque o frontend lê `error.response.data.message` para mostrar o erro — então a mensagem que aparece na tela depende de qual dessas exceções foi lançada.

### 3.7 Geração do token JWT

```ts
// auth.service.ts
async getJwtAccessToken(usuario: RequestUserPayload) {
  const { accessToken, expireInAccessToken } =
    await this.jsonWebTokenService.createAccessToken(usuario);

  const cookie = this.getCookieAccessToken(accessToken, expireInAccessToken);

  return { cookie, accessToken, expireInAccessToken };
}
```

```ts
// jwt.service.ts
async createAccessToken(userToken: RequestUserPayload, timer?: number) {
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

private secretAccessToken() {
  return this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_SECRET');
}

private expireInSecondsAccessToken(timer?: number): number {
  const expirationTime = Number(
    this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
  );
  return timer ?? expirationTime;
}
```

`getOrThrow` **lança erro e impede a aplicação de subir** se a variável não existir no `.env`. Isso é proposital (fail-fast: prefere quebrar na inicialização do que rodar com configuração incompleta).

O payload do JWT contém só `{ idUsuario }` — nada de e-mail ou nome. Por isso, depois de validar o token, qualquer rota protegida precisa buscar o usuário de novo no banco usando esse `idUsuario` (é o que o `JwtAccessTokenGuard` faz, ver seção 5).

### 3.8 Frontend recebe e guarda a sessão

De volta no `useLogin.tsx`:

```ts
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('usuario', JSON.stringify(response.usuario));
window.dispatchEvent(new CustomEvent('auth-change'));
navigate(ROTA.DASHBOARD);
```

### 3.9 `useAuth.tsx` mantém o estado de autenticação sincronizado

```ts
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    const syncAuthFromStorage = () => {
      const token = localStorage.getItem('accessToken');
      const usuarioStr = localStorage.getItem('usuario');

      if (token && usuarioStr) {
        try {
          const parsedUsuario = JSON.parse(usuarioStr);
          setIsAuthenticated(true);
          setUsuario(parsedUsuario);
          return;
        } catch { /* ... */ }
      }

      setIsAuthenticated(false);
      setUsuario(null);
    };

    syncAuthFromStorage();

    window.addEventListener('storage', syncAuthFromStorage);
    window.addEventListener('auth-change', syncAuthFromStorage as EventListener);

    return () => {
      window.removeEventListener('storage', syncAuthFromStorage);
      window.removeEventListener('auth-change', syncAuthFromStorage as EventListener);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    setIsAuthenticated(false);
    setUsuario(null);
    window.location.href = ROTA.AUTH.LOGIN;
  };

  return { isAuthenticated, usuario, logout };
};
```

Esse hook é consumido em `Layout.tsx` para mostrar o nome do usuário logado, e é a base de `ProtectedRoute.tsx` (ver seção 5).

---

## 4. Como rodar localmente

```bash
# Terminal 1 — backend
cd nest_academico
npm install
npm run start:dev

# Terminal 2 — frontend
cd react_academico
npm install
npm run dev
```

### `.env` mínimo para o backend subir

O `app.module.ts` valida com Joi que estas variáveis **existem**, e o `auth.module.ts`/`jwt.service.ts` exigem (`getOrThrow`) mais estas:

```
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_DATABASE=nome_do_seu_banco
DATABASE_SYNCHRONIZE=true

JWT_ACCESS_TOKEN_SECRET=qualquer-chave-secreta
JWT_ACCESS_TOKEN_EXPIRATION_TIME=3600
JWT_REFRESH_TOKEN_SECRET=outra-chave-secreta
JWT_REFRESH_TOKEN_EXPIRATION_TIME=86400
JWT_VERIFICATION_TOKEN_SECRET=mais-uma-chave

PORT=8000
```

> Sem essas variáveis, a aplicação **não inicia** — não é um bug, é a validação de configuração fazendo o trabalho dela.

---

## 5. Por que o login pode não estar funcionando — checklist de causa raiz

Estes são problemas reais encontrados no seu código (não suposições — testados lendo o código-fonte):

### 5.1 Porta do backend não combina com a porta esperada pelo frontend

`main.ts`:
```ts
await app.listen(process.env.PORT ?? 5000);
```

`sistema.constants.ts` (frontend):
```ts
export const REST_CONFIG = {
  BASE_URL: 'http://localhost:8000',
};
```

Se você não definir `PORT=8000` no `.env` do backend, ele sobe na porta **5000**, e todo request do frontend para `localhost:8000` vai cair em erro de conexão (`ERR_CONNECTION_REFUSED`), nunca chegando a ser um erro de credenciais.

**Correção**: defina `PORT=8000` no `.env`, ou troque `BASE_URL` para `http://localhost:5000`. Escolha um dos dois lados, não tente adivinhar.

### 5.2 Duas entidades `Usuario` carregadas pelo TypeORM

`app.module.ts`:
```ts
entities: [__dirname + '/../**/*.entity.{ts,js}'],
```

Esse glob carrega **qualquer** arquivo `*.entity.ts`, inclusive o órfão `usuario/entity/usuario.entity.ts` (sem `s`), que define `@Entity('USUARIO')` com colunas diferentes (`nome_usuario`, `email_usuario`, `senha` em vez de `nomeUsuario`, `emailUsuario`, `senhaUsuario`). Isso pode causar erro de metadados duplicados do TypeORM ao iniciar a aplicação, ou problemas confusos de sincronização de schema se `DATABASE_SYNCHRONIZE=true`.

**Correção**: apague (ou renomeie para `.bak`) o arquivo `nest_academico/src/usuario/entity/usuario.entity.ts`. A entidade válida e usada em todo o código é `usuario/entities/usuario.entity.ts` (com `s`).

### 5.3 O front nunca envia o token de volta ao backend

`config.axios.ts` não tem interceptor algum — ele só envia `Content-type` e `Accept`. Depois do login, o `accessToken` fica parado no `localStorage` e nenhuma chamada subsequente (por exemplo, listar usuários ou cidades) inclui o header `Authorization`. Qualquer rota protegida por `JwtAccessTokenGuard` vai responder 401, mesmo com o usuário "logado" na tela.

**Correção** — adicione um interceptor:
```ts
// config.axios.ts
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 5.4 `JwtAccessTokenGuard` procura o token em cookie, mas o front guarda em localStorage

```ts
// jwt.access.guard.ts
private extractToken(request: any) {
  const cookieName = process.env.SESSION_COOKIE_NAME || 'Authentication';
  const sessionToken = request.cookies?.[cookieName];
  return sessionToken;
}
```

Isso lê `request.cookies`, mas:
- O backend não tem `cookie-parser` instalado/configurado em `main.ts`, então `request.cookies` é sempre `undefined`.
- O login (seção 3.4) nunca seta esse cookie no navegador — ele só retorna o token no **corpo** da resposta JSON.
- O front nunca manda cookie nenhum (`withCredentials: false`).

Ou seja: mesmo corrigindo o item 5.3 e mandando `Authorization: Bearer ...`, o guard atual **ignora esse header** e procura em outro lugar que nunca é preenchido. Toda rota protegida por esse guard vai sempre cair no `throw new ApiException(UNAUTHORIZED, 'Não existe sessão para o usuário')`.

**Correção** — trocar a extração para ler do header (já que esse é o padrão que o resto do projeto usa):
```ts
private extractToken(request: any) {
  const authHeader = request.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}
```
(O mesmo vale para `jwt.refresh.guard.ts`, que tem o código quase idêntico.)

### 5.5 `usuario.email` retorna `undefined`

Em `jwt.access.guard.ts` e `jwt.refresh.guard.ts`:
```ts
request.user = {
  idUsuario: usuarioLogado.idUsuario,
  email: usuarioLogado.email,        // <-- aqui
  name: usuarioLogado.nomeUsuario,
  // ...
  isVerified: usuarioLogado.email ? true : false,
};
```

Na entidade real (`usuario/entities/usuario.entity.ts`):
```ts
@Column({ name: 'EMAIL', unique: true })
emailUsuario!: string;

email: any;   // <-- campo solto, sem @Column, nunca é preenchido pelo banco
```

`usuarioLogado.email` é sempre `undefined`, porque o campo que de fato vem do banco é `emailUsuario`. Isso explica o comentário deixado no próprio guard: *"Tem um erro que diz que email não pertence a usuario? como assim"*. Qualquer código que dependa de `request.user.email` (ou de `isVerified`) vai se comportar de forma errada silenciosamente, sem lançar exceção.

**Correção**:
```ts
request.user = {
  idUsuario: usuarioLogado.idUsuario,
  email: usuarioLogado.emailUsuario,
  name: usuarioLogado.nomeUsuario,
  role: '',
  permissions: '',
  isVerified: !!usuarioLogado.emailUsuario,
};
```

### 5.6 Cookie malformado (caso você reative o fluxo de cookie)

```ts
private getCookieAccessToken(token: string, expiresInSeconds: number): string {
  return `Authentication=${token}; HttpOnly: true, Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax; Secure`;
}
```

O formato correto de atributos de cookie usa `;` entre atributos e não usa `: true,` depois de `HttpOnly`:
```ts
return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax; Secure`;
```
Hoje esse cookie não é usado em nenhum lugar (o controller usa só `accessToken` no corpo), mas é o exato erro que o comentário no topo de `auth.controllers.ts` já antecipa:
> *"O Access Token não é um cookie... seria rejeitado/ignorado pelo navegador."*

### 5.7 `ProtectedRoute` existe mas não protege nada

`Router.tsx` importa `ProtectedRoute`, mas todas as rotas (incluindo `/sistema/usuario/listar`, `/sistema/cidade/criar`, etc.) estão registradas **sem** ele:
```tsx
{
  path: ROTA.USUARIO.LISTAR,
  element: <ListarUsuario />,   // sem ProtectedRoute
},
```
O exemplo de uso correto está comentado no fim do arquivo:
```tsx
/*
<Route
  path={ROTA.USUARIO.LISTAR}
  element={<ProtectedRoute><ListarUsuario /></ProtectedRoute>}
/>
*/
```
Hoje, qualquer pessoa pode acessar essas telas sem estar logada — o controle de acesso no front simplesmente não está ligado.

**Correção** — envolver cada rota privada:
```tsx
{
  path: ROTA.USUARIO.LISTAR,
  element: <ProtectedRoute><ListarUsuario /></ProtectedRoute>,
},
```

### 5.8 Botão "Entrar com Google" aponta para rota errada

`Login.tsx`:
```ts
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:8000/authgoogle"
};
```
`auth.controllers.ts`:
```ts
@UseGuards(AuthGuard('google'))
@Get('google')
async googleAuth() {}
```
A rota real é `/auth/google` (prefixo `auth` do `@Controller('auth')` + `google` do `@Get('google')`), não `/authgoogle`.

---

## 6. Checklist de correção mínima para o login funcionar hoje

Se o objetivo é só destravar o login local (sem Google, sem rotas protegidas ainda), você precisa de apenas três ajustes:

1. `.env` do backend com `PORT=8000` (ou ajuste `BASE_URL` no front para a porta real).
2. Confirmar que existe um usuário cadastrado no banco com senha já em hash (criado via `POST /usuario/criar`, nunca inserido manualmente em texto puro).
3. Apagar/renomear a entidade órfã `usuario/entity/usuario.entity.ts` se a aplicação não estiver subindo.

Se a prova também cobrar **rotas protegidas**, aí entram as correções das seções 5.3, 5.4 e 5.5.

---

## 7. Debugging — como ler os logs que já existem no código

O projeto já tem `console.log('[DEBUG]...')` em pontos estratégicos. Ao testar o login, acompanhe o terminal do `npm run start:dev` na ordem:

```
[DEBUG][LocalStrategy] validate start { emailUsuario }
[DEBUG][AuthService] getAuthenticatedUser start { email }
[DEBUG][AuthService] user found { idUsuario, emailUsuario }
[DEBUG][AuthService] password verification { emailUsuario, matching }
[DEBUG][LocalStrategy] validate success { idUsuario, emailUsuario }
[DEBUG][AuthController] login start { emailUsuario, idUsuario }
[DEBUG][AuthService] getJwtAccessToken start { ... }
[DEBUG][AuthService] getJwtAccessToken result { accessToken, expireInAccessToken }
[DEBUG][AuthController] login token generated { accessToken, expiresIn }
```

Se a sequência **para** em algum ponto, o problema está logo depois daquele log:
- Parou em "validate start" e nunca chegou em "getAuthenticatedUser start" → a requisição não está chegando no backend (porta errada, CORS, ou o front não está enviando `emailUsuario`/`senhaUsuario` com esses nomes exatos).
- Parou em "user found" e nunca chegou em "password verification" → `findByEmail` lançou 404 (usuário não existe com aquele e-mail).
- Chegou em "password verification" com `matching: false` → senha errada, ou o usuário foi inserido no banco sem hash bcrypt.

---

## 8. Pontos-chave para a prova (resumo de conceitos)

- **Passport Local Strategy**: estratégia que lê credenciais do corpo da requisição (`validate(usernameField, passwordField)`) e decide quem é `req.user`. Configurada via `usernameField`/`passwordField` no `super()` quando os nomes não são `username`/`password`.
- **Guard vs Strategy**: a Strategy define *como* validar; o Guard (`@UseGuards(...)`) é o que dispara essa validação antes do método do controller rodar. `LocalAuthGuard extends AuthGuard('local')` conecta o guard à strategy pelo nome `'local'`.
- **JWT**: token assinado (não criptografado) contendo um payload (`{ idUsuario }`), uma assinatura e prazo de expiração. Qualquer um pode *ler* o conteúdo de um JWT (é só base64), mas não pode *forjar* um válido sem o secret.
- **bcrypt**: hash de via única, com salt embutido. `bcrypt.compare(senhaDigitada, hashSalvo)` é a única forma correta de verificar senha — nunca se reverte o hash.
- **Onde o token mora**: este projeto guarda o token no corpo da resposta + `localStorage` no front. Isso é diferente de um fluxo baseado em cookie `HttpOnly` (que protegeria contra XSS, mas exige CSRF protection). O guard de rotas protegidas (`JwtAccessTokenGuard`) foi escrito esperando cookie, o que é a causa do bug da seção 5.4 — é um ponto clássico de prova: "o front usa um mecanismo de sessão, o back espera outro".
- **`@UseGuards` em cascata**: um controller pode ter vários guards; eles rodam em ordem e qualquer um pode interromper a cadeia lançando exceção.

---

## 9. Resumo de 2 linhas para decorar

- Login = Passport Local (`LocalStrategy` + `LocalAuthGuard`) → `AuthService.getAuthenticatedUser` (bcrypt.compare) → `JsonWebTokenService.createAccessToken` (JWT) → front grava `accessToken` + `usuario` no `localStorage` e dispara `auth-change`.
- Para destravar localmente: confira a porta no `.env` (`PORT` vs `BASE_URL`), confirme que o usuário existe com senha em hash, e — se for testar rota protegida — saiba que o guard hoje lê cookie, não o header `Authorization` que o front deveria (mas ainda não) enviar.
