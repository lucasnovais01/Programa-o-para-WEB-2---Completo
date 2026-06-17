
// Não está mais em uso, devido a centralização

/* 

// Tanto o zCamposAlterar.tsx quanto o zCamposCriar.tsx são arquivos que centralizam a lógica 
// de manipulação de campos do formulário, como validação, exibição de mensagens de erro e 
// atualização do estado. Eles são usados para manter os componentes Alterar.tsx e Criar.tsx 
// limpos e focados apenas na renderização.

import React from "react";
import { HOSPEDE } from "../../services/1-hospede/constants/hospede.constants";
import type { ErrosHospede, Hospede } from "../../type/1-hospede";

// ============================================================
// ARQUIVO: zCamposAlterar.tsx
// ============================================================
// PROPÓSITO: Este arquivo centraliza TODA a lógica de manipulação
// de campos do formulário, mantendo o Alterar.tsx limpo e legível.
//
// O padrão é semelhante ao que o professor faz com módulos de
// serviço: separar responsabilidades em arquivos diferentes.
// ============================================================

// ============================================================
// COMPONENTE: MensagemErro
// ============================================================
// O que faz: Exibe mensagens de erro em VERMELHO abaixo de cada input
//
// Props:
//   - error?: boolean  → TRUE se há erro, FALSE ou undefined se não há
//   - mensagem?: string[] → Array de mensagens a exibir
//
// Como funciona:
//   1. Se error=false ou mensagem está vazia, retorna NULL (nada renderiza)
//   2. Se houver erro, renderiza um <div className="input-error-messages">
//   3. Cada mensagem é mapeada em um <div> com a classe "invalid-feedback"
//   4. A classe CSS "invalid-feedback" tem color: var(--text-red-600) [vermelho]
//
// Exemplo de uso no Alterar.tsx:
//   {_showMensagem(HOSPEDE.FIELDS.NOME)}  // Renderiza as mensagens do campo NOME
//
export const MensagemErro: React.FC<{
  error?: boolean;
  mensagem?: string[] | undefined;
}> = ({ error, mensagem }) => {
  // Se não há erro ou mensagem vazia, não renderiza nada
  if (!error || !mensagem || mensagem.length === 0) return null;

  // Renderiza o container de mensagens com estilo flexível
  // Mapeia cada mensagem do array em um <div> separado
  return (
    <div className="input-error-messages">
      {mensagem.map((m, i) => (
        <div key={i} className="invalid-feedback" style={{ display: "block" }}>
          {m}
        </div>
      ))}
    </div>
  );
};

// ============================================================
// FUNÇÃO HELPER: getInputClass
// ============================================================
// O que faz: Retorna a CLASSE CSS correta para um input,
// dependendo se ele tem erro ou não.
//
// Como funciona:
//   1. Se errors === null/undefined → retorna classe padrão (sem erro)
//   2. Se errors[field] === true → retorna classe com "is-invalid"
//      - "is-invalid" faz o input ficar com BORDA VERMELHA
//   3. Senão → retorna classe padrão
//
// COMO O TEXTBOX FICA COM PERÍMETRO AZUL:
// ────────────────────────────────────────
// No arquivo CSS "7-form.css", existe:
//
//   .form-group input:focus {
//     outline: none;
//     border-color: var(--text-blue-600);  ← AZUL! (#2563eb)
//     box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); ← Sombra azul suave
//   }
//
// Quando você CLICA (focus) no input, o navegador aplica essa regra CSS.
// - border-color: muda a borda para AZUL
// - box-shadow: adiciona um "halo" azul suave ao redor
//
// Se houver erro, o CSS também tem:
//   .form-group input.is-invalid {
//     border-color: var(--text-red-600);  ← VERMELHO quando há erro
//   }
//
export const getInputClass = (
  errors: ErrosHospede | undefined | null,
  field: keyof ErrosHospede
): string => {
  // Se não há objeto de erros, retorna classe padrão
  if (!errors) return "form-control app-label mt-2";

  // Verifica se este campo específico tem erro
  const hasErrors = !!errors[field];

  // Se tem erro, retorna classe que inclui "is-invalid" (ficará vermelho)
  if (hasErrors) return "form-control is-invalid app-label input-error mt-2";

  // Senão, retorna classe padrão
  return "form-control app-label mt-2";
};

// ============================================================
// FACTORY FUNCTION: createHandleChangeField
// ============================================================
// O que faz: CRIA uma função que atualiza o estado do formulário
// quando o usuário digita em um input.
//
// Por que é uma factory?
//   - Precisa de acesso a setModel e setErrors (state setters)
//   - Retorna uma função que será usada como onChange handler
//
// Como funciona:
//   1. Recebe setModel e setErrors como parâmetros
//   2. Retorna uma função que:
//      - Atualiza model (estado do formulário)
//      - LIMPA O ERRO deste campo (remove mensagem de erro)
//
// Exemplo de uso no Alterar.tsx:
//   const handleChangeField = createHandleChangeField(setModel, setErrors);
//   // Depois no input:
//   <input onChange={(e) => handleChangeField(HOSPEDE.FIELDS.NOME, e.target.value)} />
//

/*

export const createHandleChangeField = (
  setModel: React.Dispatch<React.SetStateAction<Hospede | null>>,
  setErrors: React.Dispatch<React.SetStateAction<ErrosHospede>>
) => {
  // Retorna a função que será usada como onChange handler
  return (name: keyof Hospede, value: string) => {
    // PASSO 1: Atualiza o valor do campo no modelo (state)
    setModel((prev) => ({ ...prev, [name]: value }));

    // PASSO 2: Limpa o erro deste campo quando o usuário começa a digitar
    // Isso melhora a UX: enquanto digita, o erro desaparece
    setErrors(
      (prev) =>
        ({
          ...prev,
          [name]: undefined, // Remove flag de erro
          [`${String(name)}Mensagem`]: undefined, // Remove mensagens
        } as unknown as ErrosHospede)
    );
  };
};

// ============================================================
// FACTORY FUNCTION: createValidateField
// ============================================================
// O que faz: CRIA uma função que VALIDA um campo específico
// quando o usuário clica para FORA do input (evento onBlur).
//
// Como funciona:
//   1. Recebe o setErrors do componente
//   2. Retorna uma função que recebe (name, event)
//   3. Extrai o valor do input do event
//   4. Valida conforme as REGRAS de cada campo
//   5. Armazena as mensagens de erro no estado
//
// REGRAS DE VALIDAÇÃO POR CAMPO:
// ───────────────────────────────
//   - NOME:
//     * Não pode estar vazio
//     * Mínimo 5 caracteres
//     * Máximo 100 caracteres
//
//   - CPF:
//     * Obrigatório
//     * Apenas números
//     * Exatamente 11 dígitos
//
//   - RG:
//     * Obrigatório
//     * Mínimo 7 caracteres
//     * Máximo 20 caracteres
//
//   - SEXO:
//     * Obrigatório
//     * Deve selecionar uma opção (M, F, O)
//
//   - DATA_NASCIMENTO:
//     * Obrigatório
//     * Deve ser uma data válida
//     * Não pode ser data futura
//     * Deve ter 18 anos ou mais
//
//   - EMAIL:
//     * Obrigatório
//     * Deve ter formato válido (algo@algo.algo)
//
//   - TELEFONE:
//     * Obrigatório
//     * Mínimo 10 dígitos (sem contar símbolos)
//
// COMO O CALENDÁRIO FUNCIONA NA DATA_NASCIMENTO:
// ────────────────────────────────────────────────
// No HTML input type="date" é nativo do navegador.
// Não é "colocado" em código React/JavaScript.
//
// O navegador (Chrome, Firefox, etc) AUTOMATICAMENTE fornece um calendário
// quando você clica em um input type="date".
//
// No Alterar.tsx, está assim:
//   <input
//     id={HOSPEDE.FIELDS.DATA_NASCIMENTO}
//     type="date"  ← AQUI! O navegador fornece o calendário
//     value={model?.dataNascimento ? ... : ""}
//     onChange={(e) => handleChangeField(...)}
//     onBlur={(e) => validateField(...)}  ← Valida quando sai do campo
//   />
//
// Não precisa instalar biblioteca, o navegador cuida disso.
// Se quiser customizar o visual, precisaria usar uma biblioteca como
// "react-datepicker" ou "react-date-picker".
//
export const createValidateField = (
  setErrors: React.Dispatch<React.SetStateAction<ErrosHospede>>
) => {
  // Retorna a função que será usada como onBlur handler
  return (
    name: keyof Hospede,
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    // Extrai o valor do input
    const value = (e.target as HTMLInputElement).value;

    // Array que acumula as mensagens de erro para este campo
    const messages: string[] = [];

    // SWITCH: Valida conforme o campo
    switch (name) {
      case HOSPEDE.FIELDS.NOME:
        if (!value || String(value).trim().length === 0)
          messages.push(HOSPEDE.INPUT_ERROR.NOME.BLANK);
        if (value && String(value).length < 5)
          messages.push(HOSPEDE.INPUT_ERROR.NOME.MIN_LEN);
        if (value && String(value).length > 100)
          messages.push(HOSPEDE.INPUT_ERROR.NOME.MAX_LEN);
        break;

      case HOSPEDE.FIELDS.CPF:
        if (!value) messages.push(HOSPEDE.INPUT_ERROR.CPF.BLANK);
        if (value && !/^[0-9]+$/.test(value))
          messages.push(HOSPEDE.INPUT_ERROR.CPF.PATTERN);
        if (value && value.length !== 11)
          messages.push(HOSPEDE.INPUT_ERROR.CPF.EXACT_LEN);
        break;

      case HOSPEDE.FIELDS.RG:
        if (!value) messages.push(HOSPEDE.INPUT_ERROR.RG.BLANK);
        if (value && value.length < 7)
          messages.push(HOSPEDE.INPUT_ERROR.RG.MIN_LEN);
        if (value && value.length > 20)
          messages.push(HOSPEDE.INPUT_ERROR.RG.MAX_LEN);
        break;

      case HOSPEDE.FIELDS.SEXO:
        if (!value) messages.push(HOSPEDE.INPUT_ERROR.SEXO.BLANK);
        break;

      case HOSPEDE.FIELDS.DATA_NASCIMENTO:
        if (!value) {
          messages.push(HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.BLANK);
        } else {
          // Converte string para Date
          const d = new Date(value);

          // Valida se é data válida
          if (isNaN(d.getTime()))
            messages.push(HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.VALID);
          // Valida se não é data futura
          else if (d >= new Date())
            messages.push(HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.PAST);
          // Valida se tem 18 anos ou mais
          else {
            const age = new Date().getFullYear() - d.getFullYear();
            if (age < 18)
              messages.push(HOSPEDE.INPUT_ERROR.DATA_NASCIMENTO.AGE_MIN);
          }
        }
        break;

      case HOSPEDE.FIELDS.EMAIL:
        if (!value) messages.push(HOSPEDE.INPUT_ERROR.EMAIL.BLANK);
        else if (!/^\S+@\S+\.\S+$/.test(value))
          messages.push(HOSPEDE.INPUT_ERROR.EMAIL.VALID);
        break;

      case HOSPEDE.FIELDS.TELEFONE:
        if (!value) messages.push(HOSPEDE.INPUT_ERROR.TELEFONE.BLANK);
        else if (value && value.replace(/[^0-9]/g, "").length < 10)
          messages.push(HOSPEDE.INPUT_ERROR.TELEFONE.MIN_LEN);
        break;

      default:
        break;
    }

    // Atualiza o estado de erros com as mensagens encontradas
    setErrors(
      (prev) =>
        ({
          ...prev,
          [name]: messages.length > 0, // TRUE se há erro, FALSE se não
          [`${String(name)}Mensagem`]:
            messages.length > 0 ? messages : undefined,
        } as unknown as ErrosHospede)
    );
  };
};

// ============================================================
// FACTORY FUNCTION: createShowMensagem
// ============================================================
// O que faz: CRIA uma função que renderiza as mensagens de erro
// de um campo específico.
//
// Como funciona:
//   1. Recebe o objeto de erros (errors)
//   2. Retorna uma função que:
//      - Busca o array de mensagens para um campo
//      - Renderiza o componente MensagemErro com as mensagens
//
// Exemplo de uso no Alterar.tsx:
//   const _showMensagem = createShowMensagem(errors);
//   // Depois no JSX:
//   {_showMensagem(HOSPEDE.FIELDS.NOME)}  // Renderiza as mensagens do NOME
//
export const createShowMensagem = (errors: ErrosHospede) => {
  return (field: keyof Hospede) => {
    // Constrói a chave para pegar o array de mensagens
    // Exemplo: field = "nomeHospede" → msgKey = "nomeHospedeMensagem"
    const msgKey = `${String(field)}Mensagem` as keyof ErrosHospede;
    const m = errors[msgKey] as any;

    // Se não há mensagem, retorna null (não renderiza)
    if (!m) return null;

    // Renderiza o componente MensagemErro com as mensagens
    // Array.isArray(m) converte para array se não for
    return <MensagemErro error={true} mensagem={Array.isArray(m) ? m : [m]} />;
  };
};

// ============================================================
// EXEMPLO DE COMO INTEGRAR NO COMPONENTE ALTERAR
// ============================================================
// Este é um exemplo COMENTADO de como esses helpers são usados
// no componente Alterar.tsx:
//
// export default function AlterarHospede() {
//   const [model, setModel] = useState<Hospede | null>(null);
//   const [errors, setErrors] = useState<ErrosHospede>({});
//
//   // PASSO 1: Criar as funções chamando as factories
//   const handleChangeField = createHandleChangeField(setModel, setErrors);
//   const validateField = createValidateField(setErrors);
//   const _showMensagem = createShowMensagem(errors);
//
//   // PASSO 2: Usar no JSX do input
//   return (
//     <div className="form-group">
//       <label>{HOSPEDE.LABEL.NOME}</label>
//       <div className="form-field-wrapper">
//         <input
//           type="text"
//           value={model?.nomeHospede || ""}
//           // Quando digita, atualiza state e limpa erro
//           onChange={(e) => handleChangeField(HOSPEDE.FIELDS.NOME, e.target.value)}
//           // Quando sai do campo, valida
//           onBlur={(e) => validateField(HOSPEDE.FIELDS.NOME, e)}
//         />

//         {_showMensagem(HOSPEDE.FIELDS.NOME)}
//       </div>
//     </div>
//   );
// }
// ============================================================

export default MensagemErro;

*/