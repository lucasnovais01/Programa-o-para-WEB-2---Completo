PROVA 15 de Junho, APRENDER COMO FAZER:

REGISTRO
ALTERAR SENHA
RECUPERAR SENHA
LOGIN
2FA
VALIDAR EMAIL

O Trabalho é a PAGINAÇÃO e o HATEOS, são dois trabalhos separados.

Cliente Dominio: http://

PAGINACAO = 2

HATEOAS = 2



Sobre o heteaos, se o hateoas não retornar o link,
O Hateoas é pra isto
O recurso é pra isto, e os link que vão no objeto, e os link que vão no objeto

Quero que minha API, emc



Sobre a autenticação precisa ter o JWT (JSON WEB TOKEN)










Trabalho - Avaliação Final
O desenvolvimento deste trabalho tem como objetivo implementar um fluxo completo de autenticação de usuários em um portal web, contemplando desde o cadastro inicial até a recuperação e alteração de senha. A solução será composta por um backend utilizando NestJS e um frontend em React, garantindo a integração entre as camadas e a segurança das informações do usuário.

A primeira etapa consiste na criação do módulo de registro no backend utilizando NestJS. Será necessário estruturar o módulo de autenticação, incluindo controller, service e repository (ou ORM), além da definição da entidade de usuário com campos como nome, e-mail, senha e status de validação. A senha deverá ser armazenada de forma segura utilizando hash (por exemplo, bcrypt). Também será necessário implementar validações de dados e tratamento de erros.

Paralelamente, deve-se desenvolver a interface de cadastro no frontend com React. Essa tela deve conter um formulário para entrada de dados do usuário, com validação de campos (como formato de e-mail e confirmação de senha), além da integração com a API do backend para envio das informações. Feedback visual para sucesso ou erro no cadastro também deve ser implementado.

A segunda etapa envolve a implementação do envio de e-mail para validação do registro. Após o cadastro, o sistema deve gerar um token único de verificação e enviá-lo para o e-mail do usuário. Será necessário configurar um serviço de envio de e-mails (como SMTP ou serviços externos) no backend. O link enviado deve permitir que o usuário valide sua conta, alterando seu status para ativo no sistema.

A terceira etapa consiste na funcionalidade de recuperação de senha. O usuário deverá poder solicitar a redefinição de senha informando seu e-mail. O sistema então deve gerar um token temporário e enviá-lo por e-mail com um link para redefinição. No frontend, será necessário criar telas para solicitação de recuperação e para inserção da nova senha.

Por fim, deve-se implementar a funcionalidade de alteração de senha, garantindo que o token seja validado e que a nova senha seja armazenada de forma segura. Também é importante invalidar tokens após o uso e definir prazos de expiração para maior segurança.

Além dessas funcionalidades principais, é necessário considerar aspectos como segurança (proteção de rotas, criptografia de dados sensíveis), tratamento de exceções, logs, testes básicos das funcionalidades e organização do código seguindo boas práticas.

Com isso, o sistema será capaz de oferecer um fluxo completo de gerenciamento de usuários, garantindo uma experiência segura e eficiente desde o registro até a recuperação de acesso.


Primeira Atividade - Criar Registro de UsuárioTarefa
Desenvolva um sistema completo de registro de usuários utilizando tecnologias modernas de back-end e front-end.

No back-end, utilize o NestJS para estruturar a aplicação. Você deverá criar:

Um módulo de registro (module) responsável por organizar os componentes da funcionalidade;
Um service, onde ficará toda a lógica de negócio (criação de usuários, validações, etc.);
Um controller, responsável por expor os endpoints da API (como cadastro e consulta de usuários).
No front-end, utilize React JS para desenvolver as páginas da aplicação. Crie interfaces que permitam:

O cadastro de usuários;
A visualização dos dados cadastrados;
A interação com a API desenvolvida no NestJS.
Implemente validação de campos tanto no front-end quanto no back-end. Garanta que dados obrigatórios sejam preenchidos corretamente, como:

Nome (não vazio);
Email (formato válido);
Senha (com critérios mínimos de segurança).
Além disso, projete e crie o banco de dados utilizando MySQL. Você deverá:

Definir as tabelas necessárias (por exemplo, tabela de usuários);
Criar os scripts SQL para a estrutura do banco;
Garantir que os dados estejam normalizados e consistentes.
Por fim, integre todas as camadas (React + NestJS + MySQL), garantindo o funcionamento completo do fluxo de registro de usuários.

Campos: 
firstName, lastName, username, email, password, confirmPassword para o formulário
para a tabela de usuário 
idUsuario, firstName, lastName, username, email, password, 



Segunda Atividade: Criar elementos de segurança de sistemaTarefa
Expandir o sistema de registro desenvolvido na Atividade 01, implementando o fluxo completo de controle de acesso. O foco desta etapa é a segurança da informação, persistência de estados de autenticação e comunicação via e-mail.

1. Back-end (NestJS)
Nesta fase, o servidor deve deixar de apenas "armazenar" dados e passar a "proteger" recursos. Você deverá implementar:

Autenticação com JWT: Configurar o Passport e JWT (JSON Web Token) para gerenciar sessões sem estado.

Módulo de Segurança:

Implementar o Login, que valida as credenciais (e-mail/senha) e retorna um token de acesso.

Uso de Hash de Senha: Garantir que nenhuma senha seja salva em texto plano (utilize bcrypt ou argon2).

Serviço de E-mail (Nodemailer): Configurar um serviço para envio de mensagem.

Fluxo de Verificação e Recuperação:

Confirmação de E-mail: Após o registro (da Atividade 01), o status do usuário deve ser pendente. Um token deve ser enviado por e-mail para ativar a conta.

Recuperação de Senha: Gerar tokens temporários com tempo de expiração (TTL) para permitir a troca de senha esquecida.

Proteção de Rotas: Criar Guards para proteger os endpoints, garantindo que apenas usuários autenticados e com e-mail validado acessem certas informações.

2. Front-end (React JS)
A interface deve ser atualizada para lidar com os novos fluxos de navegação e proteção de rotas:

Tela de Login: Formulário com validação de campos e armazenamento seguro do Token JWT (ex: localStorage ou Cookies).

Gestão de Estado Global: Implementar um Contexto de Autenticação (AuthContext) para gerenciar se o usuário está logado em toda a aplicação.

Rotas Privadas: Configurar o React Router para impedir que usuários não autenticados acessem a página de visualização de dados.

Fluxo de Recuperação: * Página de "Esqueci minha senha" (solicitação).

Página de "Redefinir senha" (entrada da nova senha via token enviado por e-mail).

Feedback ao Usuário: Implementar notificações (Toasts) para erros de login, tokens expirados ou sucesso na alteração de dados.

3. Banco de Dados (MySQL)
A tabela usuario definida na Atividade 01 precisará de novos campos para suportar as regras de negócio:

status_validacao: (Booleano ou Enum) para indicar se o e-mail foi confirmado.

recovery_token: Para armazenar temporariamente o hash do token de recuperação.

token_expires: Data/hora de expiração do token gerado.

Requisitos de Entrega e Critérios de Avaliação
Segurança: As senhas devem estar criptografadas no banco. O acesso direto às rotas de dados via URL deve ser bloqueado sem o Token.

UX (Experiência do Usuário): O sistema deve informar claramente se o login falhou por senha incorreta ou usuário inexistente.

Código Limpo: Organização em módulos, uso de DTOs (Data Transfer Objects) para validação no NestJS e componentes reutilizáveis no React.

Integração: O fluxo completo deve funcionar: Login -> Recebimento de Token -> Acesso à Rota Protegida.