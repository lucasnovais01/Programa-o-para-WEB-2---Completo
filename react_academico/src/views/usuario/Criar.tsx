import { FaSave } from "react-icons/fa";
// import { FaEye, FaEyeSlash } from "react-icons/fa"; // Ícones para implementar botão de mostrar/ocultar senha (funcionalidade futura)
import { MdCancel } from "react-icons/md";
import { Input } from "../../components/input/Input";

import { USUARIO } from "../../services/usuario/constants/usuario.constants";
import { useCriar } from "../../services/usuario/hook/useCriar";

export default function CriarUsuario() {
  const { model, errors, handleChangeField, validateField, onSubmitForm, handleCancel } =
    useCriar();

  return (
    <div className="display">
      <div className="card animated fadeInDown">
        <h2>Novo Usuário</h2>
        <form onSubmit={(e) => onSubmitForm(e)}>
          <div className="mb-2 mt-4"></div>{" "}

          {/* O campo ID é gerado automaticamente, então não é necessário exibi-lo no formulário de criação */}

          {/*  
          <Input
            label={USUARIO.LABEL.ID}
            id={USUARIO.FIELDS.ID}
            name={USUARIO.FIELDS.ID}
            value={model?.idUsuario}
            onChange={(e) =>
              handleChangeField(USUARIO.FIELDS.ID, e.target.value)
            }
            onBlur={(e) => validateField(USUARIO.FIELDS.ID, e)}
            error={errors.idUsuario}
            errorMensagem={errors.idUsuarioMensagem}
          />
          */}
          <div className="mb-2 mt-4">
            <Input
              label={USUARIO.LABEL.NOME}
              id={USUARIO.FIELDS.NOME}
              name={USUARIO.FIELDS.NOME}
              
              value={model?.nomeUsuario}
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.NOME, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.NOME, e)}
              error={errors.nomeUsuario}
              errorMensagem={errors.nomeUsuarioMensagem}
            />

            <Input
              label={USUARIO.LABEL.SOBRENOME}
              id={USUARIO.FIELDS.SOBRENOME}
              name={USUARIO.FIELDS.SOBRENOME}
              value={model?.sobrenomeUsuario}
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.SOBRENOME, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.SOBRENOME, e)}
              error={errors.sobrenomeUsuario}
              errorMensagem={errors.sobrenomeUsuarioMensagem}
            />

            <Input
              label={USUARIO.LABEL.EMAIL}
              id={USUARIO.FIELDS.EMAIL}
              name={USUARIO.FIELDS.EMAIL}
              value={model?.emailUsuario}
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.EMAIL, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.EMAIL, e)}
              error={errors.emailUsuario}
              errorMensagem={errors.emailUsuarioMensagem}
            />

            <Input
              label={USUARIO.LABEL.SENHA}
              id={USUARIO.FIELDS.SENHA}
              name={USUARIO.FIELDS.SENHA}
              type="password"
              value={model?.senhaUsuario}
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.SENHA, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.SENHA, e)}
              error={errors.senhaUsuario}
              errorMensagem={errors.senhaUsuarioMensagem}
            />
            {/* 
              O campo confirmarSenha é uma validação de segurança do frontend.
              Ele verifica se a senha digitada foi escrita corretamente, 
              evitando erros de digitação. O backend não armazena este campo,
              pois a verificação é feita apenas no momento do cadastro.
              
              COMO FUNCIONA A VALIDAÇÃO:
              - O hook useCriar.tsx contém a função validarFormulario() que é chamada
                ao clicar no botão "Salvar" (onSubmitForm)
              - Nessa função, há uma verificação que compara model.senhaUsuario com
                model.confirmarSenhaUsuario
              - Se as senhas não forem iguais, é adicionado um erro ao objeto newErrors
                com a mensagem "As senhas não conferem" (USUARIO.INPUT_ERROR.CONFIRMAR_SENHA.NOT_MATCH)
              - O campo confirmarSenhaUsuario NÃO é enviado ao backend, pois é apenas
                uma validação local do frontend. O backend só recebe senhaUsuario.
            */}
            <Input
              label={USUARIO.LABEL.CONFIRMAR_SENHA}
              id={USUARIO.FIELDS.CONFIRMAR_SENHA}
              name={USUARIO.FIELDS.CONFIRMAR_SENHA}
              type="password"
              value={model?.confirmarSenhaUsuario}
              onChange={(e) =>
                handleChangeField(USUARIO.FIELDS.CONFIRMAR_SENHA, e.target.value)
              }
              onBlur={(e) => validateField(USUARIO.FIELDS.CONFIRMAR_SENHA, e)}
              error={errors.confirmarSenhaUsuario}
              errorMensagem={errors.confirmarSenhaUsuarioMensagem}
            />
            {/* 
              =====================================================
              FUNCIONALIDADE DE MOSTRAR/OCULTAR SENHA
              =====================================================
              O ícone de "olhozinho" que aparece no campo de senha é uma funcionalidade
              NATIVA DO NAVEGADOR (Chrome, Edge, Firefox). Quando o input tem type="password",
              o navegador automaticamente adiciona um botão para mostrar/ocultar a senha.
              
              Para implementar um botão personalizado de mostrar/ocultar senha (usando react-icons),
              seria necessário:
              
              1. Adicionar um estado para controlar a visibilidade da senha:
                 const [showPassword, setShowPassword] = useState(false);
              
              2. Alterar o type do Input de "password" para showPassword ? "text" : "password"
              
              3. Adicionar um botão com ícone ao lado do campo:
                 
                 import { FaEye, FaEyeSlash } from 'react-icons/fa';
                 
                 <div className="password-input-wrapper">
                   <Input
                     type={showPassword ? "text" : "password"}
                     // ...outras props
                   />
                   <button
                     type="button"
                     className="password-toggle-btn"
                     onClick={() => setShowPassword(!showPassword)}
                   >
                     {showPassword ? <FaEyeSlash /> : <FaEye />}
                   </button>
                 </div>
              
              4. Adicionar CSS para posicionar o botão ao lado do input
              
              Por enquanto, manti a funcionalidade nativa do navegador que já funciona
              perfeitamente e não requer código adicional.
            */}

          </div>
          <div className="btn-content mt-4">
            <button
              id="submit"
              type="submit"
              className="btn btn-success"
              title="Cadastrar um novo usuário"
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
              title="Cancelar o Cadastro do usuário"
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
}
