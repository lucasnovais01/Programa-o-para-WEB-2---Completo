import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiGetUsuario, apiPutUsuario } from "../api/api.usuario";
import {
  USUARIO,
  fieldsUsuario,
  mapaCampoParaMensagem,
} from "../constants/usuario.constants";
import type { ErrosUsuario, Usuario } from "../type/Usuario";

interface BuscarUsuarioPorIdProps {
  usuario: Usuario | null;
  errosUsuario: ErrosUsuario | null | undefined;
}

export const useAlterar = () => {
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const [model, setModel] = useState<Usuario>(USUARIO.DADOS_INCIAIS);
  const [errors, setErrors] = useState<ErrosUsuario | null>(null);
  const navigate = useNavigate();

  const setServerErrorsUsuario = (
    serverErros: Partial<Record<keyof Usuario, string[]>> | null,
  ): ErrosUsuario | null => {
    if (!serverErros) {
      return null;
    }

    const newErrors: ErrosUsuario = {};

    (Object.keys(serverErros) as (keyof Usuario)[]).forEach((field) => {
      const mensagens = serverErros[field];

      if (mensagens && mensagens.length > 0) {
        newErrors[field] = true;

        const msgKey = `${String(field)}Mensagem`;

        (newErrors as any)[msgKey] = [mensagens];
      }
    });
    return Object.keys(newErrors).length > 0 ? newErrors : null;
  };

  const validarCamposVaziosUsuario = (
    usuario: Usuario,
  ): Partial<Record<keyof Usuario, string[]>> | null => {
    const erros: Partial<Record<keyof Usuario, string[]>> = {};
    fieldsUsuario.forEach((field) => {
      const valor = usuario[field];
      const isEmpty =
        valor === undefined ||
        valor === null ||
        (typeof valor === "string" && valor.trim() === "");

      if (isEmpty) {
        const keyMessage = mapaCampoParaMensagem[field];
        const mensagemErro = USUARIO.INPUT_ERROR[keyMessage]?.BLANK;
        const mensagem = mensagemErro ?? `O campo ${field} é obrigatório`;

        erros[field] = [mensagem];
      }
    });
    return Object.keys(erros).length > 0 ? erros : null;
  };

  const buscarUsuarioPorId = async (
    idUsuario: string,
  ): Promise<BuscarUsuarioPorIdProps | null> => {
    let usuario: Usuario | null = null;
    let errosUsuario: ErrosUsuario | null = null;
    try {
      const response = await apiGetUsuario(idUsuario);
      if (response.data.dados) {
        usuario = response.data.dados;
        if (usuario) {
          const errosValidacao = validarCamposVaziosUsuario(usuario);
          if (errosValidacao) {
            errosUsuario = setServerErrorsUsuario(errosValidacao);
          }
        }
      }
      return {
        usuario,
        errosUsuario,
      };
    } catch (error: any) {
      console.log(error);
    }
    return null;
  };

  useEffect(() => {
    async function getUsuario() {
      try {
        if (idUsuario) {
          const response = await buscarUsuarioPorId(idUsuario);
          if (response?.usuario) {
            setModel(response.usuario);
            setErrors(response?.errosUsuario ?? null);
            if (response?.errosUsuario) {
              console.log("Erros existentes no registro do usuário");
            }
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    }

    getUsuario();
  }, [idUsuario]);

  const handleChangeField = (name: keyof Usuario, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    console.log(model);
  };

  const validateField = (
    name: keyof Usuario,
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    let messages: string[] = [];
    const value = model[name];

    switch (name) {
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
        if (String(value).length > 0 && String(value).length < 6) {
          messages.push(USUARIO.INPUT_ERROR.SENHA.MIN_LEN);
        }
        if (String(value).length > 100) {
          messages.push(USUARIO.INPUT_ERROR.SENHA.MAX_LEN);
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

    const sobrenomeUsuarioMessages = [];

    if (!model.sobrenomeUsuario || model.sobrenomeUsuario.trim().length === 0) {
      sobrenomeUsuarioMessages.push(USUARIO.INPUT_ERROR.SOBRENOME.BLANK);
    }
    if (model.sobrenomeUsuario) {
      if (model.sobrenomeUsuario.length > 0 && model.sobrenomeUsuario.length < 6) {
        sobrenomeUsuarioMessages.push(USUARIO.INPUT_ERROR.SOBRENOME.MIN_LEN);
      }
      if (model.sobrenomeUsuario.length > 100) {
        sobrenomeUsuarioMessages.push(USUARIO.INPUT_ERROR.SOBRENOME.MAX_LEN);
      }
    }
    if (sobrenomeUsuarioMessages.length > 0) {
      newErrors.sobrenomeUsuario = true;
      newErrors.sobrenomeUsuarioMensagem = sobrenomeUsuarioMessages;
      isFormValid = false;
    }

    const emailUsuarioMessages = [];

    if (!model.emailUsuario || model.emailUsuario.trim().length === 0) {
      emailUsuarioMessages.push(USUARIO.INPUT_ERROR.EMAIL.BLANK);
    }
    if (emailUsuarioMessages.length > 0) {
      newErrors.emailUsuario = true;
      newErrors.emailUsuarioMensagem = emailUsuarioMessages;
      isFormValid = false;
    }

    const senhaUsuarioMessages = [];

    if (!model.senhaUsuario || model.senhaUsuario.trim().length === 0) {
      senhaUsuarioMessages.push(USUARIO.INPUT_ERROR.SENHA.BLANK);
    }
    if (model.senhaUsuario) {
      if (model.senhaUsuario.length > 0 && model.senhaUsuario.length < 6) {
        senhaUsuarioMessages.push(USUARIO.INPUT_ERROR.SENHA.MIN_LEN);
      }
      if (model.senhaUsuario.length > 100) {
        senhaUsuarioMessages.push(USUARIO.INPUT_ERROR.SENHA.MAX_LEN);
      }
    }
    if (senhaUsuarioMessages.length > 0) {
      newErrors.senhaUsuario = true;
      newErrors.senhaUsuarioMensagem = senhaUsuarioMessages;
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const getInputClass = (name: keyof Usuario): string => {
    if (errors) {
      if (errors[name]) {
        return "form-control is-invalid app-label input-error mt-2 ";
      }
    }
    return "form-control app-label mt-2";
  };

  const onSubmitForm = async (e: React.FormEvent, url: string) => {
    e.preventDefault();

    if (!idUsuario || !model) {
      return;
    }

    if (!validarFormulario()) {
      console.log("erros nos dados do formulário");
      return;
    }

    try {
      const response = apiPutUsuario(idUsuario, model, url);
      console.log(response);
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
    onSubmitForm,
    handleCancel,
    getInputClass,
  };
};
