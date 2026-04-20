import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { ROTA } from "../../services/router/url";

import {
  apiDeleteUsuario,
  apiGetUsuario,
} from "../../services/usuario/api/api.usuario";
import type { Usuario } from "../../services/usuario/type/Usuario";

export default function ExcluirUsuario() {
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const [model, setModel] = useState<Usuario | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUsuario() {
      try {
        if (idUsuario) {
          const response = await apiGetUsuario(idUsuario);
          if (response.data.dados) {
            setModel(response.data.dados);
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    }

    getUsuario();
  }, [idUsuario]);

  const onSubmitForm = async (e: any) => {
    // não deixa executar o processo normal
    e.preventDefault();

    if (!idUsuario || !model) {
      return;
    }

    try {
      const response = apiDeleteUsuario(idUsuario);
      console.log(response);
      navigate(ROTA.USUARIO.LISTAR);
    } catch (error: any) {
      console.log(error);
    }
  };

  const getInputClass = () => {
    return "form-control app-label mt-2";
  };

  // Função para o botão Cancelar - redireciona para a lista de usuários
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROTA.USUARIO.LISTAR);
  };

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Excluir Usuário</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="idUsuario" className="app-label">
              ID:
            </label>
            <input
              id="idUsuario"
              name="idUsuario"
              defaultValue={model?.idUsuario}
              className={getInputClass()}
              readOnly={true}
              disabled={true}
            />
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="nomeUsuario" className="app-label">
              Nome:
            </label>
            <input
              id="nomeUsuario"
              name="nomeUsuario"
              defaultValue={model?.nomeUsuario}
              className={getInputClass()}
              readOnly={true}
              disabled={true}
            />
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="sobrenomeUsuario" className="app-label">
              Sobrenome:
            </label>
            <input
              id="sobrenomeUsuario"
              name="sobrenomeUsuario"
              defaultValue={model?.sobrenomeUsuario}
              className={getInputClass()}
              readOnly={true}
              disabled={true}
            />
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="emailUsuario" className="app-label">
              E-mail:
            </label>
            <input
              id="emailUsuario"
              name="emailUsuario"
              defaultValue={model?.emailUsuario}
              className={getInputClass()}
              readOnly={true}
              disabled={true}
            />
          </div>
          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Excluir o usuário"
            >
              <span className="btn-icon">
                <i>
                  <FaSave />
                </i>
              </span>
              Salvar
            </button>
            <button
              id="cancel"
              type="button"
              className="btn btn-cancel"
              title="Cancelar a exclusão do usuário"
              onClick={handleCancel}
            >
              <span className="btn-icon">
                <i>
                  <MdCancel />
                </i>
              </span>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
