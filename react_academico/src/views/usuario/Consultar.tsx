import { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";

import { apiGetUsuario } from "../../services/usuario/api/api.usuario";
import type { Usuario } from "../../services/usuario/type/Usuario";

export default function ConsultarUsuario() {
  const { idUsuario } = useParams<{ idUsuario: string }>();
  const [model, setModel] = useState<Usuario | null>(null);

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

  const getInputClass = () => {
    return "form-control app-label mt-2";
  };

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Consultar Usuário</h2>
        <form>
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
              id="cancel"
              type="button"
              className="btn btn-cancel"
              title="Cancelar o Cadastro do usuário"
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
