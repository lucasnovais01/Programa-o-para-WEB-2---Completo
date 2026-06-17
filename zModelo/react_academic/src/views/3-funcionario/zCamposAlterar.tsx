
import React from "react";
import { FUNCIONARIO } from "../../services/3-funcionario/constants/funcionario.constants";
import type { Funcionario } from "../../services/3-funcionario/type/funcionario";

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

export const getInputClass = (
  errors: any,
  field: keyof Funcionario
): string => {
  if (!errors) return "form-control app-label mt-2";
  const hasErrors = !!errors[field];
  if (hasErrors) return "form-control is-invalid app-label input-error mt-2";
  return "form-control app-label mt-2";
};

export const createHandleChangeField = (
  setModel: React.Dispatch<React.SetStateAction<Funcionario | null>>,
  setErrors: React.Dispatch<React.SetStateAction<any>>
) => {
  return (
    name: keyof Funcionario,
    value: string | number | undefined,
  ) => {
    setModel((prev) => (prev ? { ...prev, [name]: value } : prev));
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
    name: keyof Funcionario,
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const messages: string[] = [];

    switch (name) {
      case FUNCIONARIO.FIELDS.NOME_LOGIN:
        if (!value || String(value).trim().length === 0)
          messages.push("Nome de login é obrigatório");
        if (value && String(value).length < 3)
          messages.push("Nome de login deve ter no mínimo 3 caracteres");
        if (value && String(value).length > 50)
          messages.push("Nome de login deve ter no máximo 50 caracteres");
        break;

      case FUNCIONARIO.FIELDS.SENHA:
        if (!value || String(value).trim().length === 0)
          messages.push("Senha é obrigatória");
        if (value && String(value).length < 6)
          messages.push("Senha deve ter no mínimo 6 caracteres");
        if (value && String(value).length > 50)
          messages.push("Senha deve ter no máximo 50 caracteres");
        break;

      case FUNCIONARIO.FIELDS.EMAIL:
        if (value && String(value).length > 0) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(String(value)))
            messages.push("Email inválido");
        }
        break;

      case FUNCIONARIO.FIELDS.CODIGO_FUNCAO:
        if (!value) messages.push("Função é obrigatória");
        break;

      case FUNCIONARIO.FIELDS.DATA_CONTRATACAO:
        if (!value) messages.push("Data de contratação é obrigatória");
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
  return (field: keyof Funcionario) => {
    const msgKey = `${String(field)}Mensagem`;
    const m = errors[msgKey] as any;

    if (!m) return null;

    return <MensagemErro error={true} mensagem={Array.isArray(m) ? m : [m]} />;
  };
};

export default MensagemErro;