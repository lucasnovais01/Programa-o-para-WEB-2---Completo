import { error } from "console";

interface MensagemProps {
  error: boolean;
  mensagem: string | string [];
}

const MensagemErro = ({error, mensagem } : MensagemProps) => {

  const unique = Array.from(

    new Set( typeof mensagem === "string" ? [mensagem] : mensagem || [])
  );

  return (
    <>
      {
        error && unique.length > 0 && (
          <div className="invalid-feedback">
            {
              unique.map((item, index) => (
                <p key={index} style={{ margin: "0", color: "red"}}>
                <span>
                  {item}
                </span>

                </p>
              ))
            }          
          </div>
        )
      }
    </>
  )
}

export default MensagemErro;

// Set é uma lista indexada, não pode ter elementos repetitidos dentro