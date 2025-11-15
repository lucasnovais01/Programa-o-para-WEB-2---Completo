import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import MensagemErro from "../../components/mensagem/MensagemErro";
import {
  apiGetCidade,
  apiPutCidade,
} from "../../services/cidade/api/api.cidade";
import {
  CIDADE,
  fieldsCidade,
  mapaCampoParaMensagem,
} from "../../services/cidade/constants/cidade.constants";
import type { Cidade, ErrosCidade } from "../../services/cidade/type/Cidade";
import { ROTA } from "../../services/router/url";

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

export default function AlterarCidade() {
  const { idCidade } = useParams<{ idCidade: string }>();
  const [model, setModel] = useState<Cidade>(CIDADE.DADOS_INCIAIS);
  const [errors, setErrors] = useState<ErrosCidade | null>(null);
  const navigate = useNavigate();

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

  const handleChangeField = (name: keyof Cidade, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    console.log(model);
  };

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
    if (errors) {
      if (errors[name]) {
        return "form-control is-invalid app-label input-error mt-2 ";
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

    if (!validarFormulario()) {
      console.log("erros nos dados do formulário");
      return;
    }

    try {
      const response = apiPutCidade(idCidade, model);
      console.log(response);
      navigate(ROTA.CIDADE.LISTAR);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROTA.CIDADE.LISTAR);
  };

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Alterar Cidade</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="codCidade" className="app-label">
              {CIDADE.LABEL.CODIGO}:
            </label>
            <input
              id={CIDADE.FIELDS.CODIGO}
              name={CIDADE.FIELDS.CODIGO}
              value={model?.codCidade}
              className={getInputClass(CIDADE.FIELDS.CODIGO)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(CIDADE.FIELDS.CODIGO, e.target.value)
              }
              onBlur={(e) => validateField(CIDADE.FIELDS.CODIGO, e)}
            />
            {errors?.codCidade && (
              <MensagemErro
                error={errors.codCidade}
                mensagem={errors.codCidadeMensagem}
              />
            )}
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="nomeCidade" className="app-label">
              {CIDADE.LABEL.NOME}:
            </label>
            <input
              id={CIDADE.FIELDS.NOME}
              name={CIDADE.FIELDS.NOME}
              value={model?.nomeCidade}
              className={getInputClass(CIDADE.FIELDS.NOME)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(CIDADE.FIELDS.NOME, e.target.value)
              }
              onBlur={(e) => validateField(CIDADE.FIELDS.NOME, e)}
            />
            {errors?.nomeCidade && (
              <MensagemErro
                error={errors.nomeCidade}
                mensagem={errors.nomeCidadeMensagem}
              />
            )}
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
