import React from "react";
import { QUARTO } from "../../services/5-quarto/constants/quarto.constants";
import type { Quarto } from "../../type/5-quarto";

// ============================================================
// Classe CSS para inputs com base em erros
// ============================================================
export const getInputClass = (
  errors: any | undefined,
  field: string
): string => {
  if (!errors) return "form-control app-label mt-2";
  if (errors[field])
    return "form-control is-invalid app-label input-error mt-2";
  return "form-control app-label mt-2";
};

// ============================================================
// Factory: Criar função para mudança de campo
// ============================================================
export const createHandleChangeField = (
  setModel: React.Dispatch<React.SetStateAction<Quarto>>,
  setErrors: React.Dispatch<React.SetStateAction<any>>
) => {
  return (name: keyof Quarto, value: any) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };
};

// ============================================================
// Factory: Criar função para validação de campo
// ============================================================
export const createValidateField = (
  setErrors: React.Dispatch<React.SetStateAction<any>>
) => {
  return (name: keyof Quarto, e?: any) => {
    const value = e?.target?.value;
    const errs: any = {};

    if (name === QUARTO.FIELDS.CODIGO_TIPO_QUARTO) {
      const n = Number(value);
      if (!n || isNaN(n) || n <= 0) {
        errs[name] = "Tipo de quarto obrigatório";
      }
    }

    if (name === QUARTO.FIELDS.NUMERO) {
      const n = Number(value);
      if (!n || isNaN(n) || n <= 0) {
        errs[name] = "Número do quarto inválido";
      }
    }

    if (name === QUARTO.FIELDS.ANDAR) {
      const n = Number(value);
      if (isNaN(n) || n < 0 || n > 5) {
        errs[name] = "Andar deve ser entre 0 e 5";
      }
    }

    if (name === QUARTO.FIELDS.STATUS) {
      const opts = QUARTO.STATUS_OPTIONS.map((o) => o.value);
      if (!opts.includes(value)) {
        errs[name] = "Status inválido";
      }
    }

    setErrors((prev: any) => ({ ...prev, ...errs }));
  };
};

// ============================================================
// Factory: Criar função para exibição de mensagens
// ============================================================
export const createShowMensagem = (errors: any) => {
  return (field: string) => {
    if (!errors || !errors[field]) return null;
    return <div className="mensagemErro">{errors[field]}</div>;
  };
};

export default {};
