import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";
import {
  apiGetCidade,
  apiPutCidade,
} from "../../services/cidade/api/api.cidade";
import { CIDADE } from "../../services/cidade/constants/cidade.constants";
import type { Cidade } from "../../services/cidade/type/Cidade";

import type { ErrosCidade } from "../../type/cidade";
/*
  Novo:
*/
const validarCamposVaziosCidade = (
  cidade: Cidade
) : Partial<Record<keyof Cidade, string[]>> => {
  const erros: Partial<Record<keyof Cidade, string[]>> = {};

  fieldsCidade.forEach(field => {  //codCidade

    const valor = cidade[field];  // aqui vai pegar o conteúdo do codCidade
    const isEmpty = 
      valor === undefined || 
      valor === null || 
      (typeof valor === "string" && valor.trim() === "");
    
    if (isEmpty) {
      const keyMessage = mapaCampoParaMensagem[field];
      const mensagemErro = CIDADE.INPUT_ERROR[keyMessage]?.BLANK;
      const mensagem = mensagemErro ?? `O campo ${field} é indefinido`

      erros[field] = [mensagem]

    }
  });
  return Object.keys(erros).length > 0 ? erros : null;
};

interface BuscarCidadePorIdProps {
  cidade: Cidade;
  errosCidade: ErrosCidade | null | undefined;
}

const buscarCidadePorId = async (
  idCidade: string,
): Promise<BuscarCidadePorIdProps | null> => {


let errosCidade: ErrosCidade | null = null;
try {
  const response = await apiGetCidade(idCidade);
  if (response.data.dados) {
    cidade = response.data.dados;
    const errosValidacao = validarCamposVaziosCidade(cidade)
    
    if (errosValidacao) {
      errosCidade = setServerErrorsCidade(errosValidacao);
    }
  }
  return response.data.dados;
}
  catch (error: any) {
    console.log(error);
  }
  return null;

};

// A ideia acima é supervalidar






// Acima é novo

export default function AlterarCidade() {
  const { idCidade } = useParams<{ idCidade: string }>();
  const [model, setModel] = useState<Cidade | null>(null);

  useEffect(() => {
    async function getCidade() {
      try {
        if (idCidade) {
          const response = await apiGetCidade(idCidade);
          console.log(response.data.dados);
          if (response.data.dados) {
            setModel(response.data.dados);
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    }

    getCidade();
  }, [idCidade]);

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
      const response = apiPutCidade(idCidade, model);
      console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getInputClass = () => {
    return "form-control app-label mt-2";
  };

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Alterar Cidade</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="codCidade" className="app-label">
              Código:
            </label>
            <input
              id="codCidade"
              name="codCidade"
              value={model?.codCidade}
              className={getInputClass()}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(CIDADE.FIELDS.CODIGO, e.target.value)
              }
            />
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="nomeCidade" className="app-label">
              Nome:
            </label>
            <input
              id="nomeCidade"
              name="nomeCidade"
              value={model?.nomeCidade}
              className={getInputClass()}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(CIDADE.FIELDS.NOME, e.target.value)
              }
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
function setServerErrorsCidade(errosValidacao: Partial<Record<keyof Cidade, string[]>>): ErrosCidade | null {
  throw new Error("Function not implemented.");
}

