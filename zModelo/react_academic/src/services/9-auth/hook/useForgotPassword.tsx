import type { FormEvent } from "react";
import { useState } from "react";
import { apiForgotPassword } from "../api/api.auth";

type ForgotPasswordErrors = {
  email?: boolean;
  emailMensagem?: string[];
  geral?: string[];
};

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChangeEmail = (value: string) => {
    setEmail(value);
    setSuccessMessage(null);
    setErrors({});
  };

  const validateEmail = (value: string) => {
    const messages: string[] = [];

    if (!value || value.trim().length === 0) {
      messages.push('O e-mail deve ser informado');
    }

    if (value && !value.includes('@')) {
      messages.push('Informe um e-mail válido');
    }

    setErrors((prev) => ({
      ...prev,
      email: messages.length > 0,
      emailMensagem: messages.length > 0 ? messages : undefined,
    }));

    return messages.length === 0;
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      await apiForgotPassword({ email });
      setSuccessMessage(
        'Se o e-mail existir em nosso sistema, você receberá instruções para redefinir a senha.'
      );
      setEmail('');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrors({
        geral: [
          err.response?.data?.message ||
            'Erro ao enviar solicitação de recuperação. Tente novamente.',
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (): string => {
    if (errors.email) {
      return "form-control is-invalid app-label input-error mt-2";
    }
    return "form-control app-label mt-2";
  };

  return {
    email,
    errors,
    isLoading,
    successMessage,
    handleChangeEmail,
    validateEmail,
    onSubmitForm,
    getInputClass,
  };
};
