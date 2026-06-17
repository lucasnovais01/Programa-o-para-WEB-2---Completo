/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FocusEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Hospede } from "../../../type/1-hospede";
import type { Funcao } from "../../../type/2-funcao";
import { apiGetHospedes } from "../../1-hospede/api/api.hospede";
import { apiGetFuncoes } from "../../2-funcao/api/api.funcao";
import { ROTA } from "../../router/url";
import { apiPostFuncionario } from "../api/api.funcionario";
import { FUNCIONARIO } from "../constants/funcionario.constants";
import type { Funcionario } from "../type/funcionario";

type ErrosFuncionario = Record<string, any>;

export const useCriar = () => {
  const [model, setModel] = useState<Funcionario>(
    FUNCIONARIO.DADOS_INICIAIS as Funcionario,
  );
  const [errors, setErrors] = useState<ErrosFuncionario>({});
  const [loading, setLoading] = useState(false);
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [funcoes, setFuncoes] = useState<Funcao[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const resHospedes = await apiGetHospedes(1, 100);
        const dadosHospedes = resHospedes?.data?.dados;
        const hospedeList = Array.isArray(dadosHospedes)
          ? dadosHospedes
          : Array.isArray(dadosHospedes?.content)
          ? dadosHospedes.content
          : [];

        setHospedes(hospedeList);

        const resFuncoes = await apiGetFuncoes(1, 100);
        const dadosFuncoes = resFuncoes?.data?.dados;
        const funcaoList = Array.isArray(dadosFuncoes)
          ? dadosFuncoes
          : Array.isArray(dadosFuncoes?.content)
          ? dadosFuncoes.content
          : [];

        setFuncoes(funcaoList);
      } catch (error: unknown) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const handleChangeField = (
    name: keyof Funcionario,
    value: string | number | undefined,
  ) => {
    setModel((prev: Funcionario) => ({
      ...(prev ?? {}),
      [name]: value,
    } as Funcionario));

    setErrors((prev: ErrosFuncionario) => ({
      ...prev,
      [name]: undefined,
      [`${String(name)}Mensagem`]: undefined,
    }));
  };

  const validateField = (
    name: keyof Funcionario,
    e: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const messages: string[] = [];

    switch (name) {
      case FUNCIONARIO.FIELDS.ID:
        if (!value || value === "0")
          messages.push("Hóspede é obrigatório");
        break;

      case FUNCIONARIO.FIELDS.NOME_LOGIN:
        if (!value || String(value).trim().length === 0)
          messages.push(FUNCIONARIO.INPUT_ERROR.NOME_LOGIN.BLANK);
        break;

      case FUNCIONARIO.FIELDS.SENHA:
        if (!value || String(value).trim().length === 0)
          messages.push(FUNCIONARIO.INPUT_ERROR.SENHA.BLANK);
        break;

      case FUNCIONARIO.FIELDS.CODIGO_FUNCAO:
        if (!value || value === "")
          messages.push(FUNCIONARIO.INPUT_ERROR.CODIGO_FUNCAO.BLANK);
        break;

      case FUNCIONARIO.FIELDS.DATA_CONTRATACAO:
        if (!value || String(value).trim().length === 0)
          messages.push(FUNCIONARIO.INPUT_ERROR.DATA_CONTRATACAO.BLANK);
        break;

      default:
        break;
    }

    setErrors((prev: ErrosFuncionario) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${String(name)}Mensagem`]:
        messages.length > 0 ? messages : undefined,
    }));
  };

  const validarFormulario = (): boolean => {
    const newErrors: ErrosFuncionario = {};
    let isFormValid = true;

    if (!model.idUsuario || model.idUsuario === 0) {
      newErrors.idUsuario = true;
      newErrors.idUsuarioMensagem = ["Hóspede é obrigatório"];
      isFormValid = false;
    }

    if (!model.nomeLogin || String(model.nomeLogin).trim().length === 0) {
      newErrors.nomeLogin = true;
      newErrors.nomeLoginMensagem = ["Nome de login é obrigatório"];
      isFormValid = false;
    }

    if (!model.senha || String(model.senha).trim().length === 0) {
      newErrors.senha = true;
      newErrors.senhaMensagem = ["Senha é obrigatória"];
      isFormValid = false;
    }

    if (!model.codigoFuncao || model.codigoFuncao === 0) {
      newErrors.codigoFuncao = true;
      newErrors.codigoFuncaoMensagem = [
        "Código da função é obrigatório",
      ];
      isFormValid = false;
    }

    if (!model.dataContratacao || String(model.dataContratacao).trim().length === 0) {
      newErrors.dataContratacao = true;
      newErrors.dataContratacaoMensagem = [
        "Data de contratação é obrigatória",
      ];
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const getInputClass = (field?: keyof ErrosFuncionario): string => {
    if (field && errors[field])
      return "form-control is-invalid app-label input-error mt-2";
    return "form-control app-label mt-2";
  };

  const showMensagem = (field: keyof Funcionario) => {
    const msgKey = `${String(field)}Mensagem`;
    const messages = errors[msgKey] as string[] | undefined;
    if (!messages || messages.length === 0) return null;

    return (
      <div className="input-error-messages">
        {messages.map((message, index) => (
          <div
            className="invalid-feedback"
            style={{ display: "block" }}
            key={index}
          >
            {message}
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
      const funcionarioToSend: Funcionario = {
        idUsuario: Number(model.idUsuario),
        nomeLogin: model.nomeLogin,
        senha: model.senha,
        codigoFuncao: Number(model.codigoFuncao ?? 0),
        dataContratacao: model.dataContratacao,
        ativo: Number(model.ativo ?? 1),
      };

      await apiPostFuncionario(funcionarioToSend);

      navigate(ROTA.FUNCIONARIO.LISTAR, {
        state: {
          toast: {
            message: "Funcionário criado com sucesso!",
            type: "success",
          },
        },
      });
    } catch (error: unknown) {
      console.error(error);
      alert("Erro ao criar funcionário");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate(ROTA.FUNCIONARIO.LISTAR);
  };

  return {
    model,
    errors,
    loading,
    hospedes,
    funcoes,
    handleChangeField,
    validateField,
    showMensagem,
    getInputClass,
    onSubmitForm,
    onCancel,
  };
};
