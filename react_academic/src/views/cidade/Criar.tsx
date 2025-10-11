import { FaSave } from "react-icons/fa"
import { MdCancel } from "react-icons/md"

export default function CriarCidade() {

  /* function getInputClass() {  modo classico, sem o arrow function */

  const getInputClass = () => {
    return 'form-control app-label mt-2'; // appInput é uma classe global, estiliza o input
  };

  return (
    <div className="display"> {/* display é uma classe global, centraliza, pois é o display flex */}

      <div className="card animated fadeInDown">{/* card é uma classe global, cria um cartão */}
        <h2>Nova Cidade</h2>
        <form>

          <div className="mb-2 mt-4">
            <label htmlFor="codCidade" className="appLabel">
              Código:
            </label>
            <input
              id="codCidade"
              name="codCidade"
              className={getInputClass()}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              >
            </input> {/* appInput é uma classe global, estiliza o input */}
          </div>

          <div className="mb-2 mt-4">
            <label htmlFor="nomeCidade" className="appLabel">
              Nome:
            </label>
            <input
              id="nomeCidade"
              name="nomeCidade"
              className={getInputClass()}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              >
            </input> {/* appInput é uma classe global, estiliza o input */}
          </div>

          
           <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-sucess"
              title="Cadastrar uma nova cidade"
            >
              <span className="btn-icon">
                <i>
                  <FaSave/>
                </i>
              </span>
              Salvar
            </button>
           
            <button
              id="cancel"
              type="button"
              className="btn btn-cancel"
              title="Cancelar uma nova cidade"
            >
              <span className="btn-icon">
                <i>
                  <MdCancel/>
                </i>
              </span>
              Cancelar
            </button>
           </div>
        </form>
      </div>
    </div>
  )
}
