
import { useEffect, useState, type FocusEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiGetFuncao, apiPutFuncao } from "../api/api.funcao";
import { FUNCAO } from "../constants/funcao.constants";
import type { ErrosFuncao, Funcao } from "../type/funcao";

export const useAlterar = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<Funcao | null>(null);
  const [errors, setErrors] = useState<ErrosFuncao>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getFuncao() {
      try {
        if (!id) {
          setLoading(false);
          return;
        }

        const response = await apiGetFuncao(Number(id));
        if (response?.data?.dados) {
          setModel(response.data.dados as Funcao);
        }
      } catch (error: unknown) {
        console.error(error);
        alert(FUNCAO.OPERACAO.POR_ID.ERRO);
      } finally {
        setLoading(false);
      }
    }

    getFuncao();
  }, [id]);

  const handleChangeField = (name: keyof Funcao, value: string) => {
    const normalizedValue =
      name === FUNCAO.FIELDS.NIVEL_ACESSO || name === FUNCAO.FIELDS.CODIGO
        ? value === ""
          ? undefined
          : Number(value)
        : value;

    setModel((prev) => ({
      ...(prev ?? {}),
      [name]: normalizedValue,
    } as Funcao));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${String(name)}Mensagem`]: undefined,
    } as unknown as ErrosFuncao));
  };

  const validateField = (
    name: keyof Funcao,
    e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const messages: string[] = [];

    switch (name) {
      case FUNCAO.FIELDS.CODIGO:
        if (!value || String(value).trim().length === 0)
          messages.push("Código da função é obrigatório");
        break;

      case FUNCAO.FIELDS.NOME:
        if (!value || String(value).trim().length === 0)
          messages.push("Nome da função é obrigatório");
        if (value && String(value).length < 3)
          messages.push("Nome deve ter no mínimo 3 caracteres");
        if (value && String(value).length > 100)
          messages.push("Nome deve ter no máximo 100 caracteres");
        break;

      case FUNCAO.FIELDS.DESCRICAO:
        if (value && String(value).length > 500)
          messages.push("Descrição deve ter no máximo 500 caracteres");
        break;

      case FUNCAO.FIELDS.NIVEL_ACESSO:
        if (!value) messages.push("Nível de acesso é obrigatório");
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${String(name)}Mensagem`]:
        messages.length > 0 ? messages : undefined,
    } as unknown as ErrosFuncao));
  };

  const validarFormulario = (): boolean => {
    const newErrors: ErrosFuncao = {};
    let isFormValid = true;

    if (!model) {
      return false;
    }

    if (!model.codigoFuncao && model.codigoFuncao !== 0) {
      newErrors.codigoFuncao = true;
      newErrors.codigoFuncaoMensagem = ["Código da função é obrigatório"];
      isFormValid = false;
    }

    if (!model.nomeFuncao || String(model.nomeFuncao).trim().length === 0) {
      newErrors.nomeFuncao = true;
      newErrors.nomeFuncaoMensagem = ["Nome da função é obrigatório"];
      isFormValid = false;
    } else if (String(model.nomeFuncao).length < 3) {
      newErrors.nomeFuncao = true;
      newErrors.nomeFuncaoMensagem = ["Nome deve ter no mínimo 3 caracteres"];
      isFormValid = false;
    } else if (String(model.nomeFuncao).length > 100) {
      newErrors.nomeFuncao = true;
      newErrors.nomeFuncaoMensagem = ["Nome deve ter no máximo 100 caracteres"];
      isFormValid = false;
    }

    if (model.descricao && String(model.descricao).length > 500) {
      newErrors.descricao = true;
      newErrors.descricaoMensagem = ["Descrição deve ter no máximo 500 caracteres"];
      isFormValid = false;
    }

    if (model.nivelAcesso === undefined || model.nivelAcesso === null) {
      newErrors.nivelAcesso = true;
      newErrors.nivelAcessoMensagem = ["Nível de acesso é obrigatório"];
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const getInputClass = (field?: keyof ErrosFuncao): string => {
    if (field && errors[field])
      return "form-control is-invalid app-label input-error mt-2";
    return "form-control app-label mt-2";
  };

  const showMensagem = (field: keyof Funcao) => {
    const msgKey = `${String(field)}Mensagem` as keyof ErrosFuncao;
    const messages = errors[msgKey] as string[] | undefined;
    if (!messages || messages.length === 0) return null;

    return (
      <div className="input-error-messages">
        {messages.map((message, index) => (
          <div
            className="invalid-feedback"
            style={{ display: "block" }}
            key={index}
          >
            {message}
          </div>
        ))}
      </div>
    );
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !model) {
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const codigo = Number(id);
      await apiPutFuncao(codigo, {
        codigoFuncao: model.codigoFuncao,
        nomeFuncao: model.nomeFuncao,
        descricao: model.descricao ?? undefined,
        nivelAcesso: Number(model.nivelAcesso ?? 1),
      });

      navigate(ROTA.FUNCAO.LISTAR, {
        state: {
          toast: {
            message: FUNCAO.OPERACAO.ATUALIZAR.SUCESSO,
            type: "success",
          },
        },
      });
    } catch (error: unknown) {
      console.error(error);
      alert(FUNCAO.OPERACAO.ATUALIZAR.ERRO);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate(ROTA.FUNCAO.LISTAR);
  };

  return {
    model,
    errors,
    loading,
    handleChangeField,
    validateField,
    showMensagem,
    getInputClass,
    onSubmitForm,
    onCancel,
  };
};
