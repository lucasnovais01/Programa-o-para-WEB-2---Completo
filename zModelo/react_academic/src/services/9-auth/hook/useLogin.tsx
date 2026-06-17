import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../../router/url";
import { useAuth } from "./useAuth";

import { apiLogin, type LoginRequest } from "../api/api.auth";

import { AUTH } from "../constants/auth.constants";

type LoginErrors = {
  [key: string]: boolean | string[] | undefined;
  geral?: string[];
  loginUsuario?: boolean;
  loginUsuarioMensagem?: string[];
  senhaUsuario?: boolean;
  senhaUsuarioMensagem?: string[];
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  
  const [model, setModel] = useState<LoginRequest>({
    loginUsuario: '',
    senhaUsuario: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeField = (name: keyof LoginRequest, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: LoginErrors) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (name: keyof LoginRequest, value: string) => {
    const messages: string[] = [];

    switch (name) {
      case 'loginUsuario':
        if (!value || value.trim().length === 0) {
          messages.push(AUTH.INPUT_ERROR.LOGIN.BLANK);
        }
        break;

      case 'senhaUsuario':
        if (!value || value.trim().length === 0) {
          messages.push(AUTH.INPUT_ERROR.SENHA.BLANK);
        }
        break;
    }

    setErrors((prev: LoginErrors) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${name}Mensagem`]: messages.length > 0 ? messages : undefined,
    }));
  };

  const validarFormulario = (): boolean => {
    const newErrors: LoginErrors = {};
    let isFormValid = true;

    if (!model.loginUsuario || model.loginUsuario.trim().length === 0) {
      newErrors.loginUsuario = true;
      newErrors.loginUsuarioMensagem = [AUTH.INPUT_ERROR.LOGIN.BLANK];
      isFormValid = false;
    }

    if (!model.senhaUsuario || model.senhaUsuario.trim().length === 0) {
      newErrors.senhaUsuario = true;
      newErrors.senhaUsuarioMensagem = [AUTH.INPUT_ERROR.SENHA.BLANK];
      isFormValid = false;
    }

    setErrors(newErrors);
    return isFormValid;
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validarFormulario()) {
      console.log("Erro na validação dos dados");
      return;
    }

    setIsLoading(true);

    console.log('[useLogin.onSubmitForm] enviando login', model);

    try {
      const response = await apiLogin(model);
      
      // Atualizar contexto global de autenticação
      // Isso dispara re-render em todos os componentes que usam useAuth()
      // Incluindo Layout, que mostra o botão de logout e o nome do usuário
      setAuth(response.accessToken, response.usuario);

      // Redirecionar para a página inicial ou dashboard
      navigate(ROTA.DASHBOARD);
    }
    catch (error: unknown) {

      console.log('[useLogin.onSubmitForm] erro na requisição de login:', error);
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      console.log('[useLogin.onSubmitForm] erro response:', err.response);

      if (err.response?.data?.message) {
        setErrors({
          geral: [err.response.data.message]
        });
      } else {
        setErrors({
          geral: ['Erro ao realizar login. Tente novamente.']
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');

    navigate(ROTA.AUTH.LOGIN);
  };

  const getInputClass = (name: string): string => {
    if (errors[name]) {
      return "form-control is-invalid app-label input-error mt-2";
    }
    return "form-control app-label mt-2";
  };

  return {
    model,
    errors,
    isLoading,
    handleChangeField,
    validateField,
    onSubmitForm,
    logout,
    getInputClass,
  };
};