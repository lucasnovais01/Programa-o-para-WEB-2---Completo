import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import PaginationFooter from '../../components/pagination/PaginationFooter';
import SearchBar from '../../components/search/SearchBar';

import { ROTA } from '../../services/router/url';
import type { SearchParams } from '../../services/usuario/api/api.usuario';
import { apiGetUsuarios } from '../../services/usuario/api/api.usuario';
import { USUARIO } from '../../services/usuario/constants/usuario.constants';
import type { PaginatedResponse, Usuario } from '../../services/usuario/type/Usuario';

export default function ListarUsuario() {
  // useState = hook - gancho - função
  // reagir as alterações na variável
  // renderiza -
  const [models, setModels] = useState<Usuario[]>([]);
  // estados da paginação;
  // page = currentPage
  const [currentPage, setCurrentPage] = useState<number>(1);
  // pageSize = recordPerPages
  const [recordPerPages, setRecordPerPages] = useState<number>(5);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // props
  const [props, setProps] = useState<string>('ID_USUARIO');
  const [order, setOrder] = useState<string>('ASC');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const buscarTodosUsuarios = useCallback(
    async (params: SearchParams): Promise<PaginatedResponse<Usuario> | null> => {
      try {
        const response = await apiGetUsuarios(params);
        // response é do tipo PaginatedResponse<Usuario>, contém dados.dados
        return response;
      } catch (error: any) {
        console.log(error);
      }
      return null;
    },
    [],
  );

  //hook - função - reagir, quando carregar a página
  //pela primeira vez, quando o array for vázio.
  // algum argumento - ele monitora
  useEffect(() => {
    async function getUsuarios() {
      const params = {
        page: currentPage,
        pageSize: pageSize,
        props: props,
        order: order,
        searchTerm: searchTerm === '' ? null : searchTerm,
      };
const data = await buscarTodosUsuarios(params);
      console.log(data);
      if (data) {
        // data.dados contém: content, page, pageSize, totalElements, totalPages
        const { content, page, pageSize, totalElements, totalPages } =
          data.dados;
        setModels(content);
        setCurrentPage(page);
        setPageSize(pageSize);
        setTotalElements(totalElements);
        setTotalPages(totalPages);
      }
    }
    getUsuarios();
  }, [currentPage, pageSize, searchTerm, order, props]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(Number(pageNumber));
  };

  const handleRecordsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setRecordPerPages(Number(e.target.value));
    setCurrentPage(1);
  };

  const onSortProps = (e: MouseEvent<HTMLButtonElement>, props: string) => {
    e.preventDefault();
    const dir = order && order === 'ASC' ? 'DESC' : 'ASC';
    setProps(props);
    setOrder(dir);
  };

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2>{USUARIO.TITULO.LISTA}</h2>
          <Link to="/sistema/usuario/criar" className="btn btn-add">
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
          recordsPerPage={recordPerPages}
          handleRecordsPerPageChange={handleRecordsPerPageChange}
        />
        <br />
        <table>
          <thead>
            <tr>
              <th>
                <button onClick={(e) => onSortProps(e, 'ID_USUARIO')}>
                  {USUARIO.LABEL.ID}
                </button>
              </th>

              <th>
                <button onClick={(e) => onSortProps(e, 'NOME_USUARIO')}>
                  {USUARIO.LABEL.NOME}
                </button>
              </th>

              <th>
                <button onClick={(e) => onSortProps(e, 'SOBRENOME_USUARIO')}>
                  {USUARIO.LABEL.SOBRENOME}
                </button>
              </th>

              <th>
                <button onClick={(e) => onSortProps(e, 'EMAIL_USUARIO')}>
                  {USUARIO.LABEL.EMAIL}
                </button>
              </th>

              <th className="center actions" colSpan={3}>
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {models?.map((model) => (
              <tr key={model.idUsuario}>
                <td>{model.idUsuario}</td>
                <td>{model.nomeUsuario}</td>
                <td>{model.sobrenomeUsuario}</td>
                <td>{model.emailUsuario}</td>
                <td className="center actions">
                  <Link
                    to={`${ROTA.USUARIO.ATUALIZAR}/${model.idUsuario}`}
                    className="btn btn-edit"
                  >
                    <span className="btn-icon">
                      <i>
                        <BsPencilSquare />
                      </i>
                    </span>
                  </Link>
                  <Link
                    to={`${ROTA.USUARIO.EXCLUIR}/${model.idUsuario}`}
                    className="btn btn-delete"
                  >
                    <span className="btn-icon">
                      <i>
                        <FaRegTrashAlt />
                      </i>
                    </span>
                  </Link>
                  <Link
                    to={`${ROTA.USUARIO.POR_ID}/${model.idUsuario}`}
                    className="btn btn-info"
                  >
                    <span className="btn-icon">
                      <i>
                        <FaMagnifyingGlass />
                      </i>
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PaginationFooter
          currentPage={currentPage}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
