import React from "react";
import { TIPO_QUARTO } from "../../services/4-tipo-quarto/constants/tipo-quarto.constants";
import type { TipoQuarto } from "../../type/4-tipo-quarto";

export const MensagemErro: React.FC<{
  error?: boolean;
  mensagem?: string[] | undefined;
}> = ({ error, mensagem }) => {
  if (!error || !mensagem || mensagem.length === 0) return null;

  return (
    <div className="input-error-messages">
      {mensagem.map((m, i) => (
        <div key={i} className="invalid-feedback" style={{ display: "block" }}>
          {m}
        </div>
      ))}
    </div>
  );
};

export const getInputClass = (errors: any, field: keyof TipoQuarto): string => {
  if (!errors) return "form-control app-label mt-2";
  const hasErrors = !!errors[field];
  if (hasErrors) return "form-control is-invalid app-label input-error mt-2";
  return "form-control app-label mt-2";
};

export const createHandleChangeField = (
  setModel: React.Dispatch<React.SetStateAction<TipoQuarto>>,
  setErrors: React.Dispatch<React.SetStateAction<any>>
) => {
  return (name: keyof TipoQuarto, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({
      ...prev,
      [name]: undefined,
      [`${String(name)}Mensagem`]: undefined,
    }));
  };
};

export const createValidateField = (
  setErrors: React.Dispatch<React.SetStateAction<any>>
) => {
  return (
    name: keyof TipoQuarto,
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const messages: string[] = [];

    switch (name) {
      case TIPO_QUARTO.FIELDS.CODIGO:
        if (!value || String(value).trim().length === 0)
          messages.push("Código do tipo é obrigatório");
        else if (isNaN(Number(value)) || Number(value) <= 0)
          messages.push("Código deve ser um número maior que zero");
        break;

      case TIPO_QUARTO.FIELDS.NOME:
        if (!value || String(value).trim().length === 0)
          messages.push("Nome do tipo é obrigatório");
        if (value && String(value).length < 2)
          messages.push("Nome deve ter no mínimo 2 caracteres");
        if (value && String(value).length > 100)
          messages.push("Nome deve ter no máximo 100 caracteres");
        break;

      case TIPO_QUARTO.FIELDS.CAPACIDADE:
        if (!value || String(value).trim().length === 0)
          messages.push("Capacidade é obrigatória");
        else if (Number(value) <= 0)
          messages.push("Capacidade deve ser maior que zero");
        break;

      case TIPO_QUARTO.FIELDS.VALOR_DIARIA:
        if (!value || String(value).trim().length === 0)
          messages.push("Valor da diária é obrigatório");
        else if (Number(value) < 0)
          messages.push("Valor da diária não pode ser negativo");
        break;

      default:
        break;
    }

    setErrors((prev: any) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${String(name)}Mensagem`]: messages.length > 0 ? messages : undefined,
    }));
  };
};

export const createShowMensagem = (errors: any) => {
  return (field: keyof TipoQuarto) => {
    const msgKey = `${String(field)}Mensagem`;
    const m = errors[msgKey] as any;

    if (!m) return null;

    return <MensagemErro error={true} mensagem={Array.isArray(m) ? m : [m]} />;
  };
};

export default MensagemErro;
