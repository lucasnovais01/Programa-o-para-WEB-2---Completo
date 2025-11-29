// iremos na view, e vamos pegar tudo que for validação

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Cidade, ErrosCidade } from "../type/Cidade";
import { CIDADE } from "../constants/cidade.constants";
import { apiPostCidade } from "../api/api.cidade";
import { ROTA } from "../../router/url";

export const useCriar = () => {

  // hook para monitorar o estado do codigo
  // assincrono
  const [model, setModel] = useState<Cidade>(CIDADE.DADOS_INCIAIS);

  const [errors, setErrors] = useState<ErrosCidade>({});

  const navigate = useNavigate();

  const handleChangeField = (name: keyof Cidade, value: string) => {
    setModel((prev: any) => ({ ...prev, [name]: value }));

    setErrors((prev: any) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (
    name: keyof Cidade,
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    let messages: string[] = [];
    const value = model[name];

    switch (name) {
      case CIDADE.FIELDS.CODIGO:
        if (!value) messages.push(CIDADE.INPUT_ERROR.CODIGO.BLANK);
        if (value && typeof value !== "string")
          messages.push(CIDADE.INPUT_ERROR.CODIGO.STRING);
        break;
      case CIDADE.FIELDS.NOME:
        if (!value || String(value).trim().length === 0) {
          messages.push(CIDADE.INPUT_ERROR.NOME.BLANK);
        }
        if (String(value).length > 0 && String(value).length < 6) {
          messages.push(CIDADE.INPUT_ERROR.NOME.MIN_LEN);
        }
        if (String(value).length > 100) {
          messages.push(CIDADE.INPUT_ERROR.NOME.MAX_LEN);
        }
        break;
    }
    setErrors((prev: any) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${name}Mensagem`]: messages.length > 0 ? messages : undefined,
    }));
  };

  const validarFormulario = (): boolean => {
    const newErrors: ErrosCidade = {};
    let isFormValid = true;

    const codCidadeMessages = [];

    if (!model.codCidade) {
      codCidadeMessages.push(CIDADE.INPUT_ERROR.CODIGO.VALID);
    }
    if (model.codCidade && typeof model.codCidade !== "string") {
      codCidadeMessages.push(CIDADE.INPUT_ERROR.CODIGO.STRING);
    }
    if (codCidadeMessages.length > 0) {
      newErrors.codCidade = true;
      newErrors.codCidadeMensagem = codCidadeMessages;
      isFormValid = false;
    }

    const nomeCidadeMessages = [];

    if (!model.nomeCidade || model.nomeCidade.trim().length === 0) {
      nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.BLANK);
    }
    if (model.nomeCidade) {
      if (model.nomeCidade.length > 0 && model.nomeCidade.length < 6) {
        nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.MIN_LEN);
      }
      if (model.nomeCidade.length > 100) {
        nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.MAX_LEN);
      }
    }
    if (nomeCidadeMessages.length > 0) {
      newErrors.nomeCidade = true;
      newErrors.nomeCidadeMensagem = nomeCidadeMessages;
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };



//

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
      const response = apiPostCidade(model);
      console.log(response);
      navigate(ROTA.CIDADE.LISTAR);
    } catch (error: any) {
      console.log(error);
    }
  };

///

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROTA.CIDADE.LISTAR);
  };



  return {
    model,
    errors,
    handleChangeField,
    validateField,
    validarFormulario,
    onSubmitForm,
    handleCancel
  }
};


