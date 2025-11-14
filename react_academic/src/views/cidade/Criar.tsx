/******************************************************************************************
 * PARTE 1: IMPORTAÇÕES
 * 
 * Importamos:
 * - React e useState: para gerenciar estado local do formulário
 * - Ícones: para botões de salvar e cancelar
 * - Componente de erro: para exibir mensagens de validação
 * - API: função que faz POST para criar uma cidade
 * - Constantes: labels, erros, campos e dados iniciais da cidade
 * - Tipos: interface Cidade e ErrosCidade para tipagem forte
 ******************************************************************************************/
import { useState } from "react";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import MensagemErro from "../../components/mensagem/MensagemErro";
import { apiPostCidade } from "../../services/cidade/api/api.cidade";
import { CIDADE } from "../../services/cidade/constants/cidade.constants";
import type { Cidade, ErrosCidade } from "../../services/cidade/type/Cidade";

/******************************************************************************************
 * PARTE 2: COMPONENTE PRINCIPAL - CriarCidade
 * 
 * Função principal do componente.
 * Responsável por:
 * - Renderizar o formulário de cadastro de cidade
 * - Gerenciar estado do modelo (dados do formulário)
 * - Validar campos em tempo real
 * - Enviar dados para a API
 ******************************************************************************************/
export default function CriarCidade() {
  /****************************************************************************************
   * PARTE 2.1: ESTADO DO FORMULÁRIO
   * 
   * - `model`: armazena os dados digitados (codCidade, nomeCidade)
   * - `errors`: armazena erros de validação por campo (ex: { codCidade: true, ... })
   * - Ambos usam tipagem forte com interfaces Cidade e ErrosCidade
   ****************************************************************************************/
  const [model, setModel] = useState<Cidade>(CIDADE.DADOS_INCIAIS); // Estado inicial vazio
  const [errors, setErrors] = useState<ErrosCidade>({}); // Estado de erros vazio

  /****************************************************************************************
   * PARTE 2.2: FUNÇÃO DE ATUALIZAÇÃO DE CAMPOS (onChange)
   * 
   * Atualiza o `model` com o valor digitado e limpa erros do campo ao digitar.
   * Usamos spread (...) para manter os outros campos inalterados.
   ****************************************************************************************/
  const handleChangeField = (name: keyof Cidade, value: string) => {
    setModel((prev) => ({ ...prev, [name]: value }));

    // Limpa erro do campo assim que o usuário começa a corrigir
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      [`${name}Mensagem`]: undefined,
    }));
  };

  /****************************************************************************************
   * PARTE 2.3: VALIDAÇÃO INDIVIDUAL (onBlur)
   * 
   * Executada quando o campo perde o foco.
   * Valida apenas o campo em questão (CODIGO ou NOME).
   * Atualiza o estado `errors` com mensagens específicas.
   ****************************************************************************************/
  const validateField = (
    name: keyof Cidade,
    e: React.FocusEvent<HTMLInputElement>,
  ) => {
    let messages: string[] = [];
    const value = model[name];

    switch (name) {
      case CIDADE.FIELDS.CODIGO:
        if (!value) messages.push(CIDADE.INPUT_ERROR.CODIGO.BLANK);
        if (value && typeof value !== "string")
          messages.push(CIDADE.INPUT_ERROR.CODIGO.STRING);
        break;

      case CIDADE.FIELDS.NOME:
        if (!value || String(value).trim().length === 0) {
          messages.push(CIDADE.INPUT_ERROR.NOME.BLANK);
        }
        if (String(value).length > 0 && String(value).length < 6) {
          messages.push(CIDADE.INPUT_ERROR.NOME.MIN_LEN);
        }
        if (String(value).length > 100) {
          messages.push(CIDADE.INPUT_ERROR.NOME.MAX_LEN);
        }
        break;
    }

    // Atualiza o estado de erro apenas para o campo atual
    setErrors((prev) => ({
      ...prev,
      [name]: messages.length > 0,
      [`${name}Mensagem`]: messages.length > 0 ? messages : undefined,
    }));
  };

  /****************************************************************************************
   * PARTE 2.4: VALIDAÇÃO COMPLETA DO FORMULÁRIO (onSubmit)
   * 
   * Executada antes do envio.
   * Valida TODOS os campos de uma vez.
   * Retorna `true` se tudo estiver válido, `false` se houver erro.
   ****************************************************************************************/
  const validarFormulario = (): boolean => {
    const newErrors: ErrosCidade = {};
    let isFormValid = true;

    // Validação do campo CODIGO
    const codCidadeMessages = [];
    if (!model.codCidade) {
      codCidadeMessages.push(CIDADE.INPUT_ERROR.CODIGO.VALID);
    }
    if (model.codCidade && typeof model.codCidade !== "string") {
      codCidadeMessages.push(CIDADE.INPUT_ERROR.CODIGO.STRING);
    }
    if (codCidadeMessages.length > 0) {
      newErrors.codCidade = true;
      newErrors.codCidadeMensagem = codCidadeMessages;
      isFormValid = false;
    }

    // Validação do campo NOME
    const nomeCidadeMessages = [];
    if (!model.nomeCidade || model.nomeCidade.trim().length === 0) {
      nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.BLANK);
    }
    if (model.nomeCidade) {
      if (model.nomeCidade.length > 0 && model.nomeCidade.length < 6) {
        nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.MIN_LEN);
      }
      if (model.nomeCidade.length > 100) {
        nomeCidadeMessages.push(CIDADE.INPUT_ERROR.NOME.MAX_LEN);
      }
    }
    if (nomeCidadeMessages.length > 0) {
      newErrors.nomeCidade = true;
      newErrors.nomeCidadeMensagem = nomeCidadeMessages;
      isFormValid = false;
    }

    setErrors(newErrors); // Atualiza todos os erros de uma vez
    return isFormValid;
  };

  /****************************************************************************************
   * PARTE 2.5: ESTILIZAÇÃO DINÂMICA DOS CAMPOS
   * 
   * Retorna a classe CSS correta com base no estado de erro.
   * Usa `is-invalid` do Bootstrap para destacar campos com erro.
   ****************************************************************************************/
  const getInputClass = (name: keyof Cidade): string => {
    if (!errors) return "form-control app-label mt-2";

    const hasErrors = errors[name];
    if (hasErrors) {
      return "form-control is-invalid app-label input-error mt-2 ";
    }

    return "form-control app-label mt-2";
  };

  /****************************************************************************************
   * PARTE 2.6: ENVIO DO FORMULÁRIO
   * 
   * - Previne comportamento padrão do form (recarregar página)
   * - Valida o formulário
   * - Chama a API para criar a cidade
   * - Trata sucesso e erro com try/catch
   ****************************************************************************************/
  const onSubmitForm = async (e: any) => {
    e.preventDefault(); // Impede o reload da página

    if (!validarFormulario()) {
      console.log("Erro na digitação dos dados");
      return;
    }

    if (!model) return; // Segurança extra

    try {
      const response = await apiPostCidade(model); // Envia os dados
      console.log("Cidade criada com sucesso:", response);
    } catch (error: any) {
      console.log("Erro ao criar cidade:", error);
    }
  };

  /****************************************************************************************
   * PARTE 3: RENDERIZAÇÃO (JSX)
   * 
   * Estrutura visual do formulário:
   * - Card com título
   * - Campos com labels, inputs e mensagens de erro
   * - Botões de salvar e cancelar com ícones
   ****************************************************************************************/
  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Nova Cidade</h2>

        {/* Formulário com validação no submit */}
        <form onSubmit={(e) => onSubmitForm(e)}>
          
          {/* CAMPO: CÓDIGO DA CIDADE */}
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
            {/* Exibe mensagem de erro se houver */}
            {errors.codCidade && (
              <MensagemErro
                error={errors.codCidade}
                mensagem={errors.codCidadeMensagem}
              />
            )}
          </div>

          {/* CAMPO: NOME DA CIDADE */}
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
            {/* Exibe mensagem de erro se houver */}
            {errors.nomeCidade && (
              <MensagemErro
                error={errors.nomeCidade}
                mensagem={errors.nomeCidadeMensagem}
              />
            )}
          </div>

          {/* BOTÕES DE AÇÃO */}
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