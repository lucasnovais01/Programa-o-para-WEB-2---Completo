import { useState } from "react";
import { apiPostUsuario } from "../api/api.usuario";
import { USUARIO } from "../constants/usuario.constants";
import type { Usuario, ErrosUsuario } from "../type/Usuario";

export const useCriar = () => {
  const [model, setModel] = useState<Usuario>(USUARIO.DADOS_INCIAIS);

  const [errors, setErrors] = useState<ErrosUsuario>({});

  const handleChangeField = (name: keyof Usuario, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (
    name: keyof Usuario,
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    let messages: string[] = [];
    const value = model[name];

    switch (name) {
      case USUARIO.FIELDS.ID:
        if (!value) messages.push(USUARIO.INPUT_ERROR.ID.BLANK);
        if (value && typeof value !== "string")
          messages.push(USUARIO.INPUT_ERROR.ID.STRING);
        break;

      case USUARIO.FIELDS.NOME:
        if (!value || String(value).trim().length === 0) {
          messages.push(USUARIO.INPUT_ERROR.NOME.BLANK);
        }
        if (String(value).length > 0 && String(value).length < 6) {
          messages.push(USUARIO.INPUT_ERROR.NOME.MIN_LEN);
        }
        if (String(value).length > 100) {
          messages.push(USUARIO.INPUT_ERROR.NOME.MAX_LEN);
        }
        break;

        // Campos Sobrenome, Email e Senha podem ter validações adicionais, como formato de email, força da senha, etc.

        case USUARIO.FIELDS.SOBRENOME:
          if (!value || String(value).trim().length === 0) {
            messages.push(USUARIO.INPUT_ERROR.SOBRENOME.BLANK);
          }
          if (String(value).length > 0 && String(value).length < 6) {
            messages.push(USUARIO.INPUT_ERROR.SOBRENOME.MIN_LEN);
          }
          if (String(value).length > 100) {
            messages.push(USUARIO.INPUT_ERROR.SOBRENOME.MAX_LEN);
          }
          break;

        case USUARIO.FIELDS.EMAIL:
          if (!value || String(value).trim().length === 0) {
            messages.push(USUARIO.INPUT_ERROR.EMAIL.BLANK);
          }
          break;

        case USUARIO.FIELDS.SENHA:
          if (!value || String(value).trim().length === 0) {
            messages.push(USUARIO.INPUT_ERROR.SENHA.BLANK);
          }
          if (String(value).length < 6) {
            messages.push(USUARIO.INPUT_ERROR.SENHA.MIN_LEN);
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
    const newErrors: ErrosUsuario = {};
    let isFormValid = true;

    const idUsuarioMessages = [];

    if (!model.idUsuario) {
      idUsuarioMessages.push(USUARIO.INPUT_ERROR.ID.VALID);
    }
    if (model.idUsuario && typeof model.idUsuario !== "string") {
      idUsuarioMessages.push(USUARIO.INPUT_ERROR.ID.STRING);
    }
    if (idUsuarioMessages.length > 0) {
      newErrors.idUsuario = true;
      newErrors.idUsuarioMensagem = idUsuarioMessages;
      isFormValid = false;
    }

    const nomeUsuarioMessages = [];

    if (!model.nomeUsuario || model.nomeUsuario.trim().length === 0) {
      nomeUsuarioMessages.push(USUARIO.INPUT_ERROR.NOME.BLANK);
    }
    if (model.nomeUsuario) {
      if (model.nomeUsuario.length > 0 && model.nomeUsuario.length < 6) {
        nomeUsuarioMessages.push(USUARIO.INPUT_ERROR.NOME.MIN_LEN);
      }
      if (model.nomeUsuario.length > 100) {
        nomeUsuarioMessages.push(USUARIO.INPUT_ERROR.NOME.MAX_LEN);
      }
    }
    if (nomeUsuarioMessages.length > 0) {
      newErrors.nomeUsuario = true;
      newErrors.nomeUsuarioMensagem = nomeUsuarioMessages;
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const onSubmitForm = async (e: any) => {
    // não deixa executar o processo normal
    e.preventDefault();

    if (!validarFormulario()) {
      console.log("Erro na digitaçãod os dados ");
      return;
    }

    if (!model) {
      return;
    }

    try {
      const response = apiPostUsuario(model);
      console.log(response);
    } catch (error: any) {
      console.log(error);
    }
  };

  return {
    model,
    errors,
    handleChangeField,
    validateField,
    validarFormulario,
    onSubmitForm,
  };
};
