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