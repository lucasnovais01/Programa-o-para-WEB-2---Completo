import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiPostUsuario } from "../api/api.usuario";
import { USUARIO } from "../constants/usuario.constants";
import type { ErrosUsuario, Usuario } from "../type/Usuario";

// ✅ importa o hook do ResourcesProviders para pegar a URL do backend
import { useResources } from "../../providers/ResourcesProviders";

export const useCriar = () => {
  const [model, setModel] = useState<Usuario>(USUARIO.DADOS_INCIAIS);
  const [errors, setErrors] = useState<ErrosUsuario>({});
  const navigate = useNavigate();

  // ✅ pega getEndpoint do contexto — fornece URL real do backend
  const { getEndpoint } = useResources();

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
      case USUARIO.FIELDS.NOME:
        if (!value || String(value).trim().length === 0)
          messages.push(USUARIO.INPUT_ERROR.NOME.BLANK);
        if (String(value).length > 0 && String(value).length < 6)
          messages.push(USUARIO.INPUT_ERROR.NOME.MIN_LEN);
        if (String(value).length > 100)
          messages.push(USUARIO.INPUT_ERROR.NOME.MAX_LEN);
        break;

      case USUARIO.FIELDS.SOBRENOME:
        if (!value || String(value).trim().length === 0)
          messages.push(USUARIO.INPUT_ERROR.SOBRENOME.BLANK);
        if (String(value).length > 0 && String(value).length < 6)
          messages.push(USUARIO.INPUT_ERROR.SOBRENOME.MIN_LEN);
        if (String(value).length > 100)
          messages.push(USUARIO.INPUT_ERROR.SOBRENOME.MAX_LEN);
        break;

      case USUARIO.FIELDS.EMAIL:
        if (!value || String(value).trim().length === 0)
          messages.push(USUARIO.INPUT_ERROR.EMAIL.BLANK);
        break;

      case USUARIO.FIELDS.SENHA:
        if (!value || String(value).trim().length === 0)
          messages.push(USUARIO.INPUT_ERROR.SENHA.BLANK);
        if (String(value).length < 6)
          messages.push(USUARIO.INPUT_ERROR.SENHA.MIN_LEN);
        break;

      case USUARIO.FIELDS.CONFIRMAR_SENHA:
        if (!value || String(value).trim().length === 0)
          messages.push(USUARIO.INPUT_ERROR.CONFIRMAR_SENHA.BLANK);
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

    const nomeUsuarioMessages = [];
    if (!model.nomeUsuario || model.nomeUsuario.trim().length === 0)
      nomeUsuarioMessages.push(USUARIO.INPUT_ERROR.NOME.BLANK);
    if (model.nomeUsuario) {
      if (model.nomeUsuario.length > 0 && model.nomeUsuario.length < 6)
        nomeUsuarioMessages.push(USUARIO.INPUT_ERROR.NOME.MIN_LEN);
      if (model.nomeUsuario.length > 100)
        nomeUsuarioMessages.push(USUARIO.INPUT_ERROR.NOME.MAX_LEN);
    }
    if (nomeUsuarioMessages.length > 0) {
      newErrors.nomeUsuario = true;
      newErrors.nomeUsuarioMensagem = nomeUsuarioMessages;
      isFormValid = false;
    }

    const sobrenomeUsuarioMessages = [];
    if (!model.sobrenomeUsuario || model.sobrenomeUsuario.trim().length === 0)
      sobrenomeUsuarioMessages.push(USUARIO.INPUT_ERROR.SOBRENOME.BLANK);
    if (model.sobrenomeUsuario) {
      if (model.sobrenomeUsuario.length > 0 && model.sobrenomeUsuario.length < 6)
        sobrenomeUsuarioMessages.push(USUARIO.INPUT_ERROR.SOBRENOME.MIN_LEN);
      if (model.sobrenomeUsuario.length > 100)
        sobrenomeUsuarioMessages.push(USUARIO.INPUT_ERROR.SOBRENOME.MAX_LEN);
    }
    if (sobrenomeUsuarioMessages.length > 0) {
      newErrors.sobrenomeUsuario = true;
      newErrors.sobrenomeUsuarioMensagem = sobrenomeUsuarioMessages;
      isFormValid = false;
    }

    const emailUsuarioMessages = [];
    if (!model.emailUsuario || model.emailUsuario.trim().length === 0)
      emailUsuarioMessages.push(USUARIO.INPUT_ERROR.EMAIL.BLANK);
    if (emailUsuarioMessages.length > 0) {
      newErrors.emailUsuario = true;
      newErrors.emailUsuarioMensagem = emailUsuarioMessages;
      isFormValid = false;
    }

    const senhaUsuarioMessages = [];
    if (!model.senhaUsuario || model.senhaUsuario.trim().length === 0)
      senhaUsuarioMessages.push(USUARIO.INPUT_ERROR.SENHA.BLANK);
    if (model.senhaUsuario) {
      if (model.senhaUsuario.length < 6)
        senhaUsuarioMessages.push(USUARIO.INPUT_ERROR.SENHA.MIN_LEN);
      if (model.senhaUsuario.length > 100)
        senhaUsuarioMessages.push(USUARIO.INPUT_ERROR.SENHA.MAX_LEN);
    }
    if (senhaUsuarioMessages.length > 0) {
      newErrors.senhaUsuario = true;
      newErrors.senhaUsuarioMensagem = senhaUsuarioMessages;
      isFormValid = false;
    }

    const confirmarSenhaUsuarioMessages = [];
    if (!model.confirmarSenhaUsuario || model.confirmarSenhaUsuario.trim().length === 0)
      confirmarSenhaUsuarioMessages.push(USUARIO.INPUT_ERROR.CONFIRMAR_SENHA.BLANK);
    if (model.confirmarSenhaUsuario && model.senhaUsuario !== model.confirmarSenhaUsuario)
      confirmarSenhaUsuarioMessages.push(USUARIO.INPUT_ERROR.CONFIRMAR_SENHA.NOT_MATCH);
    if (confirmarSenhaUsuarioMessages.length > 0) {
      newErrors.confirmarSenhaUsuario = true;
      newErrors.confirmarSenhaUsuarioMensagem = confirmarSenhaUsuarioMessages;
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      console.log("Erro na digitação dos dados");
      return;
    }

    // ✅ pega a URL do backend — sem id = endpoint de criar (POST)
    const url = getEndpoint('usuario');
    if (!url) {
      console.warn('URL do backend não disponível');
      return;
    }

    try {
      // ✅ await corrigido — antes navegava antes da resposta chegar
      // ✅ confirmarSenhaUsuario não é enviado ao backend
      const { confirmarSenhaUsuario, ...dadosParaEnviar } = model;
      await apiPostUsuario(url, dadosParaEnviar as Usuario);
      navigate(ROTA.USUARIO.LISTAR);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROTA.USUARIO.LISTAR);
  };

  return {
    model,
    errors,
    handleChangeField,
    validateField,
    validarFormulario,
    onSubmitForm,
    handleCancel,
  };
};