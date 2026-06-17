
// Os arquivos zCamposAlterar.tsx e zCamposCriar.tsx foram criados para centralizar a lógica de manipulação de campos e mensagens de erro
// Mas não estão mais em uso, porque a lógica de validação e manipulação de campos foi integrada 
// diretamente nos componentes Alterar.tsx e Criar.tsx para simplificar a estrutura do código e 
// evitar abstrações desnecessárias.

/*

import React from "react";
import { FUNCAO } from "../../services/2-funcao/constants/funcao.constants";
import type { Funcao } from "../../type/2-funcao";

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

export const getInputClass = (errors: any, field: keyof Funcao): string => {
  if (!errors) return "form-control app-label mt-2";
  const hasErrors = !!errors[field];
  if (hasErrors) return "form-control is-invalid app-label input-error mt-2";
  return "form-control app-label mt-2";
};

export const createHandleChangeField = (
  setModel: React.Dispatch<React.SetStateAction<Funcao>>,
  setErrors: React.Dispatch<React.SetStateAction<any>>
) => {
  return (name: keyof Funcao, value: string) => {
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
    name: keyof Funcao,
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const messages: string[] = [];

    switch (name) {
      case "codigoFuncao":
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

    setErrors((prev: any) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${String(name)}Mensagem`]: messages.length > 0 ? messages : undefined,
    }));
  };
};

export const createShowMensagem = (errors: any) => {
  return (field: keyof Funcao) => {
    const msgKey = `${String(field)}Mensagem`;
    const m = errors[msgKey] as any;

    if (!m) return null;

    return <MensagemErro error={true} mensagem={Array.isArray(m) ? m : [m]} />;
  };
};

export default MensagemErro;

*/