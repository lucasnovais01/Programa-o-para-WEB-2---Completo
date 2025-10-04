import axios from "axios";
import { useEffect, useState } from "react";

export default function Lista() {
  // useState = hook, gancho de estado. Nada mais é que uma função.
  // Que reage a funções na variavel, ou seja, ele renderiza a tela novamente
  // Sempre que a função for chamada, o componente é renderizado novamente.
  //
  const [cidades, setCidades] = useState(); //sempre dois parametros, o primeiro é o valor, o segundo atribui o valor

  // useEffect = hook, gancho de efeito colateral. Vai reagir ao carregar a página pela primeira vez.
  useEffect(()=>{
    async function getCidades() {
      await axios
        .get('http://localhost:8000/rest/sistema/cidade/listar')
        .then((response: any) => {
          setCidades(response.data.dados);
        });
    }
    getCidades();
  },[]);

  console.log(cidades);

  return <div className="display">
    <div className="card animated fadeInDown ">
      <div style={{
        display: 'flex',
        justifyContent: 'spacebetween',
        alignItems: 'center',
      }}>
        <h1>Lista de Cidades</h1>
        <a href='#' className="btn-add">Novo</a>
      </div>
    </div>
  
  </div>
}