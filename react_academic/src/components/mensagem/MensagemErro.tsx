import { error } from "console";

interface MensagemProps {
  error: boolean;
  mensagem: string | string [];
}

const MensagemErro = ({error, mensagem } : MensagemProps) {

  const unique = Array.from(

    new Set( typeof mensagem === "string" ? [mensagem] : mensagem || [])
  )
}

// Set é uma lista indexada, não pode ter elementos repetitidos dentro