import { useState } from "react";

export default function Lista() {

  // useState = hook, gancho de estado. Nada mais é que uma função.
  // Que reage a funções na variavel, ou seja, ele renderiza a tela novamente

  // toda vez que a variavel for alterada.
  // useState retorna um array com dois elementos.
  // O primeiro elemento é o valor da variavel.
  // O segundo elemento é uma função que altera o valor da variavel.
  // Sempre que a função for chamada, o componente é renderizado novamente.

  //const [nome, setNome] = useState<string>("");

  //const [cidades, setCidades] = useState<string[]>([]);

  //
  const [cidades, setCidades] = useState(); //sempre dois parametros, o primeiro é o valor, o segundo atribui o valor
}