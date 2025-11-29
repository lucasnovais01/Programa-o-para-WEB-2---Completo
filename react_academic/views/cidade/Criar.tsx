import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Input } from "../../components/input/Input";
import { CIDADE } from "../../services/cidade/constants/cidade.constants";
import { useCriar } from "../../services/cidade/hook/useCriar";

export default function CriarCidade() {
  const { model, errors, handleChangeField, validateField, onSubmitForm } =
    useCriar();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Nova Cidade</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4"></div>{" "}
          <Input
            label={CIDADE.LABEL.CODIGO}
            id={CIDADE.FIELDS.CODIGO}
            name={CIDADE.FIELDS.CODIGO}
            value={model?.codCidade}
            onChange={(e) =>
              handleChangeField(CIDADE.FIELDS.CODIGO, e.target.value)
            }
            onBlur={(e) => validateField(CIDADE.FIELDS.CODIGO, e)}
            error={errors.codCidade}
            errorMensagem={errors.codCidadeMensagem}
          />
          <div className="mb-2 mt-4">
            <Input
              label={CIDADE.LABEL.NOME}
              id={CIDADE.FIELDS.NOME}
              name={CIDADE.FIELDS.NOME}
              value={model?.nomeCidade}
              onChange={(e) =>
                handleChangeField(CIDADE.FIELDS.NOME, e.target.value)
              }
              onBlur={(e) => validateField(CIDADE.FIELDS.NOME, e)}
              error={errors.nomeCidade}
              errorMensagem={errors.nomeCidadeMensagem}
            />
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
