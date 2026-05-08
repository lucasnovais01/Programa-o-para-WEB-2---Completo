import React, {
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
import type { SearchParams } from '../../services/cidade/api/api.cidade';
import { apiGetCidades } from '../../services/cidade/api/api.cidade';
import { CIDADE } from '../../services/cidade/constants/cidade.constants';
import type { Cidade } from '../../services/cidade/type/Cidade';
import { useResources } from '../../services/providers/ResourcesProviders';
import { ROTA } from '../../services/router/url';

export default function ListarCidade() {
  // useState = hook - gancho - função
  // reagir as alterações na variável
  // renderiza -
  const [models, setModels] = useState<Cidade[]>([]);
  // estados da paginação;
  // page = currentPage
  const [currentPage, setCurrentPage] = useState<number>(1);
  // pageSize = recordPerPages
  const [recordPerPages, setRecordPerPages] = useState<number>(5);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // props
  const [props, setProps] = useState<string>('ID_CIDADE');
  const [order, setOrder] = useState<string>('ASC');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Foi colocado o loading para evitar que a aplicação tente acessar o recurso antes 
  // de carregar as URLs do backend
  // Pq não estava mostrando o formulario
  const { getEndpoint, loading } = useResources();


  // hook Memo() => mantém na memória 
  // o valor || função carregada, evitando 
  // repetição.  

  /*
  // No código do professor está:

  let url = React.useMemo(() => {
    const urlCidade = getEndpoint('cidade');
    return urlCidade;
  }, []);

  // mudei pra const url pq não tem necessidade de ser let, já que o valor não vai mudar
  // ou seja, só tireo o let
  */
  const url = React.useMemo(() => getEndpoint('cidade'), [getEndpoint]);

  // antes era só if (!url) { ... }, mudei para && !loading pq getEndpoint demora um pouco para carregar 
  // as URLs do backend, e sem o loading, a aplicação tentava acessar o recurso antes de carregar, 
  // o que causava erro e não mostrava o formulário
  if (!url && !loading) {
    console.error('recurso inexistente');

    // tirei o 'return;' pq se o loading for true, ou seja, se ainda estiver carregando as URLs do backend,
    // ele não vai entrar nesse if, e consequentemente não vai retornar nada, o que é o 
    // comportamento esperado, já que enquanto estiver carregando, a aplicação não deve tentar 
    // acessar o recurso
  }

  const buscarTodasCidades = useCallback(
    async (params: SearchParams): Promise<any | null> => {
      // o if abaixo é novo e não tem no codigo do professor
      if (!url) {
        return null;
      }
      // o if acima é novo e não tem no codigo do professor
      try {
        const response = await apiGetCidades(url, params);
        return response.data;
      } catch (error: any) {
        console.log(error);
      }
      return null;
    },
    [url],
    // Adicionado url dentro do colchetes vazio para garantir que a função seja atualizada 
    // quando a URL do backend estiver disponível
  );

  //hook - função - reagir, quando carregar a página
  //pela primeira vez, quando o array for vázio.
  // algum argumento - ele monitora
  useEffect(() => {
    async function getCidades() {
      // o if abaixo é novo e não tem no codigo do professor
      if (!url) {
        return;
      }
      // o if acima é novo e não tem no codigo do professor
      const params = {
        page: currentPage,
        pageSize: pageSize,
        props: props,
        order: order,
        searchTerm: searchTerm === '' ? null : searchTerm,
      };
      const data = await buscarTodasCidades(params);
      console.log(data);
      if (data) {
        const { content, page, pageSize, totalElements, totalPages } =
          data.dados;
        setModels(content);
        setCurrentPage(page);
        setPageSize(pageSize);
        setTotalElements(totalElements);
        setTotalPages(totalPages);
      }
    }
    getCidades();
  // Adicionado url no array de dependências para garantir que o useEffect seja executado novamente 
  // quando a URL do backend estiver disponível, permitindo que a aplicação busque os dados corretamente.
  }, [url, currentPage, pageSize, searchTerm, order, props]);

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
          recordsPerPage={recordPerPages}
          handleRecordsPerPageChange={handleRecordsPerPageChange}
        />
        <br />
        <table>
          <thead>
            <tr>
              <th>
                <button onClick={(e) => onSortProps(e, 'COD_CIDADE')}>
                  {CIDADE.LABEL.CODIGO}
                </button>
              </th>

              <th>
                <button onClick={(e) => onSortProps(e, 'NOME_CIDADE')}>
                  {CIDADE.LABEL.NOME}
                </button>
              </th>

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
