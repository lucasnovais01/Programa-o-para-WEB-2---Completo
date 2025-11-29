import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import MensagemErro from "../../components/mensagem/MensagemErro";
import {
  CIDADE,
} from "../../services/cidade/constants/cidade.constants";
import { useAlterar } from "../../services/cidade/hook/useAlterar";

// Aqui foi implementado novas formas de validar os erros, e preciso colocar no Consultar.tsx e Excluir.tsx

  export default function AlterarCidade() {
    const {
      model,
      errors,
      handleChangeField,
      validateField,
      onSubmitForm,
      HandleCancel,
      getInputClass
    } = useAlterar();
  }


  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Alterar Cidade</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4">
            <label htmlFor="codCidade" className="app-label">
              {CIDADE.LABEL.CODIGO}:
            </label>
            <input
              id={CIDADE.FIELDS.CODIGO}
              name={CIDADE.FIELDS.CODIGO}
              value={model?.codCidade}
              className={getInputClass(CIDADE.FIELDS.CODIGO)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(CIDADE.FIELDS.CODIGO, e.target.value)
              }
              onBlur={(e) => validateField(CIDADE.FIELDS.CODIGO, e)}
            />
            {errors?.codCidade && (
              <MensagemErro
                error={errors.codCidade}
                mensagem={errors.codCidadeMensagem}
              />
            )}
          </div>
          <div className="mb-2 mt-4">
            <label htmlFor="nomeCidade" className="app-label">
              {CIDADE.LABEL.NOME}:
            </label>
            <input
              id={CIDADE.FIELDS.NOME}
              name={CIDADE.FIELDS.NOME}
              value={model?.nomeCidade}
              className={getInputClass(CIDADE.FIELDS.NOME)}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) =>
                handleChangeField(CIDADE.FIELDS.NOME, e.target.value)
              }
              onBlur={(e) => validateField(CIDADE.FIELDS.NOME, e)}
            />
            {errors?.nomeCidade && (
              <MensagemErro
                error={errors.nomeCidade}
                mensagem={errors.nomeCidadeMensagem}
              />
            )}
          </div>
          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Cadastrar uma nova cidade"
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
              title="Cancelar o Cadastro da cidade"
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
};
