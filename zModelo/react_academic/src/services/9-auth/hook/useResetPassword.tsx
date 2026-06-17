import type { FormEvent } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { apiResetPassword } from "../api/api.auth";

type ResetPasswordErrors = {
  senha?: boolean;
  senhaMensagem?: string[];
  confirmaSenha?: boolean;
  confirmaSenhaMensagem?: string[];
  geral?: string[];
};

export const useResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token') ?? '';

  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateField = (name: 'senha' | 'confirmaSenha', value: string) => {
    const messages: string[] = [];

    if (!value || value.trim().length === 0) {
      messages.push('O campo é obrigatório');
    }

    if (name === 'senha' && value && value.length < 6) {
      messages.push('A senha deve ter no mínimo 6 caracteres');
    }

    setErrors((prev) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${name}Mensagem`]: messages.length > 0 ? messages : undefined,
    }));

    return messages.length === 0;
  };

  const validateForm = (): boolean => {
    const isSenhaValid = validateField('senha', senha);
    const isConfirmaSenhaValid = validateField('confirmaSenha', confirmaSenha);

    if (senha && confirmaSenha && senha !== confirmaSenha) {
      setErrors((prev) => ({
        ...prev,
        confirmaSenha: true,
        confirmaSenhaMensagem: ['As senhas não conferem'],
      }));
      return false;
    }

    return isSenhaValid && isConfirmaSenhaValid;
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setErrors({ geral: ['Token de recuperação não encontrado. Abra o link enviado por e-mail.'] });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await apiResetPassword({ token, newPassword: senha });
      setSuccessMessage('Senha alterada com sucesso. Você pode fazer login agora.');
      setSenha('');
      setConfirmaSenha('');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrors({
        geral: [
          err.response?.data?.message ||
            'Erro ao redefinir a senha. Verifique o link e tente novamente.',
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (name: 'senha' | 'confirmaSenha'): string => {
    if (errors[name]) {
      return "form-control is-invalid app-label input-error mt-2";
    }
    return "form-control app-label mt-2";
  };

  return {
    token,
    senha,
    confirmaSenha,
    errors,
    successMessage,
    isLoading,
    setSenha,
    setConfirmaSenha,
    validateField,
    onSubmitForm,
    getInputClass,
  };
};
