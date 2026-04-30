
## Segunda Atividade: Criar elementos de segurança de sistema

Expandir o sistema de registro desenvolvido na Atividade 01, implementando o fluxo completo de controle de acesso. O foco desta etapa é a segurança da informação, persistência de estados de autenticação e comunicação via e-mail.

## 1. Back-end (NestJS)
Nesta fase, o servidor deve deixar de apenas "armazenar" dados e passar a "proteger" recursos. Você deverá implementar:

Autenticação com JWT: Configurar o Passport e JWT (JSON Web Token) para gerenciar sessões sem estado.

## Módulo de Segurança:

Implementar o Login, que valida as credenciais (e-mail/senha) e retorna um token de acesso.

Uso de Hash de Senha: Garantir que nenhuma senha seja salva em texto plano (utilize bcrypt ou argon2).

Serviço de E-mail (Nodemailer): Configurar um serviço para envio de mensagem.

## Fluxo de Verificação e Recuperação:

## Confirmação de E-mail: 
Após o registro (da Atividade 01), o status do usuário deve ser pendente. Um token deve ser enviado por e-mail para ativar a conta.

## Recuperação de Senha: 
Gerar tokens temporários com tempo de expiração (TTL) para permitir a troca de senha esquecida.

## Proteção de Rotas: 
Criar Guards para proteger os endpoints, garantindo que apenas usuários autenticados e com e-mail validado acessem certas informações.

## 2. Front-end (React JS)
A interface deve ser atualizada para lidar com os novos fluxos de navegação e proteção de rotas:

## Tela de Login: 
Formulário com validação de campos e armazenamento seguro do Token JWT (ex: localStorage ou Cookies).

## Gestão de Estado Global: 
Implementar um Contexto de Autenticação (AuthContext) para gerenciar se o usuário está logado em toda a aplicação.

## Rotas Privadas: 
Configurar o React Router para impedir que usuários não autenticados acessem a página de visualização de dados.

## Fluxo de Recuperação: 
* Página de "Esqueci minha senha" (solicitação).

  Página de "Redefinir senha" (entrada da nova senha via token enviado por e-mail).

## Feedback ao Usuário: 
Implementar notificações (Toasts) para erros de login, tokens expirados ou sucesso na alteração de dados.

## 3. Banco de Dados (MySQL)

A tabela usuario definida na Atividade 01 precisará de novos campos para suportar as regras de negócio:

status_validacao: (Booleano ou Enum) para indicar se o e-mail foi confirmado.

recovery_token: Para armazenar temporariamente o hash do token de recuperação.

token_expires: Data/hora de expiração do token gerado.

Requisitos de Entrega e Critérios de Avaliação
Segurança: As senhas devem estar criptografadas no banco. O acesso direto às rotas de dados via URL deve ser bloqueado sem o Token.

UX (Experiência do Usuário): O sistema deve informar claramente se o login falhou por senha incorreta ou usuário inexistente.

Código Limpo: Organização em módulos, uso de DTOs (Data Transfer Objects) para validação no NestJS e componentes reutilizáveis no React.

Integração: O fluxo completo deve funcionar: Login -> Recebimento de Token -> Acesso à Rota Protegida.