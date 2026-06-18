import { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import MensagemErro from '../../components/mensagem/MensagemErro';
import { ROTA } from '../../services/router/url';

export default function RequestPasswordRecovery() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!email || !validateEmail(email)) {
      setErrors({ email: 'Informe um e-mail válido' });
      return;
    }

    setIsLoading(true);

    try {
      // Substitua pela sua URL real do backend
      const response = await fetch('http://localhost:8000/rest/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setErrors({ email: 'Erro ao enviar link. Tente novamente.' });
      }
    } catch (err) {
      setErrors({ email: 'Erro de conexão com o servidor.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="display">
        <div className="card animated fadeInDown text-center">
          <h2>Link enviado!</h2>
          <p>Verifique sua caixa de entrada (e spam).</p>
          <Link to={ROTA.AUTH.LOGIN} className="btn btn-success mt-3">
            Voltar para Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Recuperar Senha</h2>
        <p>Digite seu e-mail para receber o link de recuperação.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="app-label">E-mail</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              disabled={isLoading}
            />
            {errors.email && <MensagemErro error={true} mensagem={[errors.email]} />}
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Link'}
            {!isLoading && <FaEnvelope className="ms-2" />}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to={ROTA.AUTH.LOGIN}>Voltar ao Login</Link>
        </div>
      </div>
    </div>
  );
}