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




  const { getEndpoint } = useResources();

/*
// hook Memo() => mantém na memória o valor carregado e evita repetição.
// Dependemos de getEndpoint para que a URL seja recalculada quando os recursos mudarem.
  const url = React.useMemo(() => getEndpoint('cidade'), [getEndpoint]);

// o valor || função carregada na memória, evitando a repetição, e só é recalculada quando o recurso 'cidade' for atualizado.

let url = React.useMemo(() => {
  const urlCidade = getEndpoint('cidade');
  return urlCidade;
}, []);
*/

  // hook Memo() => mantém na memória o valor carregado e evita repetição.
  // Dependemos de getEndpoint para que a URL seja recalculada quando os recursos mudarem.
  const url = React.useMemo(() => getEndpoint('cidade'), [getEndpoint]);

  if (!url) {
    // Não bloqueamos a renderização da lista enquanto o recurso ainda não foi carregado.
    // O endpoint de listagem de cidades é obtido por ROTA fixa em apiGetCidades().
    console.warn('recurso inexistente: getEndpoint ainda não retornou URL');
  }

  const buscarTodasCidades = useCallback(
    async (params: SearchParams): Promise<Cidade[] | null> => {
      try {
        const response = await apiGetCidades(params);
        return response.data;
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
    async function getCidades() {
      const params = {
        page: currentPage,
        pageSize: pageSize,
        props: props,
        order: order,
        searchTerm: searchTerm.trim() === '' ? undefined : searchTerm.trim(),
        // o motivo da mudança é que a API espera um parâmetro de busca opcional, 
        // e enviar uma string vazia pode causar resultados inesperados ou 
        // sobrecarregar o servidor com consultas desnecessárias. Ao enviar undefined, 
        // indicamos claramente que não há termo de busca, permitindo que a API retorne 
        // todos os registros ou aplique a lógica de busca corretamente.
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
