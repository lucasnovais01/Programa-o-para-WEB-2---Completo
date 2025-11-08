import axios from "axios";
import { useState } from "react";
import { FaSave } from "react-icons/fa"
import { MdCancel } from "react-icons/md"

import { CIDADE } from "../../services/cidade/constants/cidade.constants";

import { apiPostCidade } from "../../services/cidade/api/api.cidade";


import type { Cidade } from "../../services/cidade/type/cidade";
import type { ErrosCidade } from "../../type/cidade";

export default function CriarCidade() {

  // hook para monitorar o estado do codigo
  // assincrono

  const [model, setModel] = useState<Cidade>(CIDADE.DADOS_INICIAIS); // ele pode ter um valor ou não pode ter nada

// controlar o estado do erro
  const [erros, setErrors] = useState<ErrosCidade>({});


  const handleChangeField = ( name: keyof Cidade, value: string ) => {
    setModel((prev) => ({...prev, [name]:value }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]:undefined, //name concatenando com a mensagem
    }));
  };

// Aquela mensagem de erro que aparece

  const validateField = (
    name: keyof Cidade, 
    e:React.FocusEvent<HTMLInputElement>
  ) => {

    let messages: string[] = [];
    const value = model[name];

    switch(name){
      case CIDADE.FIELDS.CODIGO:
        if (!value) messages.push(CIDADE.INPUT_ERROR.CODIGO.BLANK);

        if (value && typeof value !== "string") {
          messages.push(CIDADE.INPUT_ERROR.CODIGO.STRING);
        }
          
        break;

      case CIDADE.FIELDS.NOME:

        if (!value || String(value).trim().length === 0 ) {
          messages.push(CIDADE.INPUT_ERROR.NOME.BLANK);
        }

        if (String(value).length > 0 && String(value).length) {
          messages.push(CIDADE.INPUT_ERROR.NOME.MIN_LEN);
        }
        
        if (String(value).length > 100) {
          messages.push(CIDADE.INPUT_ERROR.NOME.MAX_LEN);
        }
        break;

    }

    setErrors((prev) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${name}Mensagem`]: messages.length > 0 ? messages : undefined, //name concatenando com a mensagem
    }));

    }
  

// a lógica da const validarFormulario, considere que o form está errado desde o começo

  const validarFormulario = (): boolean => {
    const newErrors : ErrosCidade = {}
    let isFormValid = true;

    const codCidadeMessages = [];

    if (!model.codCidade){
      codCidadeMessages.push(CIDADE.INPUT_ERROR.CODIGO.VALID)
    }

    if (model.codCidade && typeof model.codCidade !== "string"){
      codCidadeMessages.push(CIDADE.INPUT_ERROR.CODIGO.STRING)
    }

    if (codCidadeMessages.length > 0){
      newErrors.codCidade = true;
      newErrors.codCidadeMensagem = codCidadeMessages;
      isFormValid = false;
    }

    const nomeCidadeMessages = [];

    if (!model.nomeCidade || model.nomeCidade.trim().length){
      nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.BLANK)
    }

    if (model.nomeCidade) {
      if (model.nomeCidade?.length > 0) && model.nomeCidade.length
    }


    if (model.nomeCidade?.length > 0 && typeof model.codCidade !== "string"){
      nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.STRING)
    }


    if (nomeCidadeMessages.length > 0){
      newErrors.codCidade = true;
      newErrors.codCidadeMensagem = nomeCidadeMessages;
      isFormValid = false;
    }

    return isFormValid;
  };



  /* function getInputClass() {  modo classico, sem o arrow function */
  const getInputClass = () => {
    return 'form-control app-label mt-2'; // appInput é uma classe global, estiliza o input
  };


const onSubmitForm = async (e: any) => {
  e.preventDefault();

  if (!model) {
    return;
  }

  try {
    const response = apiPostCidade(model);
  }
  catch (error:any){
    console.log(error);
  }


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

              // a

              onChange={(e) => 
                handleChangeField(CIDADE.FIELDS.CODIGO,e.target.value)}

              onBlur = {(e) => validateField(CIDADE.FIELDS.CODIGO, e)}
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
  };
};