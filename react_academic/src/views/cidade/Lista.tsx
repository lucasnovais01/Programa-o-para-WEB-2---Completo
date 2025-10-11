import axios from "axios";
import { useEffect, useState } from "react";
import type { Cidade } from "../../type/cidade";
import { Link } from "react-router-dom";


const buscarTodasCidades = async (): Promise<Cidade[] | null> => {

  try {
    const response = await axios.get("http://localhost:8000/rest/sistema/cidade/listar",
    );
    return response.data.dados;
  }
  catch (error:any) {
    console.log(error);
  }
  return null;
};


export default function ListarCidade() {
  // useState = hook - gancho - função
  // reagir as alterações na variável
  // renderiza -
  const [models, setModels] = useState<Cidade[] | null>(null);

  //hook - função - reagir, quando carregar a página
  //pela primeira vez, quando o array for vázio.
  useEffect(() => {
    async function getCidades() {
      const cidades = await buscarTodasCidades();
      if (cidades) {
        setModels(cidades);
      }
    }

    /*
      await axios
        .get("http://localhost:8000/rest/sistema/cidade/listar")
        .then((response: any) => {
          setCidades(response.data.dados);
        });
    }
    */

    getCidades();
  }, []); //array vázio, não vai reagir a nada

  console.log(models);

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
          <h2>Lista de Cidades</h2>
          {/* O LINK É UM COMPONENTE DO REACT, ele substitui o hreaf, le substitui a tag âncora, ele não tem REFRESH de página */}
          <Link to="#" className="btn btn-add">
            Novo
          </Link>
        </div>
        <br/>
        <table>
          <thead>
            <tr>
              {/* A ID DE UM OBJETO A GENTE NUNCA VAI MOSTRAR
              <th>ID</th> */}
              <th>Código</th>
              <th>Nome</th>
              <th className="center actions" colSpan={3}>Ação</th>

              {/*
              <th className="center actions">Excluir</th>
              <th className="center actions">Show</th>
              */}
            </tr>
          </thead>
          
          
          <tbody>
            {models?.map((model) => (
              <tr key={model.idCidade}>
                {/* A ID DE UM OBJETO A GENTE NUNCA VAI MOSTRAR
                <td>{model.idCidade}</td> */}
                <td>{model.codCidade}</td>
                <td>{model.nomeCidade}</td>
                <td className="center actions">
                  <Link to='' className="btn btn-edit">Atualizar</Link>
                  <Link to='' className="btn btn-delete">Excluir</Link>
                  <Link to='' className="btn btn-show">Consulta</Link>
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