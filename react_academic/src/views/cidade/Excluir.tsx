import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  apiDeleteCidade,
  apiGetCidade,
} from "../../services/cidade/api/api.cidade";
import type { Cidade, ErrosCidade } from "../../services/cidade/type/Cidade";
import { ROTA } from "../../services/router/url";
import { CIDADE, fieldsCidade, mapaCampoParaMensagem } from "../../services/cidade/constants/cidade.constants";

// TAREFA: REFATORAR a tela de EXCLUSÃO. O excluir não está pegando os dados de código e nome da CIDADE LISTAR

/**
 *  COPIA DO ALTERAR ABAIXO
 */
const setServerErrorsCidade = (
  serverErros: Partial<Record<keyof Cidade, string[]>> | null,
): ErrosCidade | null => {
  if (!serverErros) {
    return null;
  }

  const newErrors: ErrosCidade = {};

  (Object.keys(serverErros) as (keyof Cidade)[]).forEach((field) => {
    const mensagens = serverErros[field];

    if (mensagens && mensagens.length > 0) {
      newErrors[field] = true;

      const msgKey = `${String(field)}Mensagem`;

      (newErrors as any)[msgKey] = [mensagens];
    }
  });
  return Object.keys(newErrors).length > 0 ? newErrors : null;
};



const validarCamposVaziosCidade = (
  cidade: Cidade,
): Partial<Record<keyof Cidade, string[]>> | null => {
  const erros: Partial<Record<keyof Cidade, string[]>> = {};
  fieldsCidade.forEach((field) => {
    const valor = cidade[field];
    const isEmpty =
      valor === undefined ||
      valor === null ||
      (typeof valor === "string" && valor.trim() === "");

    if (isEmpty) {
      const keyMessage = mapaCampoParaMensagem[field];
      const mensagemErro = CIDADE.INPUT_ERROR[keyMessage]?.BLANK;
      const mensagem = mensagemErro ?? `O campo ${field} é obrigatório`;

      erros[field] = [mensagem];
    }
  });
  return Object.keys(erros).length > 0 ? erros : null;
};

interface BuscarCidadePorIdProps {
  cidade: Cidade | null;
  errosCidade: ErrosCidade | null | undefined;
}

const buscarCidadePorId = async (
  idCidade: string,
): Promise<BuscarCidadePorIdProps | null> => {
  let cidade: Cidade | null = null;
  let errosCidade: ErrosCidade | null = null;
  try {
    const response = await apiGetCidade(idCidade);
    if (response.data.dados) {
      cidade = response.data.dados;
      if (cidade) {
        const errosValidacao = validarCamposVaziosCidade(cidade);
        if (errosValidacao) {
          errosCidade = setServerErrorsCidade(errosValidacao);
        }
      }
    }
    return {
      cidade,
      errosCidade,
    };
  } catch (error: any) {
    console.log(error);
  }
  return null;
};



////////////////////////////////////

export default function ExcluirCidade() {
  const { idCidade } = useParams<{ idCidade: string }>();
  const [model, setModel] = useState<Cidade | null>(null);

  const [errors, setErrors] = useState<ErrosCidade | null>(null); // copiado de Alterar.tsx
  const navigate = useNavigate();

// Solução: Adicionar useEffect com buscarCidadePorId
// Você já tem a função buscarCidadePorId pronta e funcionando. Só falta usá-la no ExcluirCidade, assim como no AlterarCidade
/* Não funciona
useEffect(() => {
    async function carregarCidade() {
      if (idCidade) {
        const resultado = await buscarCidadePorId(idCidade);
        if (resultado?.cidade) {
          setModel(resultado.cidade);
        }
      }
    }

    carregarCidade();
  }, [idCidade]);
*/
  useEffect(() => {
    async function getCidade() {
      try {
        if (idCidade) {
          const response = await buscarCidadePorId(idCidade);
          if (response?.cidade) {
            setModel(response.cidade);
            setErrors(response?.errosCidade ?? null);
            if (response?.errosCidade) {
              console.log("Erros existentes no registro da cidade");
            }
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    }

    getCidade();
  }, [idCidade]);

  // será que está usando está cosntante em Excluir.tsx ???
  const handleChangeField = (name: keyof Cidade, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    console.log(model);
  };










  const onSubmitForm = async (e: any) => {
    // não deixa executar o processo normal
    e.preventDefault();

    if (!idCidade || !model) {
      return;
    }

    try {
      const response = apiDeleteCidade(idCidade);
      console.log(response);

      navigate(ROTA.CIDADE.LISTAR); //novo, vai voltar para o Listar

    } catch (error: any) {
      console.log(error);
    }
  };

  const getInputClass = () => {
    return "form-control app-label mt-2";
  };

  // NOVO E FUNCIONANDO
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROTA.CIDADE.LISTAR);
  };

// AQUI ONDE VAI A TELA:

  return (
    <div className="display">
      <div className="card animated fadeInDown">

        <h2>Excluir Cidade</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="codCidade" className="app-label">
              Código:
            </label>
            <input
              id="codCidade"
              name="codCidade"
              defaultValue={model?.codCidade}
              className={getInputClass()}
              readOnly={false}
              disabled={false}
            />
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="nomeCidade" className="app-label">
              Nome:
            </label>
            <input
              id="nomeCidade"
              name="nomeCidade"
              defaultValue={model?.nomeCidade}
              className={getInputClass()}
              readOnly={false}
              disabled={false}
            />
          </div>
          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Cadastrar uma nova cidade"
            >
              <span className="btn-icon">
                <i>
                  <FaSave />
                </i>
              </span>
              Salvar
            </button>
            <button
              id="cancel"
              type="button"
              className="btn btn-cancel"
              title="Cancelar o Cadastro da cidade"
              onClick={handleCancel}
            >
              <span className="btn-icon">
                <i>
                  <MdCancel />
                </i>
              </span>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
