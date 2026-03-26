import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CIDADE } from "../../services/cidade/constants/cidade.constants";
import { ROTA } from "../../services/router/url";
import type { Cidade } from "../../type/cidade";

import PaginationFooter from "../../components/pagination/PaginationFooter";
import {
  apiGetCidades
} from "../../services/cidade/api/api.cidade";


import type { SearchParam } from '../../services/cidade/api/api.cidade';

import SearchBar from '../../components/search/SearchBar';

// const buscarTodasCidades = async (): Promise<Cidade[] | null> => {


export default function ListarCidade() {
  // useState = hook - gancho - função
  // reagir as alterações na variável
  // renderiza -
  const [models, setModels] = useState<Cidade[] | null>(null);

  /*
  const [models, setModels] = useState<Cidade[] | null>(null);
  */

  // estados da paginação:
  // page = currentPage
  const [currentPage, setCurrentPage] = useState<number>(1);
  // pageSize = recordPerPage
  const [recordPerPage, setRecordPerPage] = useState<number>(5);
  //
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  //
  // props
  const [props, setProps] = useState<string>('');
  const [order, setOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  /*
  const [props, setProps] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const [props, setProps] = useState<String | null>(null);
  const [order, setOrder] = useState<String | null>(null);
  const [search, setSearch] = useState<String | null>(null);
  */
  //hook - função - reagir, quando carregar a página
  //pela primeira vez, quando o array for vázio.

  // algum argumento - ele monitora

  const buscarTodasCidades =
    async (params: SearchParam): Promise<Cidade[] | null> => {

    try {
      const response = await apiGetCidades(params);
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
    return [];
  };

///////////////////

  useEffect(() => {
    async function getCidades() {
      const params = {
        page: currentPage,
        pageSize: recordPerPage,
        props: props,
        order: order,
        searchTerm: searchTerm === '' ? null: searchTerm,
      };

      const data = await buscarTodasCidades(params); // no modelo do professor tem params dentro do parenteses

      if (data) {
        const { content, page, pageSize, totalElements, totalPages} =
          data.dados;

        // tirado o data.dados; e deixado só data;

        setModels(content);
        setCurrentPage(page);
        setPageSize(pageSize);
        setTotalElements(totalElements);
        setTotalPages(totalPages);
      }
    }
    getCidades();
  }, [currentPage, recordPerPage, searchTerm]);


  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(Number(pageNumber));
  };

  const handleRecordsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setRecordPerPage(Number(e.target.value));
    setCurrentPage(1);
  };



  const Pagination = ({
    currentPage,
    totalPages,
  });


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
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setRecordPerPage={recordPerPage}
          handleRecordsPerPageChange={handleRecordsPerPageChange}
        />
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
