import {
  memo,
  useCallback,
  useId,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type FocusEvent,
} from "react";

type CustomInputProps = {
  id?: string;
  name?: string;
  Icon?: ElementType;
  label?: string;
  readonly?: boolean;
  disable?: boolean;
};

type ValidationProps = {
  error?: boolean;
  errorMensagem?: string[];
  touched?: boolean; // Controlar o estado "perder foco" externamente
  onTouchedChange?: (touched: boolean) => void;
};

type InputProps = CustomInputProps &
  ValidationProps &
  Omit<
    ComponentPropsWithoutRef<"input">,
    "id" | "name" | "readonly" | "disabled"
  >;

export const Input = memo(
  ({
    id,
    name,
    label,
    Icon,
    type = "text",
    required = false,
    readOnly = false,
    disable = false,
    autoComplete = "off",
    error,
    errorMensagem = [],
    touched,
    onTouchedChange,
    className,
    onBlur,
    ...rest
  }: InputProps) => {
    const reactId = useId();
    const inputId = id ?? `input-${reactId}`;
    const errorId = `${inputId}-errors`;
    const [touchedState, setTochedState] = useState<boolean>(false);
    const isTouched = touched ?? touchedState;

    const hasErrors = useMemo(() => {
      if (error === true) return true;
      if (error === false) return false;
      return errorMensagem.length > 0 && isTouched;
    }, [error, errorMensagem.length, isTouched]);

    const isValid = useMemo(() => {
      return error === false && isTouched;
    }, [error, isTouched]);

    const getInputClass = useMemo(() => {
      return [
        "form-control",
        "app-input",
        hasErrors ? "is-invalid" : "",
        isValid ? "is-valid" : "",
        className, // classe passada na props.
      ]
        .filter(Boolean) // remove as classes vázias
        .join("");
    }, [hasErrors, isValid, className]);

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        if (!readOnly && !disable) {
          onBlur?.(e);
          if (touched === undefined) {
            setTochedState(true);
          }
          onTouchedChange?.(true);
        }
      },
      [readOnly, disable, onBlur, touched, onTouchedChange],
    );

    const showErrors = hasErrors && errorMensagem.length > 0;

    return (
      <>
        <label htmlFor={inputId} className="app-label">
          {label}:{required && <span aria-hidden="true"> *</span>}
        </label>
        <input
          id={inputId}
          name={name}
          type={type}
          className={getInputClass}
          onBlur={handleBlur}
          //repassa todas as outras props (value, onChange, placeholder, disabled,etc )
          {...rest}
          aria-invalid={hasErrors || undefined}
          aria-describedby={showErrors ? errorId : undefined}
        />
        {/* mensagem de erro */}
        <ul
          id={errorId}
          className={`invalid-feedback d-block error-container
            ${showErrors ? "has-error" : ""}
          `}
        >
          {showErrors ? (
            errorMensagem.map((msg, idx) => <li key={idx}>{msg}</li>)
          ) : (
            <li>&nbsp;</li>
          )}
        </ul>
      </>
    );
  },
);
