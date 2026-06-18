import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import MensagemErro from '../../components/mensagem/MensagemErro';
import { ROTA } from '../../services/router/url';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      alert('Token inválido ou expirado.');
      navigate(ROTA.AUTH.LOGIN);
    }
  }, [token, navigate]);

  const validarFormulario = () => {
    const newErrors: any = {};

    if (novaSenha.length < 6) {
      newErrors.novaSenha = 'A senha deve ter no mínimo 6 caracteres';
    }
    if (novaSenha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario() || !token) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/rest/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate(ROTA.AUTH.LOGIN), 2000);
      } else {
        alert('Erro ao redefinir senha. Token pode estar inválido.');
      }
    } catch (err) {
      alert('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="display">
        <div className="card text-center">
          <h2>Senha alterada com sucesso!</h2>
          <p>Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Nova Senha</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="app-label">Nova Senha</label>
            <input
              type="password"
              className={`form-control ${errors.novaSenha ? 'is-invalid' : ''}`}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            {errors.novaSenha && <MensagemErro error={true} mensagem={[errors.novaSenha]} />}
          </div>

          <div className="mb-3">
            <label className="app-label">Confirmar Nova Senha</label>
            <input
              type="password"
              className={`form-control ${errors.confirmarSenha ? 'is-invalid' : ''}`}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            {errors.confirmarSenha && <MensagemErro error={true} mensagem={[errors.confirmarSenha]} />}
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
            {isLoading ? 'Alterando...' : 'Alterar Senha'} <FaSave className="ms-2" />
          </button>
        </form>
      </div>
    </div>
  );
}