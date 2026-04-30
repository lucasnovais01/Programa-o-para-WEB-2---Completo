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
import { apiGetUsuarios } from '../../services/usuario/api/api.usuario';
import { USUARIO } from '../../services/usuario/constants/usuario.constants';
import type { PaginatedResponse, Usuario } from '../../services/usuario/type/Usuario';

// ✅ importa o hook do ResourcesProviders
import { useResources } from '../../services/providers/ResourcesProviders';

export default function ListarUsuario() {
  const [models, setModels] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordPerPages, setRecordPerPages] = useState<number>(5);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [props, setProps] = useState<string>('ID_USUARIO');
  const [order, setOrder] = useState<string>('ASC');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ✅ pega o getEndpoint do contexto — fornece a URL real do backend
  const { getEndpoint } = useResources();

  const buscarTodosUsuarios = useCallback(
    async (url: string): Promise<PaginatedResponse<Usuario> | null> => {
      try {
        const params = {
          page: currentPage,
          pageSize: pageSize,
          props: props,
          order: order,
          searchTerm: searchTerm === '' ? null : searchTerm,
        };
        const response = await apiGetUsuarios(url, params); // ✅ passa url
        return response;
      } catch (error: any) {
        console.log(error);
      }
      return null;
    },
    [currentPage, pageSize, props, order, searchTerm],
  );

  useEffect(() => {
    async function getUsuarios() {
      // ✅ pega a URL do backend via resources — 'usuario' sem id = listar
      const url = getEndpoint('usuario');

      if (!url) {
        // resources ainda está carregando — aguarda próximo ciclo
        console.warn('recurso inexistente: getEndpoint ainda não retornou URL');
        return;
      }

      const data = await buscarTodosUsuarios(url);

      if (data) {
        const { content, page, pageSize, totalElements, totalPages } = data.dados;
        setModels(content);
        setCurrentPage(page);
        setPageSize(pageSize);
        setTotalElements(totalElements);
        setTotalPages(totalPages);
      }
    }
    getUsuarios();
  // ✅ getEndpoint no array — quando resources carregar, dispara novamente
  }, [currentPage, pageSize, searchTerm, order, props, getEndpoint]);

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
    const dir = order === 'ASC' ? 'DESC' : 'ASC';
    setProps(props);
    setOrder(dir);
  };

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{USUARIO.TITULO.LISTA}</h2>
          <Link to={ROTA.USUARIO.CRIAR} className="btn btn-add">
            <span className="btn-icon"><i><FaPlus /></i></span>
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
              <th><button onClick={(e) => onSortProps(e, 'ID_USUARIO')}>{USUARIO.LABEL.ID}</button></th>
              <th><button onClick={(e) => onSortProps(e, 'NOME_USUARIO')}>{USUARIO.LABEL.NOME}</button></th>
              <th><button onClick={(e) => onSortProps(e, 'SOBRENOME_USUARIO')}>{USUARIO.LABEL.SOBRENOME}</button></th>
              <th><button onClick={(e) => onSortProps(e, 'EMAIL_USUARIO')}>{USUARIO.LABEL.EMAIL}</button></th>
              <th className="center actions" colSpan={3}>Ação</th>
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
                  <Link to={`${ROTA.USUARIO.ATUALIZAR}/${model.idUsuario}`} className="btn btn-edit">
                    <span className="btn-icon"><i><BsPencilSquare /></i></span>
                  </Link>
                  <Link to={`${ROTA.USUARIO.EXCLUIR}/${model.idUsuario}`} className="btn btn-delete">
                    <span className="btn-icon"><i><FaRegTrashAlt /></i></span>
                  </Link>
                  <Link to={`${ROTA.USUARIO.POR_ID}/${model.idUsuario}`} className="btn btn-info">
                    <span className="btn-icon"><i><FaMagnifyingGlass /></i></span>
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