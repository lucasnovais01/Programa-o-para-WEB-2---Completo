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
      // Chama o backend com os dados do formulário de login.
      // Aqui evitamos usar a rota de navegação do frontend (ROTA.AUTH.LOGIN),
      // porque esta rota é apenas a página de login no React.
      // O backend expõe `/auth/session/login` como endpoint de API.
      const response = await apiLogin(model);

      // O backend agora retorna o token JWT e os dados do usuário
      // em vez de enviar apenas uma string de texto.
      // Por isso podemos armazenar o accessToken e o usuário no localStorage.
      localStorage.setItem('accessToken', response.accessToken);
      if (response.usuario) {
        localStorage.setItem('usuario', JSON.stringify(response.usuario));
      } else {
        localStorage.removeItem('usuario');
      }

      // Notifica outros listeners (incluindo useAuth) que a autenticação mudou
      try {
        window.dispatchEvent(new CustomEvent('auth-change'));
      } catch (e) {
        const evt = document.createEvent('Event');
        evt.initEvent('auth-change', true, true);
        window.dispatchEvent(evt);
      }

      // Antes o código estava comentado porque o redirecionamento dava erro.
      // Esse erro existia porque o backend não retornava a mesma estrutura JSON
      // que o frontend esperava. Agora o fluxo está alinhado e podemos seguir.
      navigate(ROTA.DASHBOARD);
    } catch (error: any) {
      console.log(error);

      const errorMessage =
        error?.response?.data?.message ||
        'Erro ao realizar login. Tente novamente.';

      setErrors({
        geral: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');

    // Notifica outros listeners que a logout ocorreu
    try {
      window.dispatchEvent(new CustomEvent('auth-change'));
    } catch (e) {
      const evt = document.createEvent('Event');
      evt.initEvent('auth-change', true, true);
      window.dispatchEvent(evt);
    }

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