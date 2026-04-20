export interface Usuario {
  idUsuario?: string;
  nomeUsuario?: string;
  sobrenomeUsuario?: string;
  emailUsuario?: string;
  senhaUsuario?: string;
  confirmarSenhaUsuario?: string;
}

export interface ErrosUsuario {
  idUsuario?: boolean;
  nomeUsuario?: boolean;
  sobrenomeUsuario?: boolean;
  emailUsuario?: boolean;
  senhaUsuario?: boolean;
  confirmarSenhaUsuario?: boolean;

  idUsuarioMensagem?: string[];
  nomeUsuarioMensagem?: string[];
  sobrenomeUsuarioMensagem?: string[];
  emailUsuarioMensagem?: string[];
  senhaUsuarioMensagem?: string[];
  confirmarSenhaUsuarioMensagem?: string[];
}
