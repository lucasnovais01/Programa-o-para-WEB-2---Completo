# TUTORIAL — Prova: Controle de Acesso

Objetivo: guia prático e direto para entender e testar o fluxo de autenticação/autorização deste projeto (NestJS backend + React frontend), focado na prova "Prova Controle de Acesso".

**Pré-requisitos rápidos**
- Node.js instalado (versão compatível com o projeto).
- Banco de dados configurado conforme `nest_academico` (usar configurações do projeto).
- Terminal para rodar backend e frontend.

**Arquitetura (resumo)**
- Backend: NestJS com Passport (strategy local) + JWT. Endpoints de login em:
  - [nest_academico/src/auth/controllers/auth.controllers.ts](nest_academico/src/auth/controllers/auth.controllers.ts)
  - LocalStrategy: [nest_academico/src/auth/config/strategy/local/local.strategy.ts](nest_academico/src/auth/config/strategy/local/local.strategy.ts)
  - Serviço de autenticação/JWT: [nest_academico/src/auth/service/auth.service.ts](nest_academico/src/auth/service/auth.service.ts)
  - Serviço de JWT helper: [nest_academico/src/auth/service/jwt.service.ts](nest_academico/src/auth/service/jwt.service.ts)
- Usuário (entidade & service):
  - Entidade: [nest_academico/src/usuario/entities/usuario.entity.ts](nest_academico/src/usuario/entities/usuario.entity.ts)
  - CRUD & validação (verificação de e-mail duplicado, hashing): [nest_academico/src/usuario/service/usuario.service.ts](nest_academico/src/usuario/service/usuario.service.ts)
- Frontend: React + Vite
  - Requisição de login: [react_academico/src/services/auth/api/api.auth.ts](react_academico/src/services/auth/api/api.auth.ts)
  - Hook de login: [react_academico/src/services/auth/hook/useLogin.tsx](react_academico/src/services/auth/hook/useLogin.tsx)
  - Hook de autenticação (estado global localStorage + eventos): [react_academico/src/services/auth/hook/useAuth.tsx](react_academico/src/services/auth/hook/useAuth.tsx)
  - Exibição do usuário logado: [react_academico/src/components/layout/Layout.tsx](react_academico/src/components/layout/Layout.tsx)

**Comandos para rodar localmente**
- Backend (nest_academico):

```bash
cd nest_academico
npm install
npm run start:dev
```

- Frontend (react_academico):

```bash
cd react_academico
npm install
npm run dev
```

Observação: ports padrão do projeto: backend geralmente roda em 5000, frontend em 3000. Verifique `REST_CONFIG` em [react_academico/src/services/constant/sistema.constants.ts](react_academico/src/services/constant/sistema.constants.ts) e `main.ts` do Nest para porta.

**Fluxo de Login (passo a passo)**
1. No frontend, formulário chama `apiLogin` em [react_academico/src/services/auth/api/api.auth.ts](react_academico/src/services/auth/api/api.auth.ts).
2. A API POST é `/auth/session/login` (controlador Nest). O `LocalAuthGuard` usa `LocalStrategy` para validar email/senha.
3. `LocalStrategy` delega para `AuthService.getAuthenticatedUser(email, senha)` que:
   - busca usuário por email em `UsuarioService.findByEmail`,
   - verifica senha com `bcrypt.compare`,
   - retorna o `Usuario` em caso de sucesso.
4. Se valido, `AuthController.login` gera `accessToken` via `AuthService.getJwtAccessToken` e retorna JSON com `accessToken` e objeto `usuario`.
5. Frontend grava `accessToken` e `usuario` no `localStorage` (chaves: `accessToken`, `usuario`) e dispara `window.dispatchEvent(new Event('auth-change'))`.
6. `useAuth` lê do `localStorage` e atualiza estado da aplicação, permitindo exibir o nome do usuário no layout.

**Como testar rapidamente (manual)**
- Criar um usuário (via tela de cadastro do frontend ou via API `usuario/criar`) com email e senha.
- Abrir DevTools → Network → submeter o login. Verificar resposta JSON contém `accessToken` e `usuario`.
- Verificar `localStorage` contém `accessToken` e `usuario`.
- Verificar na UI (sidebar/header) que o nome aparece.

**Debugging comum (checklist rápido)**
- 401/400 no login: verifique se senha foi gravada com hash (usuário criado deve ter senha hash). Veja `usuario.service.ts` para hashing.
- Nenhuma atualização do layout: verifique `localStorage` e evento `auth-change` (use `window.dispatchEvent(new Event('auth-change'))` após login).
- Erro CORS: verifique `main.ts` do Nest (origem permitida `http://localhost:3000`).
- Passport não disparando: confirme `AuthModule` importa `PassportModule` e `LocalStrategy` está registrado.

**Pontos-chave para a prova (conceitos e ligações ao código)**
- Passport Local Strategy: entender `validate(email, senha)` em [local.strategy.ts](nest_academico/src/auth/config/strategy/local/local.strategy.ts).
- JWT creation & expiration: ver `JsonWebTokenService.createAccessToken` em [jwt.service.ts](nest_academico/src/auth/service/jwt.service.ts).
- Onde o token fica: frontend guarda `accessToken` no `localStorage` e envia Authorization header em chamadas subsequentes (implemente um interceptor/axios config se necessário).
- Segurança: senhas são hasheadas com `bcrypt` em [usuario.service.ts](nest_academico/src/usuario/service/usuario.service.ts). Evitar armazenar senhas em texto.
- Checagem de unicidade de e-mail: `UsuarioService.create` valida e lança conflito (HTTP 409).

**Dicas práticas para a prova (respostas rápidas)**
- Se perguntarem onde a validação de senha acontece: `AuthService.verificarSenha` (usa `bcrypt.compare`).
- Se perguntarem sobre estratégia passport: `LocalStrategy` usa campos `emailUsuario` e `senhaUsuario` (atenção ao `usernameField`/`passwordField`).
- Se perguntarem onde mudar a rota de login: `AuthController` define `@Post('/session/login')`.
- Mostrar o fluxo: Frontend form → POST /auth/session/login → Passport local → AuthService → JWT → frontend armazena token.

**Resumo (2 linhas para decorar)**
- Login = Passport Local + AuthService (bcrypt) → JWT (JsonWebTokenService) → frontend guarda token + usuario em localStorage e aciona `auth-change`.
- Para testar: crie usuário → enviar POST /auth/session/login → verificar `accessToken` + `usuario` no response e `localStorage`.

Boa sorte na prova. Se quiser, eu adapto esse tutorial para um PDF, slides, ou uma versão de "cola" com 1 página imprimível.
