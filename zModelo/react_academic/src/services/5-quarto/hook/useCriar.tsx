/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type FocusEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiPostQuarto } from "../api/api.quarto";
import { QUARTO } from "../constants/quarto.constants";
import type { Quarto } from "../type/quarto";

type ErrosQuarto = Record<string, unknown>;

export const useCriar = () => {
  const [model, setModel] = useState<Quarto>(
    QUARTO.DADOS_INICIAIS as unknown as Quarto,
  );
  const [errors, setErrors] = useState<ErrosQuarto>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeField = (name: keyof Quarto, value: string) => {
    setModel((prev) =>
      ({
        ...(prev ?? (QUARTO.DADOS_INICIAIS as unknown as Quarto)),
        [name]:
          name === QUARTO.FIELDS.CODIGO_TIPO_QUARTO ||
          name === QUARTO.FIELDS.NUMERO ||
          name === QUARTO.FIELDS.ANDAR
            ? Number(value)
            : value,
      } as unknown as Quarto),
    );

    setErrors((prev) =>
      ({
        ...prev,
        [name]: undefined,
        [`${String(name)}Mensagem`]: undefined,
      } as unknown as ErrosQuarto),
    );
  };

  const validateField = (
    name: keyof Quarto,
    e: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const messages: string[] = [];

    switch (name) {
      case QUARTO.FIELDS.CODIGO_TIPO_QUARTO:
        if (!value || Number(value) <= 0)
          messages.push(QUARTO.INPUT_ERROR.CODIGO_TIPO_QUARTO.MIN_VAL);
        break;

      case QUARTO.FIELDS.NUMERO:
        if (!value || Number(value) <= 0)
          messages.push(QUARTO.INPUT_ERROR.NUMERO.MIN_VAL);
        break;

      case QUARTO.FIELDS.STATUS:
        if (!value) messages.push(QUARTO.INPUT_ERROR.STATUS.BLANK);
        break;

      case QUARTO.FIELDS.ANDAR:
        if (!value || Number(value) < 0)
          messages.push(QUARTO.INPUT_ERROR.ANDAR.VALID);
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
      } as unknown as ErrosQuarto),
    );
  };

  const validarFormulario = (): boolean => {
    const newErrors: ErrosQuarto = {};
    let isFormValid = true;

    const valores = {
      codigoTipoQuarto: model.codigoTipoQuarto,
      numero: model.numero,
      statusQuarto: model.statusQuarto,
      andar: model.andar,
    } as const;

    if (!valores.codigoTipoQuarto || Number(valores.codigoTipoQuarto) <= 0) {
      newErrors.codigoTipoQuarto = true;
      newErrors.codigoTipoQuartoMensagem = [
        QUARTO.INPUT_ERROR.CODIGO_TIPO_QUARTO.MIN_VAL,
      ];
      isFormValid = false;
    }

    if (!valores.numero || Number(valores.numero) <= 0) {
      newErrors.numero = true;
      newErrors.numeroMensagem = [QUARTO.INPUT_ERROR.NUMERO.MIN_VAL];
      isFormValid = false;
    }

    if (!valores.statusQuarto || String(valores.statusQuarto).trim().length === 0) {
      newErrors.statusQuarto = true;
      newErrors.statusQuartoMensagem = [QUARTO.INPUT_ERROR.STATUS.BLANK];
      isFormValid = false;
    }

    if (Number.isNaN(Number(valores.andar)) || Number(valores.andar) < 0) {
      newErrors.andar = true;
      newErrors.andarMensagem = [QUARTO.INPUT_ERROR.ANDAR.VALID];
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const getInputClass = (field?: keyof ErrosQuarto): string => {
    if (field && errors[field])
      return "form-control is-invalid app-label input-error mt-2";
    return "form-control app-label mt-2";
  };

  const showMensagem = (field: keyof Quarto) => {
    const msgKey = `${String(field)}Mensagem` as keyof ErrosQuarto;
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

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const quartoToSend: Quarto = {
        codigoTipoQuarto: Number(model.codigoTipoQuarto),
        numero: Number(model.numero),
        statusQuarto: String(model.statusQuarto ?? "LIVRE"),
        andar: Number(model.andar),
      } as unknown as Quarto;

      await apiPostQuarto(quartoToSend);

      navigate(ROTA.QUARTO.LISTAR, {
        state: {
          toast: {
            message: QUARTO.OPERACAO.CRIAR.SUCESSO,
            type: "success",
          },
        },
      });
    } catch (error: any) {
      console.error(error);
      alert(QUARTO.OPERACAO.CRIAR.ERRO);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate(ROTA.QUARTO.LISTAR);
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
