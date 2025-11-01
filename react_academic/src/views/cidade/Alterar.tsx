import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useParams } from "react-router-dom";

import { apiGetCidades, apiPutCidade } from "../../services/cidade/api/api.cidade";

import type { Cidade } from "../../services/cidade/type/cidade";

import { CIDADE } from "../../services/cidade/constants/cidade.constants";



export default function AlterarCidade() {

  const { idCidade } = useParams<{ idCidade: string }>();
  const [ model, setModel ] = useState<Cidade | null>(null);

  // usaremos o hook
  useEffect(() => {

    async function getCidade() {
      try {
        if (idCidade) {
          const response = await apiGetCidades(idCidade);
          console.log(response.data.dados);

          if (response.data.dados) {
            setModel(response.data.dados);
          }
        }
      }
      catch (error: any) {
        console.log(error);
      }
    }

  },[idCidade])


  const handleChangeField = ( name: keyof Cidade, value: string ) => {
    setModel((prev) => ({...prev, [name]:value }))
  };


  const onSubmitForm = async (e: any) => {
    e.preventDefault();

    if (!idCidade || !model) {
      return;
    }

    try {
      const response = apiPutCidade(idCidade, model);
      console.log(response);
    }
    catch (error:any){
      console.log(error);
    }
  };

  const getInputClass = () => {
    return 'form-control app-label mt-2'; // appInput é uma classe global, estiliza o input
  };


  return (
    <div className="display"> {/* display é uma classe global, centraliza, pois é o display flex */}

      <div className="card animated fadeInDown">{/* card é uma classe global, cria um cartão */}
        <h2>Nova Cidade</h2>

        <form onSubmit={(e) => onSubmitForm(e)}> 

          <div className="mb-2 mt-4">
            <label htmlFor="codCidade" className="appLabel">
              {CIDADE.LABEL.CODIGO}
            </label>
            <input
              id={CIDADE.FIELDS.CODIGO}
              name={CIDADE.FIELDS.CODIGO}
              value={model?.codCidade}
              className={getInputClass()}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) => handleChangeField(CIDADE.FIELDS.CODIGO,e.target.value)}
              >
            </input> {/* appInput é uma classe global, estiliza o input */}
          </div>

          <div className="mb-2 mt-4">
            <label htmlFor="nomeCidade" className="appLabel">
              {CIDADE.LABEL.NOME}
              {/*Nome:  ESTAVA ASSIM ANTES*/}
            </label>
            <input
              id={CIDADE.FIELDS.NOME}
              name={CIDADE.FIELDS.NOME}
              value={model?.nomeCidade}
              className={getInputClass()}
              readOnly={false}
              disabled={false}
              autoComplete="off"
              onChange={(e) => handleChangeField(CIDADE.FIELDS.NOME,e.target.value)}
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
