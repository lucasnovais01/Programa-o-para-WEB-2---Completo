import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CIDADE } from "../../services/cidade/constants/cidade.constants";

import { ROTA } from "../../services/router/url";
import type { Cidade } from "../../type/cidade";

import PaginationFooter from "../../components/pagination/PaginationFooter";
import {
  apiGetCidades,
  type SearchParam,
} from "../../services/cidade/api/api.cidade";

const buscarTodasCidades = async (): Promise<Cidade[] | null> => {
  const params: SearchParam = {
    // ← adicione isso (tipo que você já exportou)
    page: 0, // ou 1, dependendo do seu backend
    pageSize: 999, // grande pra pegar tudo (ou o que fizer sentido)
    // props, order, search: opcional, pode deixar undefined ou omitir
  };

  try {
    const response = await apiGetCidades(params);
    return response.data.dados;
  } catch (error: any) {
    console.log(error);
  }
  return null;
};

export default function ListarCidade() {
  // useState = hook - gancho - função
  // reagir as alterações na variável
  // renderiza -
  const [models, setModels] = useState<Cidade[] | null>(null);
  // estados da paginação:
  // page = currentPage
  const [currentPage, setCurrentPage] = useState<number>(1);
  // pageSize = recordPerPage
  const [recordPerPage, setRecordPage] = useState<number>(5);
  //
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState(100);

  //

  // props
  const [props, setProps] = useState<String | null>(null);
  const [order, setOrder] = useState<String | null>(null);
  const [search, setSearch] = useState<String | null>(null);

  //hook - função - reagir, quando carregar a página
  //pela primeira vez, quando o array for vázio.
  useEffect(() => {
    async function getCidades() {
      const params = {
        currentPage,
        recordPerPage,
        props,
        order,
        search,
      };

      const cidades = await buscarTodasCidades();
      if (cidades) {
        setModels(cidades);
      }
    }
    getCidades();
  }, []);

  //
  //

  const handlePageChange = () => {};

  //
  //
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
          <h2>{CIDADE.TITULO.LISTA}</h2>
          <Link to="/sistema/cidade/criar" className="btn btn-add">
            <span className="btn-icon">
              <i>
                <FaPlus />
              </i>
            </span>
            Novo
          </Link>
        </div>
        <br />
        <table>
          <thead>
            <tr>
              <th>{CIDADE.LABEL.CODIGO}</th>
              <th>{CIDADE.LABEL.NOME}</th>
              <th className="center actions" colSpan={3}>
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {models?.map((model) => (
              <tr key={model.idCidade}>
                <td>{model.codCidade}</td>
                <td>{model.nomeCidade}</td>
                <td className="center actions">
                  <Link
                    to={`${ROTA.CIDADE.ATUALIZAR}/${model.idCidade}`}
                    className="btn btn-edit"
                  >
                    <span className="btn-icon">
                      <i>
                        <BsPencilSquare />
                      </i>
                    </span>
                    Atualizar
                  </Link>
                  <Link
                    to={`${ROTA.CIDADE.EXCLUIR}/${model.idCidade}`}
                    className="btn btn-delete"
                  >
                    <span className="btn-icon">
                      <i>
                        <FaRegTrashAlt />
                      </i>
                    </span>
                    Excluir
                  </Link>
                  <Link
                    to={`${ROTA.CIDADE.POR_ID}/${model.idCidade}`}
                    className="btn btn-info"
                  >
                    <span className="btn-icon">
                      <i>
                        <FaMagnifyingGlass />
                      </i>
                    </span>
                    Consulta
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {models && (
          <PaginationFooter
            currentPage={currentPage}
            pageSize={pageSize}
            totalElements={models.length}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
