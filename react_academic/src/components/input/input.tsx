import { memo, type ComponentPropsWithoutRef, type ElementType } from "react";
import { CIDADE } from "../../services/cidade/constants/cidade.constants"

type CustomInputProps = {
  id?: string,
  name: string,
  Icon?: ElementType,
  label?: string,
  readonly?: boolean,
  disable?: boolean,
};

type ValidationProps = {
  error?: boolean,
  errorMensagem?: string[],
  touched?: boolean, // Controla o estado "perder foco"
  onTouchedChange? (touched: boolean) => void,
}

type InputProps = 
  CustomInputProps & ValidationProps & 
  Omit<ComponentPropsWithoutRef<'input'>,
  "id" | "name" | "readonly" | "disable">;



export const Input = memo({
  id,
  name,
  label,
  Icon,
  type="text",
  required = false,
  readOnly = false,
  disable = false,
  autoComplete = "off",
  error,
  errorMensagem,
  touched,
  onTouchedChange,
  ...rest

}: InputProps) => {

  const getInputClass = (): string => {
    if (!errors) "form-control app-label mt-2";

    const hasErrors = errors[name];
    if (hasErrors) {
      return "form-control is-invalid app-label input-error mt-2 ";
    }
    return "form-control app-label mt-2";
  };


  return (

    const handleBlur

    <label htmlFor="codCidade" className="app-label">
      {label}:
      {/* {CIDADE.LABEL.CODIGO}:  */}
    </label>

    <input
      id={inputId}
      name={name}
      type={type}
      className={getInputClass}
      autoComplete="off"
      onBlur = {handleBlur}
      {...rest}

    />
    {errors.codCidade && (
      <MensagemErro
        error={errors.codCidade}
        mensagem={errors.codCidadeMensagem}
      />
    )}
  )
}


      {/*}
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
      */}