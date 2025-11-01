import axios from "axios";
import { useEffect, useState } from "react";
import type { Cidade } from "../../type/cidade";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { CIDADE } from "../../services/cidade/constants/cidade.constants";
import { apiGetCidades } from "../../services/cidade/api/api.cidade";
import { ROTA } from "../../services/router/url";

const buscarTodasCidades = async (): Promise<Cidade[] | null> => {

  try {
    const response = await apiGetCidades();
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

{/* aqui iremos chamar o arquivo cidade.constant.ts, utilizando {cidade.titulo.lista} por exemplo
E colocaremos no lugar dos titulos antigos <h2>Lista de cidade</h2> agora é <h2>{cidade.titulo.lista}</h2> */}

          <h2>{CIDADE.TITULO.LISTA}</h2>
          {/* O LINK É UM COMPONENTE DO REACT, ele substitui o hreaf, le substitui a tag âncora, ele não tem REFRESH de página */}
          <Link to="/sistema/cidade/criar" className="btn btn-add">
            <span className="btn-icon">
              <i className="fa fa plus">
                <FaPlus/>
              </i>
            </span>
            Novo
          </Link>
        </div>
        <br/>
        <table>
          <thead>
            <tr>
              {/* A ID DE UM OBJETO A GENTE NUNCA VAI MOSTRAR
              <th>ID</th> */}
              <th>{CIDADE.LABEL.CODIGO}</th>
              <th>{CIDADE.LABEL.NOME}</th>
              <th className="center actions" colSpan={3}>Ação</th>

              {/*
              <th className="center actions">Excluir</th>
              <th className="center actions">Show</th>
              */}
            </tr>
          </thead>
          
          {/* ACTIONS */}
          <tbody>
            {models?.map((model) => (
              <tr key={model.idCidade}>
                {/* A ID DE UM OBJETO A GENTE NUNCA VAI MOSTRAR
                <td>{model.idCidade}</td> */}
                <td>{model.codCidade}</td>
                <td>{model.nomeCidade}</td>
                <td className="center actions">

                  <Link to={`${ROTA.CIDADE.ATUALIZAR}/${model.idCidade}`} className="btn btn-edit">
                    <span className="btn-icon">
                      <i className="fa fa square">
                        <BsPencilSquare/>
                      </i>
                    </span>
                    Atualizar
                  </Link>

                  <Link to={`${ROTA.CIDADE.EXCLUIR}/${model.idCidade}`} className="btn btn-delete">
                    <span className="btn-icon">
                      <i className="fa fa trash">
                        <BsFillTrash3Fill/>
                      </i>
                    </span>
                    Excluir
                  </Link>

                  <Link to={`${ROTA.CIDADE.POR_ID}/${model.idCidade}`} className="btn btn-show">
                    <span className="btn-icon">
                      <i className="fa fa eye">
                        <BsEye/>
                      </i>
                    </span>
                    Consulta
                  </Link>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
