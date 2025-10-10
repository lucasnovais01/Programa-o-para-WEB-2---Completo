import axios from "axios";
import { useEffect, useState } from "react";
import type { Cidade } from "../../type/cidade";

export default function ListarCidade() {
  // useState = hook - gancho - função
  // reagir as alterações na variável
  // renderiza -
  const [cidades, setCidades] = useState<Cidade[] | null>(null);

  //hook - função - reagir, quando carregar a página
  //pela primeira vez, quando o array for vázio.
  useEffect(() => {
    async function getCidades() {
      await axios
        .get("http://localhost:8000/rest/sistema/cidade/listar")
        .then((response: any) => {
          setCidades(response.data.dados);
        });
    }
    getCidades();
  }, []);

  console.log(cidades);

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Lista de Cidades</h1>
          <a href="#" className="btn-add">
            Novo
          </a>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nome</th>
              <th className="center actions">Atualizar</th>
              <th className="center actions">Excluir</th>
              <th className="center actions">Show</th>
            </tr>
          </thead>
          
          <tbody>
            {cidades?.map((cidade) => (
              <tr>
                <td>{cidade.idCidade}</td>
                <td>{cidade.codCidade}</td>
                <td>{cidade.nomeCidade}</td>
                <td className="center actions">
                  <a className="btn-edit">Atualizar</a>
                </td>
                <td className="center actions">
                  <a className="btn-delete">Excluir</a>
                </td>
                <td className="center actions">
                  <a className="btn-show">Consulta</a>
                </td>
              </tr>
            ))}
          </tbody>
          
        
        </table>
      </div>
    </div>
  );
}

/*
export default function Lista() {
  // useState = hook, gancho de estado. Nada mais é que uma função.
  // Que reage a funções na variavel, ou seja, ele renderiza a tela novamente
  // Sempre que a função for chamada, o componente é renderizado novamente.
  //
  const [cidades, setCidades] = useState<any[]>([]); //sempre dois parametros, o primeiro é o valor, o segundo atribui o valor

  // useEffect = hook, gancho de efeito colateral. Vai reagir ao carregar a página pela primeira vez.
  useEffect(()=>{
    async function getCidades() {
      await axios //Para se comunicar
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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nome</th>

            <th className="center actions" colSpan={3}></th>

          </tr>
        </thead>
        <tbody>
          {cidades?.map ((cidade) => (
            <tr>
              <td>{cidade.idCidade}</td>
              <td>{cidade.codCidade}</td>
              <td>{cidade.nomeCidade}</td>
              
              <td className="center actions">
                <td><a className="btn-edit">Atualizar</a> </td>
                <td><a className="btn-edit">Editar</a></td>
                <td><a className="btn-delete">Excluir</a></td>
              </td>
            </tr>
            ))
          }
        </tbody>
        
      </table>
    </div>
  
  </div>
*/