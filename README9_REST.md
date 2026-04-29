Para estudar

REST: A Base da Web

REST, ou Transferência de Estado Representacional, é um jeito de criar sistemas online. Ele tem umas regras para deixar tudo funcionando bem, principalmente serviços da web. Roy Fielding criou essa ideia em 2000. REST não é bem uma tecnologia, mas sim um jeito de fazer sites e apps que aguentam o tranco, são fáceis de mexer e não dão dor de cabeça para consertar.

A parada do REST é pensar em tudo como um recurso. Cada recurso tem um endereço único, tipo um link. E a gente mexe nesses recursos usando representações, que podem ser em formatos como JSON ou XML.

Pra um sistema ser RESTful de verdade, ele tem que seguir seis ideias chave:

Separar Cliente e Servidor: Cada um faz sua parte. O cliente mostra as coisas pro usuário, e o servidor guarda e mexe nos dados. Assim, dá pra mudar um sem estragar o outro.

Sem guardar informações: Cada vez que o cliente pede algo, ele manda tudo que o servidor precisa saber. O servidor não fica lembrando de nada entre um pedido e outro. Isso ajuda o servidor a ser mais simples e aguentar mais gente.

Guardar no Cache: O servidor fala se o cliente pode guardar as respostas ou não. Usar o cache ajuda a deixar tudo mais rápido, gasta menos internet e melhora o sistema todo.

Falar a mesma língua: Essa é uma das partes mais importantes. Tem quatro regras aqui:

    *   Cada recurso tem seu endereço único (URI).

    *   O cliente não mexe direto no recurso, mas sim numa cópia dele.

    *   As mensagens entre o cliente e o servidor se explicam sozinhas, pra ninguém se perder.

    *   O servidor manda links pras próximas coisas que o cliente pode fazer, tipo um guia.

Organização em Camadas:  O sistema pode ter várias camadas (como servidores extras) trabalhando juntas. O cliente nem precisa saber qual camada tá usando.

Código Extra (Se precisar):  Em alguns casos, o servidor pode mandar um código pro cliente pra fazer algo a mais. Mas isso não é obrigatório.

Na prática, uma API RESTful é como uma porta de entrada pra um programa, seguindo essas ideias. Ela usa os métodos do HTTP pra mexer nos recursos:

GET: Pega uma cópia do recurso.

POST: Cria um recurso novo.

PUT: Muda um recurso inteiro.

DELETE: Apaga um recurso.

PATCH: Muda só uma parte do recurso.

REST virou o jeito mais usado pra fazer APIs porque é simples, flexível e usa o que já existe na web. É essencial pra comunicação entre pequenos serviços, sites e apps de celular.