import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROTA } from "../../router/url";

import { apiLogin, type LoginRequest } from "../api/api.auth";

import { AUTH } from "../constants/auth.constants";

export const useLogin = () => {
  const navigate = useNavigate();
  
  const [model, setModel] = useState<LoginRequest>({
    emailUsuario: '',
    senhaUsuario: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeField = (name: keyof LoginRequest, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));
    setErrors((prev: any) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  const validateField = (name: keyof LoginRequest, value: string) => {
    let messages: string[] = [];

    switch (name) {
      case 'emailUsuario':
        if (!value || value.trim().length === 0) {
          messages.push(AUTH.INPUT_ERROR.EMAIL.BLANK);
        } 
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          messages.push(AUTH.INPUT_ERROR.EMAIL.VALID);
        }
        break;

      case 'senhaUsuario':
        if (!value || value.trim().length === 0) {
          messages.push(AUTH.INPUT_ERROR.SENHA.BLANK);
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
    const newErrors: any = {};
    let isFormValid = true;

    if (!model.emailUsuario || model.emailUsuario.trim().length === 0) {
      newErrors.emailUsuario = true;
      newErrors.emailUsuarioMensagem = [AUTH.INPUT_ERROR.EMAIL.BLANK];
      isFormValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.emailUsuario)) {
      newErrors.emailUsuario = true;

      newErrors.emailUsuarioMensagem = [AUTH.INPUT_ERROR.EMAIL.VALID];
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

  const onSubmitForm = async (e: any) => {
    e.preventDefault();

    if (!validarFormulario()) {
      console.log("Erro na validação dos dados");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiLogin(model);
      
      // Armazenar o token no localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      /* consertar, está dando erro

      // Redirecionar para a página inicial ou dashboard
      navigate(ROTA.DASHBOARD);
      */
    }
    catch (error: any) {

      console.log(error);

      if (error.response?.data?.message) {
        setErrors({
          geral: [error.response.data.message]
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