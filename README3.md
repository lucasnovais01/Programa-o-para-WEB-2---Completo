Suas Dúvidas
1. É normal ter apenas um controller e um service?
Sim, é completamente normal!

A funcionalidade de "alterar senha" é simples e direta - não precisa de múltiplos controllers ou services como outras partes do sistema. Você precisa de:

1 Controller - para receber a requisição HTTP
1 Service - para a lógica de negócio (validar senha atual, criptografar nova senha, salvar no banco)
DTOs - para definir os dados que entram e saem
Isso é bem diferente do módulo de usuário que tem várias operações (criar, listar, buscar um, atualizar, excluir).

2. O que é bcrypt e onde usar?
Bcrypt é uma biblioteca de segurança que transforma senhas em "hash" (uma string乱码 que não pode ser revertida).

Por que usar? Se alguém roubar o banco de dados, não vai conseguir ver as senhas dos usuários.

Onde usar:

No Registro (Tarefa 1) - Quando o usuário se cadastra, a senha deve ser criptografada ANTES de salvar no banco
Na Alterar Senha (Tarefa 2) - Quando o usuário muda a senha, você:
Verifica a senha atual (compara o hash)
Criptografa a nova senha
Salva no banco


## VERIFICAR SE O BCRYPT está instaldo no projeto (verificar dependencia)

npm list bcrypt 2>&1