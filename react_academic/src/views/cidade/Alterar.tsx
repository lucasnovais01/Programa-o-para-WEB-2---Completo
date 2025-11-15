import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  apiGetCidade,
  apiPutCidade,
} from "../../services/cidade/api/api.cidade";
import { CIDADE, mapaCampoParaMensagem, fieldsCidade } from "../../services/cidade/constants/cidade.constants";
import type { Cidade } from "../../services/cidade/type/Cidade";

import type { ErrosCidade } from "../../type/cidade";
import { ROTA } from "../../services/router/url";

/*
  Novo:
*/

const setServerErrorsCidade = (
  serverErros: Partial<Record<keyof Cidade, string[]>> | null
) :ErrosCidade | null => {

  if (!serverErros) {
    return null;
  }

  const newErrors: ErrosCidade = {};

  (Object.keys(serverErros) as 
    (keyof Cidade)[]).forEach((field) => {
      const mensagens = serverErros[field];

      if (mensagens && mensagens.length > 0) {
        newErrors[field] = true;

        const msgKey = `${String(field)}Mensagem`;

        (newErrors as any)[msgKey] = [mensagens];
      }
  });
  return Object.keys(newErrors).length > 0 ? newErrors : null;
};


//

const validarCamposVaziosCidade = (
  cidade: Cidade
): Partial<Record<keyof Cidade, string[]>> => {
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

// LETS (variavel mutável)

let cidade: Cidade | null = null;
let errosCidade: ErrosCidade | null = null;

try {

  const response = await apiGetCidade(idCidade);
  if (response.data.dados) {
    cidade = response.data.dados;

    if (cidade){
      const errosValidacao = validarCamposVaziosCidade(cidade)
      if (errosValidacao) {
        errosCidade = setServerErrorsCidade(errosValidacao);
      }
    }
  }

//  return response.data.dados; //como estava antiamento
  return cidade ? { 
    cidade, 
    errosCidade} : null;
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
  const [errors, setErrors] = useState<ErrosCidade | null>(null); //correto

  const navigate = useNavigate();

  useEffect(() => {
    async function getCidade() {
      try {
        if (idCidade) {
          const response = await apiGetCidade(idCidade);

          //console.log(response.data.dados);

          if (response?.cidade) {
            setModel(response.cidade);
            setError(response?.errosCidade ?? null);
          }

          /* ANTIGO:

          if (response.data.dados) {
            setModel(response.data.dados);
          }
          */
        }
      }
      catch (error: any) {
        console.log(error);
      }
    }

    getCidade();
  }, [idCidade]);

  const handleChangeField = (name: keyof Cidade, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    console.log(model);
  };

  const getInputClass = (name: keyof Cidade): string => {
    if (errors) {
      const hasErrors = erros[name];

      if (hasErrors) {
        return "form-control is-invalid app-label input-en"
      }
    }
    return "form-control app-label mt-2";
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    // não deixa executar o processo normal
    e.preventDefault();

    if (!idCidade || !model) {
      return;
    }

    if (!validarFormulario()){
      console.log("erros nos dados do forumlário");
      return;
    }

    try {
      const response = apiPutCidade(idCidade, model);
      console.log(response);
      navigate(ROTA.CIDADE.LISTAR)
    }
    catch (error: any) {
      console.log(error);
    }
  };

  // Evento tipo mouse disprado por um botão

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROTA.CIDADE.LISTAR);

    // Quando o usuário clicar n ocancelar , ousuário volta pro
  };

// tela:

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
              onClick={handleCancel} // vai dar uma utilidade pro botão. Ao clicar cancelar, vai voltar
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
/*
function setServerErrorsCidade(errosValidacao: Partial<Record<keyof Cidade, string[]>>): ErrosCidade | null {
  throw new Error("Function not implemented.");
}

function setError() {
  throw new Error("Function not implemented.");
}
*/
