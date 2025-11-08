import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";
import {
  apiGetCidade,
  apiPutCidade,
} from "../../services/cidade/api/api.cidade";
import { CIDADE } from "../../services/cidade/constants/cidade.constants";
import type { Cidade, ErrosCidade } from "../../services/cidade/type/Cidade";

const buscarCidadePorId = async (idCidade:string): Promise<Cidade | null> => {

  try {
    const response = await apiGetCidade(idCidade);
    return response.data.dados;
  }
  catch (error: any) {
    console.log(error);
  }
  return null;
};



export default function AlterarCidade() {
  const { idCidade } = useParams<{ idCidade: string }>();
  const [model, setModel] = useState<Cidade | null>(null);
  const [errors, setErrors ] = useState<ErrosCidade>({});


  useEffect(() => {
    async function getCidade() {
      try {
        if (idCidade) {
          const response = await apiGetCidade(idCidade);
          console.log(response);
          if (!response) {
            setModel(response);  // tipo de hook
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
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };



/*

  const validateField = (
    name: keyof Cidade,
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    let messages: string[] = [];
    const value = model[name];



    switch (name) {
      case CIDADE.FIELDS.CODIGO:
        if (!value) messages.push(CIDADE.INPUT_ERROR.CODIGO.BLANK);
        if (value && typeof value !== "string")
          messages.push(CIDADE.INPUT_ERROR.CODIGO.STRING);
        break;
      case CIDADE.FIELDS.NOME:
        if (!value || String(value).trim().length === 0) {
          messages.push(CIDADE.INPUT_ERROR.NOME.BLANK);
        }
        if (String(value).length > 0 && String(value).length < 6) {
          messages.push(CIDADE.INPUT_ERROR.NOME.MIN_LEN);
        }
        if (String(value).length > 100) {
          messages.push(CIDADE.INPUT_ERROR.NOME.MAX_LEN);
        }
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${name}Mensagem`]: messages.length > 0 ? messages : undefined,
    }));
  };

  const validarFormulario = (): boolean => {
    const newErrors: ErrosCidade = {};
    let isFormValid = true;

    const codCidadeMessages = [];

    if (!model.codCidade) {
      codCidadeMessages.push(CIDADE.INPUT_ERROR.CODIGO.VALID);
    }
    if (model.codCidade && typeof model.codCidade !== "string") {
      codCidadeMessages.push(CIDADE.INPUT_ERROR.CODIGO.STRING);
    }
    if (codCidadeMessages.length > 0) {
      newErrors.codCidade = true;
      newErrors.codCidadeMensagem = codCidadeMessages;
      isFormValid = false;
    }

    const nomeCidadeMessages = [];

    if (!model.nomeCidade || model.nomeCidade.trim().length === 0) {
      nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.BLANK);
    }
    if (model.nomeCidade) {
      if (model.nomeCidade.length > 0 && model.nomeCidade.length < 6) {
        nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.MIN_LEN);
      }
      if (model.nomeCidade.length > 100) {
        nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.MAX_LEN);
      }
    }
    if (nomeCidadeMessages.length > 0) {
      newErrors.nomeCidade = true;
      newErrors.nomeCidadeMensagem = nomeCidadeMessages;
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const getInputClass = (name: keyof Cidade): string => {
    if (!errors) "form-control app-label mt-2";

    const hasErrors = errors[name];
    if (hasErrors) {
      return "form-control is-invalid app-label input-error mt-2 ";
    }

    return "form-control app-label mt-2";
  };

*/






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
