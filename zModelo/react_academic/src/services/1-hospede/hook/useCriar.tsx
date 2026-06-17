/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type FocusEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../../router/url";
import { apiPostHospede } from "../api/api.hospede";
import { HOSPEDE } from "../constants/hospede.constants";
import type { ErrosHospede, Hospede } from "../type/hospede";

export const useCriar = () => {
  const [model, setModel] = useState<Hospede>(
    HOSPEDE.DADOS_INICIAIS as unknown as Hospede,
  );
  const [errors, setErrors] = useState<ErrosHospede>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangeField = (name: keyof Hospede, value: string) => {
    setModel((prev) =>
      ({
        ...(prev ?? (HOSPEDE.DADOS_INICIAIS as unknown as Hospede)),
        [name]:
          name === HOSPEDE.FIELDS.TIPO || name === HOSPEDE.FIELDS.ATIVO
            ? Number(value)
            : value,
      } as unknown as Hospede),
    );

    setErrors((prev) =>
      ({
        ...prev,
        [name]: undefined,
        [`${String(name)}Mensagem`]: undefined,
      } as unknown as ErrosHospede),
    );
  };

  const validateField = (
    name: keyof Hospede,
    e: FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const value = (e.target as HTMLInputElement).value;
    const messages: string[] = [];

    switch (name) {
      case HOSPEDE.FIELDS.NOME:
        if (!value || String(value).trim().length === 0)
          messages.push(HOSPEDE.INPUT_ERROR.NOME.BLANK);
        if (value && String(value).length > 0 && String(value).length < 5)
          messages.push(HOSPEDE.INPUT_ERROR.NOME.MIN_LEN);
        if (value && String(value).length > 100)
          messages.push(HOSPEDE.INPUT_ERROR.NOME.MAX_LEN);
        break;

      case HOSPEDE.FIELDS.CPF:
        if (!value) messages.push(HOSPEDE.INPUT_ERROR.CPF.BLANK);
        if (value && !/^[0-9]+$/.test(value))
          messages.push(HOSPEDE.INPUT_ERROR.CPF.PATTERN);
        if (value && value.length !== 11)
          messages.push(HOSPEDE.INPUT_ERROR.CPF.EXACT_LEN);
        break;

      case HOSPEDE.FIELDS.RG:
        if (value) {
          if (value.length < 7)
            messages.push(HOSPEDE.INPUT_ERROR.RG.MIN_LEN);
          if (value.length > 9)
            messages.push(HOSPEDE.INPUT_ERROR.RG.MAX_LEN);
        }
        break;

      case HOSPEDE.FIELDS.SEXO:
        if (!value) messages.push(HOSPEDE.INPUT_ERROR.SEXO.BLANK);
        break;

      case HOSPEDE.FIELDS.DATA_NASCIMENTO:
        if (!value) {
          messages.push(HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.BLANK);
        } else {
          const d = new Date(value);
          if (isNaN(d.getTime()))
            messages.push(HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.VALID);
          else if (d >= new Date())
            messages.push(HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.PAST);
          else {
            const age = new Date().getFullYear() - d.getFullYear();
            if (age < 18)
              messages.push(HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.AGE_MIN);
          }
        }
        break;

      case HOSPEDE.FIELDS.EMAIL:
        if (value && !/^\S+@\S+\.\S+$/.test(value))
          messages.push(HOSPEDE.INPUT_ERROR.EMAIL.VALID);
        break;

      case HOSPEDE.FIELDS.TELEFONE:
        if (value && value.replace(/[^0-9]/g, "").length < 10)
          messages.push(HOSPEDE.INPUT_ERROR.TELEFONE.MIN_LEN);
        break;

      case HOSPEDE.FIELDS.TIPO:
        if (value === "" || value === undefined)
          messages.push(HOSPEDE.INPUT_ERROR.TIPO.BLANK);
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
      } as unknown as ErrosHospede),
    );
  };

  const validarFormulario = (): boolean => {
    const newErrors: ErrosHospede = {};
    let isFormValid = true;

    const valores = {
      nomeHospede: model.nomeHospede,
      cpf: model.cpf,
      rg: model.rg,
      sexo: model.sexo,
      dataNascimento: model.dataNascimento,
      email: model.email,
      telefone: model.telefone,
      tipo: model.tipo,
    } as const;

    if (!valores.nomeHospede || String(valores.nomeHospede).trim().length === 0) {
      newErrors.nomeHospede = true;
      newErrors.nomeHospedeMensagem = [HOSPEDE.INPUT_ERROR.NOME.BLANK];
      isFormValid = false;
    }

    if (!valores.cpf) {
      newErrors.cpf = true;
      newErrors.cpfMensagem = [HOSPEDE.INPUT_ERROR.CPF.BLANK];
      isFormValid = false;
    } else if (!/^[0-9]+$/.test(String(valores.cpf))) {
      newErrors.cpf = true;
      newErrors.cpfMensagem = [HOSPEDE.INPUT_ERROR.CPF.PATTERN];
      isFormValid = false;
    } else if (String(valores.cpf).length !== 11) {
      newErrors.cpf = true;
      newErrors.cpfMensagem = [HOSPEDE.INPUT_ERROR.CPF.EXACT_LEN];
      isFormValid = false;
    }

    if (valores.rg && String(valores.rg).length < 7) {
      newErrors.rg = true;
      newErrors.rgMensagem = [HOSPEDE.INPUT_ERROR.RG.MIN_LEN];
      isFormValid = false;
    } else if (valores.rg && String(valores.rg).length > 9) {
      newErrors.rg = true;
      newErrors.rgMensagem = [HOSPEDE.INPUT_ERROR.RG.MAX_LEN];
      isFormValid = false;
    }

    if (!valores.sexo) {
      newErrors.sexo = true;
      newErrors.sexoMensagem = [HOSPEDE.INPUT_ERROR.SEXO.BLANK];
      isFormValid = false;
    }

    if (!valores.dataNascimento) {
      newErrors.dataNascimento = true;
      newErrors.dataNascimentoMensagem = [
        HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.BLANK,
      ];
      isFormValid = false;
    } else {
      const d = new Date(String(valores.dataNascimento));
      if (isNaN(d.getTime())) {
        newErrors.dataNascimento = true;
        newErrors.dataNascimentoMensagem = [
          HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.VALID,
        ];
        isFormValid = false;
      } else if (d >= new Date()) {
        newErrors.dataNascimento = true;
        newErrors.dataNascimentoMensagem = [
          HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.PAST,
        ];
        isFormValid = false;
      } else {
        const age = new Date().getFullYear() - d.getFullYear();
        if (age < 18) {
          newErrors.dataNascimento = true;
          newErrors.dataNascimentoMensagem = [
            HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.AGE_MIN,
          ];
          isFormValid = false;
        }
      }
    }

    if (valores.email && !/^\S+@\S+\.\S+$/.test(String(valores.email))) {
      newErrors.email = true;
      newErrors.emailMensagem = [HOSPEDE.INPUT_ERROR.EMAIL.VALID];
      isFormValid = false;
    }

    if (
      valores.telefone &&
      String(valores.telefone).replace(/[^0-9]/g, "").length < 10
    ) {
      newErrors.telefone = true;
      newErrors.telefoneMensagem = [HOSPEDE.INPUT_ERROR.TELEFONE.MIN_LEN];
      isFormValid = false;
    }

    if (valores.tipo === undefined || valores.tipo === null) {
      newErrors.tipo = true;
      newErrors.tipoMensagem = [HOSPEDE.INPUT_ERROR.TIPO.BLANK];
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const getInputClass = (field?: keyof ErrosHospede): string => {
    if (field && errors[field]) return "form-control is-invalid app-label input-error mt-2";
    return "form-control app-label mt-2";
  };

  const showMensagem = (field: keyof Hospede) => {
    const msgKey = `${String(field)}Mensagem` as keyof ErrosHospede;
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
      const hospedeToSend = {
        nomeHospede: model.nomeHospede,
        cpf: model.cpf,
        rg: model.rg || null,
        sexo: model.sexo,
        dataNascimento: model.dataNascimento
          ? String(model.dataNascimento)
          : "",
        email: model.email || null,
        telefone: model.telefone || null,
        tipo: Number(model.tipo),
        ativo: Number(model.ativo ?? 1),
      } as unknown as Hospede;

      await apiPostHospede(hospedeToSend);

      navigate(ROTA.HOSPEDE.LISTAR, {
        state: {
          toast: {
            message: HOSPEDE.OPERACAO.CRIAR.SUCESSO,
            type: "success",
          },
        },
      });
    } catch (error: any) {
      console.error(error);
      alert(HOSPEDE.OPERACAO.CRIAR.ERRO);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate(ROTA.HOSPEDE.LISTAR);
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
