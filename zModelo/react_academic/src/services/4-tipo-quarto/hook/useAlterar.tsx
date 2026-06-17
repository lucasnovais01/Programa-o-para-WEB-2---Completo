/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FocusEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROTA } from "../../router/url";
import {
  apiGetTipoQuarto,
  apiPutTipoQuarto,
} from "../api/api.tipo-quarto";
import { TIPO_QUARTO } from "../constants/tipo-quarto.constants";
import type { TipoQuarto } from "../type/tipo-quarto";

type ErrosTipoQuarto = Record<string, unknown>;

export const useAlterar = () => {
  const { codigoTipoQuarto } = useParams<{ codigoTipoQuarto: string }>();
  const [model, setModel] = useState<TipoQuarto | null>(null);
  const [errors, setErrors] = useState<ErrosTipoQuarto>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getTipoQuarto() {
      try {
        if (!codigoTipoQuarto) return;
        const id = parseInt(codigoTipoQuarto, 10);
        const response = await apiGetTipoQuarto(id);
        if (response?.data?.dados) {
          setModel(response.data.dados);
        }
      } catch (error: unknown) {
        console.error(error);
        alert("Erro ao buscar tipo de quarto.");
      }
    }

    getTipoQuarto();
  }, [codigoTipoQuarto]);

  const handleChangeField = (name: keyof TipoQuarto, value: string) => {
    setModel((prev) =>
      ({
        ...(prev ?? (TIPO_QUARTO.DADOS_INICIAIS as unknown as TipoQuarto)),
        [name]:
          name === TIPO_QUARTO.FIELDS.CODIGO ||
          name === TIPO_QUARTO.FIELDS.CAPACIDADE ||
          name === TIPO_QUARTO.FIELDS.VALOR_DIARIA
            ? Number(value)
            : value,
      } as unknown as TipoQuarto),
    );

    setErrors((prev) =>
      ({
        ...prev,
        [name]: undefined,
        [`${String(name)}Mensagem`]: undefined,
      } as unknown as ErrosTipoQuarto),
    );
  };

  const validateField = (
    name: keyof TipoQuarto,
    e: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const messages: string[] = [];

    switch (name) {
      case TIPO_QUARTO.FIELDS.CODIGO:
        if (!value || Number(value) <= 0)
          messages.push(TIPO_QUARTO.INPUT_ERROR.CODIGO.MIN_VAL);
        break;

      case TIPO_QUARTO.FIELDS.NOME:
        if (!value || String(value).trim().length === 0)
          messages.push(TIPO_QUARTO.INPUT_ERROR.NOME.BLANK);
        break;

      case TIPO_QUARTO.FIELDS.CAPACIDADE:
        if (!value || Number(value) <= 0)
          messages.push(TIPO_QUARTO.INPUT_ERROR.CAPACIDADE.MIN_VAL);
        break;

      case TIPO_QUARTO.FIELDS.VALOR_DIARIA:
        if (!value || Number(value) <= 0)
          messages.push(TIPO_QUARTO.INPUT_ERROR.VALOR_DIARIA.MIN_VAL);
        break;

      default:
        break;
    }

    setErrors((prev) =>
      ({
        ...prev,
        [name]: messages.length > 0,
        [`${String(name)}Mensagem`]:
          messages.length > 0 ? messages : undefined,
      } as unknown as ErrosTipoQuarto),
    );
  };

  const validarFormulario = (): boolean => {
    const newErrors: ErrosTipoQuarto = {};
    let isFormValid = true;

    const valores = {
      codigoTipoQuarto: model?.codigoTipoQuarto,
      nomeTipo: model?.nomeTipo,
      capacidadeMaxima: model?.capacidadeMaxima,
      valorDiaria: model?.valorDiaria,
    } as const;

    if (!valores.codigoTipoQuarto || Number(valores.codigoTipoQuarto) <= 0) {
      newErrors.codigoTipoQuarto = true;
      newErrors.codigoTipoQuartoMensagem = [TIPO_QUARTO.INPUT_ERROR.CODIGO.MIN_VAL];
      isFormValid = false;
    }

    if (!valores.nomeTipo || String(valores.nomeTipo).trim().length === 0) {
      newErrors.nomeTipo = true;
      newErrors.nomeTipoMensagem = [TIPO_QUARTO.INPUT_ERROR.NOME.BLANK];
      isFormValid = false;
    }

    if (!valores.capacidadeMaxima || Number(valores.capacidadeMaxima) <= 0) {
      newErrors.capacidadeMaxima = true;
      newErrors.capacidadeMaximaMensagem = [
        TIPO_QUARTO.INPUT_ERROR.CAPACIDADE.MIN_VAL,
      ];
      isFormValid = false;
    }

    if (!valores.valorDiaria || Number(valores.valorDiaria) <= 0) {
      newErrors.valorDiaria = true;
      newErrors.valorDiariaMensagem = [TIPO_QUARTO.INPUT_ERROR.VALOR_DIARIA.MIN_VAL];
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const getInputClass = (field?: keyof ErrosTipoQuarto): string => {
    if (field && errors[field])
      return "form-control is-invalid app-label input-error mt-2";
    return "form-control app-label mt-2";
  };

  const showMensagem = (field: keyof TipoQuarto) => {
    const msgKey = `${String(field)}Mensagem` as keyof ErrosTipoQuarto;
    const m = errors[msgKey] as any;
    if (!m) return null;

    return (
      <div className="input-error-messages">
        {Array.isArray(m)
          ? m.map((message, index) => (
              <div
                className="invalid-feedback"
                style={{ display: "block" }}
                key={index}
              >
                {message}
              </div>
            ))
          : [m].map((message, index) => (
              <div
                className="invalid-feedback"
                style={{ display: "block" }}
                key={index}
              >
                {String(message)}
              </div>
            ))}
      </div>
    );
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!model) return;
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      await apiPutTipoQuarto(Number(codigoTipoQuarto ?? 0), {
        codigoTipoQuarto: Number(model.codigoTipoQuarto),
        nomeTipo: String(model.nomeTipo ?? "").trim(),
        capacidadeMaxima: Number(model.capacidadeMaxima),
        valorDiaria: Number(model.valorDiaria),
      } as unknown as TipoQuarto);

      navigate(ROTA.TIPO_QUARTO.LISTAR, {
        state: {
          toast: {
            message: TIPO_QUARTO.OPERACAO.ATUALIZAR.SUCESSO,
            type: "success",
          },
        },
      });
    } catch (error: any) {
      console.error(error);
      alert(TIPO_QUARTO.OPERACAO.ATUALIZAR.ERRO);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate(ROTA.TIPO_QUARTO.LISTAR);
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
